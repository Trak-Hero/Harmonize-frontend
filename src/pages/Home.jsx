import { useEffect, useState } from "react";
import axios from "axios";

/* ──────────────────────────────────────────────────────────────────────────────
  Home.jsx  –fetch real data
  ----------------------------------------------------------------------------
  • replace the placeholder arrays with data from your Express API
  • expects you already mounted these routes on the server side:
        GET /api/recommendations      → [{ id, title, coverUrl, ... }]
        GET /api/recent              → [{ id, title, coverUrl, ... }]
        GET /api/friends/activity    → [{ friendName, track, coverUrl, ... }]
  • cookies are sent via `withCredentials: true` so session auth keeps working
  • uses a Vite env var VITE_API_BASE_URL ("http://localhost:8080" in dev)
  ─────────────────────────────────────────────────────────────────────────────*/

/* replace with your own UI components or keep simple <img>/<p> */
import MediaCard   from "./components/MediaCard";
import Carousel    from "./components/Carousel";
import FriendFeed  from "./components/FriendFeed";


const API = import.meta.env.VITE_API_BASE_URL ?? ""; // empty → same origin

export default function Home() {
  const [recommendations, setRecommendations] = useState([]);
  const [recent,         setRecent]          = useState([]);
  const [friendActivity, setFriendActivity]  = useState([]);
  const [loading,        setLoading]         = useState(true);

  /* ------------------------------------------------------------------------- */
  /* grab all 3 lists in parallel                                              */
  /* ------------------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [{ data: rec }, { data: recents }, { data: friends }] = await Promise.all([
          axios.get(`${API}/api/recommendations`,      { withCredentials: true }),
          axios.get(`${API}/api/recent`,               { withCredentials: true }),
          axios.get(`${API}/api/friends/activity`,     { withCredentials: true }),
        ]);
        if (!cancelled) {
          setRecommendations(rec);
          setRecent(recents);
          setFriendActivity(friends);
          setLoading(false);
        }
      } catch (err) {
        console.error("/home fetch error", err);
      }
    })();

    return () => (cancelled = true);
  }, []);

  /* ------------------------------------------------------------------------- */
  /* simple skeleton while waiting for data                                    */
  /* ------------------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading…
      </div>
    );
  }

  /* ------------------------------------------------------------------------- */
  /* real page                                                                 */
  /* ------------------------------------------------------------------------- */
  return (
    <main className="pb-24 space-y-16">
      {/* hero banner stays the same (see top of file if you have one) */}

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
