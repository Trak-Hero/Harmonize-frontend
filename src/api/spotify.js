const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/* ---------- helpers ---------- */
const jsonOrThrow = async (res, msg) => {
  if (!res.ok) throw new Error(`${msg} (${res.status})`);
  return res.json();
};

/* ---------- current-session user ("me") ---------- */
export const fetchMyRecentTracks = async () =>
  jsonOrThrow(
    await fetch(`${API_BASE}/spotify/me/recent`, { credentials: 'include' }),
    'Failed to fetch recent tracks'
  );

export const fetchMyTopArtists = async () =>
  jsonOrThrow(
    await fetch(`${API_BASE}/spotify/top-artists`, { credentials: 'include' }),
    'Failed to fetch top artists'
  );

const fetchTopArtists = async () => {
  console.log('Fetching Top Artists - Base URL:', API_BASE);
  try {
    const response = await fetch(`${API_BASE}/spotify/top-artists`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Fetch Response:', {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response Text:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Top Artists Data:', data);
    return data;
  } catch (error) {
    console.error('Fetch Top Artists Error:', error);
    throw error;
  }
};
/* ---------- public profile user ---------- */
export const fetchUserRecentTracks = async (userId) =>
  jsonOrThrow(
    await fetch(`${API_BASE}/spotify/user/${userId}/recent`, {
      credentials: 'include',
    }),
    'Failed to fetch user recent tracks'
  );

export const fetchUserTopArtists = async (userId) =>
  jsonOrThrow(
    await fetch(`${API_BASE}/spotify/user/${userId}/top-artists`, {
      credentials: 'include',
    }),
    'Failed to fetch user top artists'
  );
