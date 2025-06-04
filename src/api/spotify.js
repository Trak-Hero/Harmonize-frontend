const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export async function fetchRecentTracks() {
  const res = await fetch('/api/spotify/recent'); // or your full API URL
  if (!res.ok) throw new Error('Failed to fetch recent tracks');
  return await res.json();
}
export async function fetchTopArtists() {
  const res = await fetch(`${API_BASE}/spotify/top-artists`, {
    credentials: 'include', // optional, if you need cookies
  });
  if (!res.ok) throw new Error('Top artists fetch returned non-JSON');
  return await res.json();
}
