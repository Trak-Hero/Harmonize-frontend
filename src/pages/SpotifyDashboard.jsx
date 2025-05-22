import { useEffect, useState } from "react";

export default function SpotifyDashboard() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/me/spotify`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setMe)
      .catch(console.error);
  }, []);

  if (!me) return <div className="text-white p-4">Loading your Spotify data...</div>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Welcome, {me.profile.display_name}</h1>
      <img
        src={me.profile.images?.[0]?.url}
        alt="Profile"
        className="w-32 h-32 rounded-full mb-4"
      />
      <h2 className="text-xl font-semibold mb-2">Your Top Tracks</h2>
      <ul className="list-disc pl-5">
        {me.top.map((track) => (
          <li key={track.id}>
            {track.name} by {track.artists.map((a) => a.name).join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
