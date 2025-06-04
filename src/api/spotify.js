const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function getAccessToken() {
  // Update this to match wherever you're storing the token (e.g., localStorage or a global store)
  return localStorage.getItem('accessToken');
}

export async function fetchRecentTracks() {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE}/api/spotify/recent`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch recent tracks');
  return await res.json();
}

export async function fetchTopArtists() {
  const res = await fetch(`${API_BASE}/spotify/top-artists`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Failed to fetch top artists');
  return await res.json();
}