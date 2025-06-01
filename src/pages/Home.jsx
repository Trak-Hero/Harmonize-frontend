import { useEffect, useState } from "react";
import axios from "axios";

import MediaCard   from "../components/MediaCard";
import Carousel    from "../components/Carousel";
import FriendFeed  from "../components/FriendFeed";

const API = import.meta.env.VITE_API_BASE_URL ?? "";

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [recent, setRecent] = useState([]);
  const [friendActivity, setFriendActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [recRes, recentRes, friendsRes] = await Promise.all([
          axios.get(`${API}/api/recommendations`, { withCredentials: true }),
          axios.get(`${API}/api/recent`, { withCredentials: true }),
          axios.get(`${API}/api/friends/activity`, { withCredentials: true }),
        ]);

        if (cancelled) return;

        setRecommendations(recRes.data ?? []);
        setRecent(recentRes.data ?? []);
        setFriendActivity(friendsRes.data ?? []);
      } catch (err) {
        console.error("/home fetch error:", err);
        setError("Failed to load data. Please make sure you're logged in and Spotify is connected.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-lg">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400 text-center px-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <main className="pb-24 space-y-16">
      {/* ── personalised mixes ─────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Made for you</h2>
        {recommendations.length > 0 ? (
          <Carousel
            items={recommendations}
            renderItem={(item) => <MediaCard key={item.id} media={item} />}
          />
        ) : (
          <p className="text-white/60">No recommendations available.</p>
        )}
      </section>

      {/* ── recently played ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Recently played</h2>
        {recent.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recent.map((track) => (
              <MediaCard key={track.id} media={track} />
            ))}
          </div>
        ) : (
          <p className="text-white/60">No recent tracks found.</p>
        )}
      </section>

      {/* ── friend activity ─────────────────────────────────────────── */}
      <aside className="lg:fixed lg:right-6 lg:top-28 lg:w-72">
        <FriendFeed activity={friendActivity} />
      </aside>
    </main>
  );
}
