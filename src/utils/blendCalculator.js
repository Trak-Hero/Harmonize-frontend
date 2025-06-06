import { fetchTopArtists } from '../api/spotify';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function calculateBlendPercentage(friendId) {
  try {
    // Get current user's top artists
    const userData = await fetchTopArtists();
    
    // Get friend's top artists
    const res = await fetch(
      `${API_BASE}/spotify/user/${friendId}/top-artists`,
      { credentials: 'include' }
    );
    
    if (!res.ok) {
      // If friend hasn't connected Spotify, return 0
      return 0;
    }
    
    const friendData = await res.json();
    
    // Calculate blend percentage using same logic as BlendPage
    return computeBlendScore(userData, friendData);
  } catch (error) {
    console.error('Error calculating blend percentage:', error);
    return 0;
  }
}

function computeBlendScore(userAData, userBData) {
  const artistsA = userAData.items;
  const artistsB = userBData.items;

  if (!artistsA?.length || !artistsB?.length) {
    return 0;
  }

  const artistMapA = new Map(artistsA.map((a) => [a.id, a]));
  const artistMapB = new Map(artistsB.map((b) => [b.id, b]));

  // 1. Common artists
  const commonArtistIds = artistsA
    .map((a) => a.id)
    .filter((id) => artistMapB.has(id));

  // 2. Genre analysis
  const allGenresA = artistsA.flatMap((a) => a.genres);
  const allGenresB = artistsB.flatMap((b) => b.genres);

  const genreSetA = new Set(allGenresA);
  const genreSetB = new Set(allGenresB);

  const similarGenres = [...genreSetA].filter((g) => genreSetB.has(g));

  // 3. Popularity similarity
  const popularityDiffs = commonArtistIds.map((id) => {
    const a = artistMapA.get(id).popularity ?? 50;
    const b = artistMapB.get(id).popularity ?? 50;
    return Math.abs(a - b);
  });
  const avgPopularityDiff = popularityDiffs.length
    ? popularityDiffs.reduce((sum, d) => sum + d, 0) / popularityDiffs.length
    : 100;

  // 4. Scores
  const artistScore =
    (commonArtistIds.length / Math.min(artistsA.length, artistsB.length)) * 100;
  const genreScore =
    (similarGenres.length /
      new Set([...allGenresA, ...allGenresB]).size) *
    100;
  const popularityScore = 100 - avgPopularityDiff;

  const finalScore = Math.round(
    0.5 * artistScore + 0.3 * genreScore + 0.2 * popularityScore
  );

  return Math.max(0, Math.min(100, finalScore));
}