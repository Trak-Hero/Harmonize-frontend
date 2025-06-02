// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";

import MediaCard   from "../components/MediaCard";
import Carousel    from "../components/Carousel";
import FriendFeed  from "../components/FriendFeed";
import mapTrack    from "../utils/mapTrack";

const API = import.meta.env.VITE_API_BASE_URL ?? "";

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [recent,          setRecent]          = useState([]);
  const [friendActivity,  setFriendActivity]  = useState([]);
  const [topAlbums,       setTopAlbums]       = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        console.log("Home: Fetching data from API:", API);

        // 1) Fetch recommendations, recent, and friend activity in parallel
        const [recRes, recentRes, friendsRes] = await Promise.all([
          axios
            .get(`${API}/api/recommendations`, {
              withCredentials: true,
              timeout: 10000,
            })
            .catch((err) => {
              console.warn(
                "Home: Recommendations request failed:",
                err.response?.status || err.message
              );
              return { data: [] };
            }),
          axios
            .get(`${API}/api/recent`, {
              withCredentials: true,
              timeout: 10000,
            })
            .catch((err) => {
              console.warn(
                "Home: Recent tracks request failed:",
                err.response?.status || err.message
              );
              return { data: [] };
            }),
          axios
            .get(`${API}/api/friends/activity`, {
              withCredentials: true,
              timeout: 10000,
            })
            .catch((err) => {
              console.warn(
                "Home: Friend activity request failed:",
                err.response?.status || err.message
              );
              return { data: [] };
            }),
        ]);

        if (cancelled) return;

        console.log("Home: Raw API responses:", {
          recommendations: recRes.data?.length || 0,
          recent:         recentRes.data?.length || 0,
          friends:        friendsRes.data?.length || 0,
        });

        // 2) Map recommendations and recent → MediaCard format
        const mappedRecommendations = (recRes.data ?? [])
          .map(mapTrack)
          .filter((track) => track !== null);

        const mappedRecent = (recentRes.data ?? [])
          .map(mapTrack)
          .filter((track) => track !== null);

        console.log("Home: Mapped tracks:", {
          recommendations: mappedRecommendations.length,
          recent:         mappedRecent.length,
        });

        // 3) Separately fetch /api/me/spotify to get “top tracks” from Spotify → then derive unique albums
        let albumsArray = [];
        try {
          const spotifyRes = await axios.get(`${API}/api/me/spotify`, {
            withCredentials: true,
            timeout: 10000,
          });
          if (!cancelled && spotifyRes.data?.top) {
            const topTracks = spotifyRes.data.top; // array of track‐objects

            // Build a map of albumId → albumObject
            const albumMap = {};
            topTracks.forEach((track) => {
              // Some track objects might be wrapped in { track: {...} }, but
              // in our /api/me/spotify implementation, we returned track directly.
              const t = track; // if wrapped, use track.track instead
              const album = t.album || {};

              // Compose an “album key”—use album.id or fallback to name
              const albumId = album.id || album.name || String(Math.random());
              if (!albumMap[albumId]) {
                // Find the primary image (first in the array)
                const imgUrl = Array.isArray(album.images) && album.images.length > 0
                  ? album.images[0].url
                  : "";

                // Join all artist names into one string
                const artistNames = Array.isArray(t.artists)
                  ? t.artists.map((a) => a.name).join(", ")
                  : "";

                albumMap[albumId] = {
                  id:           albumId,
                  name:         album.name || "Unknown Album",
                  image:        imgUrl,
                  artistNames, // e.g. “Radiohead”
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
          setRecent(mappedRecent);
          setFriendActivity(friendsRes.data ?? []);
          setTopAlbums(albumsArray);
        }
      } catch (err) {
        console.error("Home: Fetch error:", err);

        // Determine a user‐friendly error message
        let errorMessage = "Failed to load data.";
        if (err.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Please try again.";
        } else if (err.response?.status === 401) {
          errorMessage = "Please log in to access your music data.";
        } else if (err.response?.status === 403) {
          errorMessage = "Please connect your Spotify account.";
        } else if (err.response?.status >= 500) {
          errorMessage = "Server error. Please try again later.";
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
      {/* ────────────── New “Top Albums” Carousel ────────────── */}
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

      {/* ───────── “Made for you” Carousel ───────── */}
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
              Connect your Spotify account to see personalized recommendations.
            </p>
          </div>
        )}
      </section>

      {/* ───────── “Recently played” Grid ───────── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-white">Recently played</h2>
        {recent.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recent.map((track) => (
              <MediaCard key={track.id} media={track} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-white/60">
            <p>No recent tracks found.</p>
            <p className="text-sm mt-2">
              Start listening to music on Spotify to see your recent tracks here.
            </p>
          </div>
        )}
      </section>

      {/* ───────── Fixed “Friend activity” Sidebar ───────── */}
      <aside className="lg:fixed lg:right-6 lg:top-28 lg:w-72">
        <FriendFeed activity={friendActivity} />
      </aside>
    </main>
  );
}
