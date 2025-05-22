export async function fetchRecentTracks() {
  const res = await fetch('/api/spotify/recent'); // or your full API URL
  if (!res.ok) throw new Error('Failed to fetch recent tracks');
  return await res.json();
}

export async function fetchTopArtists() {
  const res = await fetch('/spotify/top-artists');
  if (!res.ok) throw new Error('Failed to fetch top artists');
  return await res.json();
}