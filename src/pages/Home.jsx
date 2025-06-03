// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";

import MediaCard   from "../components/MediaCard";
import Carousel    from "../components/Carousel";
import FriendFeed  from "../components/FriendFeed";
import GenreStats  from "../components/GenreStats";
import mapTrack    from "../utils/mapTrack";
import GenreTimeline from '../components/GenreTimeline';

const API = import.meta.env.VITE_API_BASE_URL ?? "";

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [friendActivity,  setFriendActivity]  = useState([]);
  const [topAlbums,       setTopAlbums]       = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        console.log("Home: Fetching data from API:", API);

        let recRes;
        try {
          recRes = await axios.get(`${API}/api/recommendations`, {
            withCredentials: true,
            timeout: 10000,
          });
        } catch (err) {
          const status = err.response?.status;
          console.warn("Home: Recommendations request failed:", status || err.message);

          if (status === 403) {
            setError("Please connect your Spotify account to see recommendations.");
          } else if (status === 204) {
            setError("We couldn't generate recommendations yet. Try listening to more music!");
          } else {
            setError("Unable to load recommendations. Please try again later.");
          }

          recRes = { data: [] };
        }

        const friendsRes = await axios
          .get(`${API}/api/friends/activity`, {
            withCredentials: true,
            timeout: 10000,
          })
          .catch((err) => {
            console.warn("Home: Friend activity request failed:", err.response?.status || err.message);
            return { data: [] };
          });

        if (cancelled) return;

        const mappedRecommendations = recRes.data ?? [];

        let albumsArray = [];
        try {
          const spotifyRes = await axios.get(`${API}/api/me/spotify`, {
            withCredentials: true,
            timeout: 10000,
          });
          if (!cancelled && spotifyRes.data?.top) {
            const topTracks = spotifyRes.data.top;
            const albumMap = {};

            topTracks.forEach((t) => {
              const album = t.album || {};
              const albumId = album.id || album.name || String(Math.random());
              if (!albumMap[albumId]) {
                const imgUrl = Array.isArray(album.images) && album.images.length > 0
                  ? album.images[0].url
                  : "";
                const artistNames = Array.isArray(t.artists)
                  ? t.artists.map((a) => a.name).join(", ")
                  : "";
                albumMap[albumId] = {
                  id: albumId,
                  name: album.name || "Unknown Album",
                  image: imgUrl,
                  artistNames,
                };
              }
            });
            albumsArray = Object.values(albumMap);
          }
        } catch (spotifyErr) {
          console.warn(
            "Home: Error fetching top tracks from /api/me/spotify:",
            spotifyErr.response?.status || spotifyErr.message
          );
        }

        if (!cancelled) {
          setRecommendations(mappedRecommendations);
          setFriendActivity(friendsRes.data ?? []);
          setTopAlbums(albumsArray);
        }
      } catch (err) {
        console.error("Home: Fetch error:", err);

        let errorMessage = "Failed to load data.";
        if (err.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Please try again.";
        } else if (err.response?.status === 401) {
          errorMessage = "Please log in to access your music data.";
        } else if (!navigator.onLine) {
          errorMessage = "No internet connection. Please check your connection.";
        }
        if (!cancelled) setError(errorMessage);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p>Loading your music...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400 text-center px-4">
        <div className="space-y-4">
          <p className="text-lg font-semibold">Oops! Something went wrong</p>
          <p className="text-sm text-white/70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="pb-24 space-y-16">
      {/* ────────────── Top Albums ────────────── */}
      {topAlbums.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-white">Top Albums</h2>
          <Carousel
            items={topAlbums}
            renderItem={(album) => (
              <div
                key={album.id}
                className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white flex flex-col items-center w-40"
              >
                {album.image ? (
                  <img
                    src={album.image}
                    alt={album.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-800 flex items-center justify-center rounded mb-2">
                    <span className="text-gray-400 text-sm">No Cover</span>
                  </div>
                )}
                <div className="font-medium text-sm truncate w-full text-center">
                  {album.name}
                </div>
                <div className="text-xs text-gray-400 truncate w-full text-center">
                  {album.artistNames}
                </div>
              </div>
            )}
          />
        </section>
      )}

      {/* ───────── Made for You ───────── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Made for you</h2>
        {recommendations.length > 0 ? (
          <Carousel
            items={recommendations}
            renderItem={(item) => <MediaCard key={item.id} media={item} />}
          />
        ) : (
          <div className="text-center py-8 text-white/60">
            <p>No recommendations available.</p>
            <p className="text-sm mt-2">
              Connect your Spotify account or listen to more music to get personalized picks.
            </p>
          </div>
        )}
      </section>

      {/* ───────── Genre Footprint ───────── */}
      <section className="container mx-auto px-4">
        <GenreStats />
        <GenreTimeline />
      </section>

      {/* ───────── Friend Activity ───────── */}
      <aside className="lg:fixed lg:right-6 lg:top-28 lg:w-72">
        <FriendFeed activity={friendActivity} />
      </aside>
    </main>
  );
}
