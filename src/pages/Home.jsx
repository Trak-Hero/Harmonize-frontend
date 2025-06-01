import { useEffect, useState } from "react";
import axios from "axios";

/* ──────────────────────────────────────────────────────────────────────────────
  Home.jsx  – Fetch data for homepage
──────────────────────────────────────────────────────────────────────────────── */

import MediaCard   from "../components/MediaCard";
import Carousel    from "../components/Carousel";
import FriendFeed  from "../components/FriendFeed";

const API = import.meta.env.VITE_API_BASE_URL ?? "";

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [recent,         setRecent]          = useState([]);
  const [friendActivity, setFriendActivity]  = useState([]);
  const [loading,        setLoading]         = useState(true);
  const [error,          setError]           = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [recRes, recentRes, friendsRes] = await Promise.all([
          axios.get(`${API}/api/recommendations`,  { withCredentials: true }),
          axios.get(`${API}/api/recent`,           { withCredentials: true }),
          axios.get(`${API}/api/friends/activity`, { withCredentials: true }),
        ]);

        if (!cancelled) {
          setRecommendations(recRes.data ?? []);
          setRecent(recentRes.data ?? []);
          setFriendActivity(friendsRes.data ?? []);
        }
      } catch (err) {
        console.error("Error fetching homepage data:", err);
        if (!cancelled) setError(true);
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
      <div className="flex items-center justify-center h-screen text-white">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400 font-semibold text-lg">
        Failed to load homepage. Please try refreshing.
      </div>
    );
  }

  return (
    <main className="pb-24 space-y-16">
      {/* ── personalised mixes ─────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Made for you</h2>
        <Carousel items={recommendations} renderItem={(item) => (
          <MediaCard key={item.id} media={item} />
        )} />
      </section>

      {/* ── recently played ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Recently played</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {recent.map((track) => (
            <MediaCard key={track.id} media={track} />
          ))}
        </div>
      </section>

      {/* ── friend activity (sticky on lg screens) ─────────────────── */}
      <aside className="lg:fixed lg:right-6 lg:top-28 lg:w-72">
        <FriendFeed activity={friendActivity} />
      </aside>
    </main>
  );
}
