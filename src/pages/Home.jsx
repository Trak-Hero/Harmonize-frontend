// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";

import MediaCard   from "../components/MediaCard";
import Carousel    from "../components/Carousel";   // ← updated
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
        // … your existing recommendations / recent / friend activity fetch logic …

        // ─── New: Fetch Spotify “top tracks” to derive topAlbums ───
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
                const imgUrl =
                  Array.isArray(album.images) && album.images.length > 0
                    ? album.images[0].url
                    : "";
                const artistNames = Array.isArray(t.artists)
                  ? t.artists.map((a) => a.name).join(", ")
                  : "";
                albumMap[albumId] = {
                  id:           albumId,
                  name:         album.name || "Unknown Album",
                  image:        imgUrl,
                  artistNames:  artistNames,
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
          setTopAlbums(albumsArray);
          // … setRecommendations, setRecent, setFriendActivity, etc. …
        }
      } catch (err) {
        // … existing error handling …
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
    /* … existing error UI … */
  }

  return (
    <main className="pb-24 space-y-16">
      {/* ────────────── New “Top Albums” Carousel ────────────── */}
      {topAlbums.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-white">Top Albums</h2>
          <Carousel
            items={topAlbums}
            speed={25}      // 25s per full loop (adjust if you want it faster/slower)
            gap={12}        // 12px between each album card (adjust if desired)
            renderItem={(album) => (
              <div className="bg-black/50 rounded-lg p-2 flex flex-col items-center w-40">
                {album.image ? (
                  <img
                    src={album.image}
                    alt={album.name}
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-800 flex items-center justify-center rounded-lg mb-2">
                    <span className="text-gray-400 text-sm">No Cover</span>
                  </div>
                )}
                <div className="font-medium text-sm truncate w-full text-center text-white">
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
            speed={30}  // slower loop if you want to savor each card
            gap={16}
            renderItem={(item) => (
              <div className="w-40">
                <MediaCard media={item} />
              </div>
            )}
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
              <div key={track.id} className="w-full">
                <MediaCard media={track} />
              </div>
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

      {/* ───────── “Friend activity” Sidebar ───────── */}
      <aside className="lg:fixed lg:right-6 lg:top-28 lg:w-72">
        <FriendFeed activity={friendActivity} />
      </aside>
    </main>
  );
}
