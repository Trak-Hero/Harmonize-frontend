// src/pages/Home.jsx
import { useEffect, useState } from "react";
import axios from "axios";

import MediaCard   from "../components/MediaCard";
import Carousel    from "../components/Carousel";   // <— our new scrollable carousel
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

    async function fetchData() {
      try {
        // ─── 1) fetch “Made for you” + “Recently played” + “Friend activity” ───
        const [recRes, recentRes, friendRes] = await Promise.all([
          axios
            .get(`${API}/spotify/recommendations`, { withCredentials: true })
            .catch((e) => {
              console.warn("[Home] recommendations failed:", e);
              return { data: [] };
            }),
          axios
            .get(`${API}/spotify/recent`, { withCredentials: true })
            .catch((e) => {
              console.warn("[Home] recent tracks failed:", e);
              return { data: { items: [] } };
            }),
          axios
            .get(`${API}/spotify/friend-activity`, { withCredentials: true })
            .catch((e) => {
              console.warn("[Home] friend activity failed:", e);
              return { data: [] };
            }),
        ]);

        if (cancelled) return;

        const mappedRecommendations = (recRes.data ?? []).map(mapTrack).filter((x) => x);
        const mappedRecent = (recentRes.data.items ?? []).map(mapTrack).filter((x) => x);

        setRecommendations(mappedRecommendations);
        setRecent(mappedRecent);
        setFriendActivity(friendRes.data ?? []);

        // ─── 2) fetch “Top Tracks” from /api/me/spotify → derive unique Top Albums ───
        try {
          const spotifyRes = await axios.get(`${API}/api/me/spotify`, {
            withCredentials: true,
          });
          if (!cancelled && spotifyRes.data?.top) {
            const topTracks = spotifyRes.data.top;
            const albumMap = {};

            topTracks.forEach((t) => {
              const album = t.album || {};
              // Use album.id as key (or fallback to album.name + first artist)
              const albumId = album.id || `${album.name}-${(t.artists?.[0]?.name)||""}`;
              if (!albumMap[albumId]) {
                // pick the first image (if any)
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
                  artistNames, // e.g. "Radiohead"
                };
              }
            });

            const dedupedAlbums = Object.values(albumMap);
            setTopAlbums(dedupedAlbums);
          }
        } catch (spotifyErr) {
          console.warn("[Home] Top tracks (for albums) failed:", spotifyErr);
        }
      } catch (err) {
        console.error("[Home] fetchData error:", err);
        setError("Could not load data. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center space-y-4 text-white">
          <div className="animate-spin h-12 w-12 border-b-2 border-white rounded-full mx-auto"></div>
          <p>Loading your music…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center space-y-4 px-4">
          <p className="text-red-500 text-lg font-semibold">Oops! Something went wrong</p>
          <p className="text-white/70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white pb-24 space-y-12">
      {/* ────────────── Top Albums (scrollable) ────────────── */}
      {topAlbums.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Top Albums</h2>
          <Carousel
            items={topAlbums}
            gap={12}         // 12px between each album card
            hideScrollbar={false} // set to true if you want to hide native scrollbar
            renderItem={(album) => (
              <div className="bg-black/60 rounded-xl p-2 flex flex-col items-center w-40">
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

      {/* ───────── “Made for you” (scrollable) ───────── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Made for you</h2>
        {recommendations.length > 0 ? (
          <Carousel
            items={recommendations}
            gap={16}
            hideScrollbar={false}
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
              Connect your Spotify account to see personalized picks.
            </p>
          </div>
        )}
      </section>

      {/* ───────── “Recently played” (static grid) ───────── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Recently played</h2>
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
              Start listening on Spotify to see your recent tracks here.
            </p>
          </div>
        )}
      </section>

      {/* ───────── Fixed “Friend activity” Sidebar ───────── */}
      <aside className="lg:fixed lg:right-4 lg:top-28 lg:w-72">
        <FriendFeed activity={friendActivity} />
      </aside>
    </main>
  );
}
