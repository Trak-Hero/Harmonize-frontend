import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SpotifyDashboard() {
  const [me, setMe]   = useState(null);
  const [error, setError] = useState(null);
  const navigate      = useNavigate();
  const API           = import.meta.env.VITE_API_BASE_URL;   // e.g. https://project-music-and-memories-api.onrender.com

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/auth/api/me/spotify`, {
          credentials: 'include',          // 🔑 send session cookie
        });

        if (res.status === 401) {
          // not logged in – kick back to /connect to start OAuth again
          navigate('/connect');
          return;
        }
        if (!res.ok) {
          // any other error – read text so we can display it
          throw new Error(await res.text());
        }

        const data = await res.json();
        setMe(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    })();
  }, [API, navigate]);

  if (error)  return <div className="text-red-400 p-4">Error: {error}</div>;
  if (!me)    return <div className="text-white p-4">Loading your Spotify data&hellip;</div>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome, {me.profile.display_name}</h1>

      {me.profile.images?.[0] && (
        <img
          src={me.profile.images[0].url}
          alt="Profile avatar"
          className="w-32 h-32 rounded-full mb-4"
        />
      )}

      <h2 className="text-xl font-semibold mb-2">Your Top Tracks</h2>
      <ul className="list-disc pl-5 space-y-1">
        {me.top.map((track) => (
          <li key={track.id}>
            {track.name} by {track.artists.map((a) => a.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}