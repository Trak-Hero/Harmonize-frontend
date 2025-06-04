export async function fetchRecentTracks() {
  const res = await fetch('/api/spotify/recent'); // or your full API URL
  if (!res.ok) throw new Error('Failed to fetch recent tracks');
  return await res.json();
}

export async function fetchTopArtists() {
  const res = await fetch('/spotify/top-artists');

  const contentType = res.headers.get('content-type');
  const text = await res.text();

  if (!res.ok || !contentType?.includes('application/json')) {
    console.error('Non-JSON response from /spotify/top-artists:', text.slice(0, 300));
    throw new Error('Top artists fetch returned non-JSON');
  }

  return JSON.parse(text);
}
