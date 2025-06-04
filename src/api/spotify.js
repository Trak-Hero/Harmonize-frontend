const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function fetchRecentTracks() {
  const res = await fetch(`${API_BASE}/api/spotify/recent`);
  if (!res.ok) throw new Error('Failed to fetch recent tracks');
  return await res.json();
}

export async function fetchTopArtists() {
  const res = await fetch(`${API_BASE}/spotify/top-artists`);
  if (!res.ok) throw new Error('Failed to fetch top artists');
  return await res.json();
}
