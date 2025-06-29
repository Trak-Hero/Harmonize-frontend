const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const jsonOrThrow = async (res, msg) => {
  if (!res.ok) throw new Error(`${msg} (${res.status})`);
  return res.json();
};

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

export const fetchTopArtists = fetchMyTopArtists;

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
