import React, { useEffect, useState } from 'react';
import BlendHeader from '../components/blend/BlendHeader';
import TasteScoreCard from '../components/blend/TasteScoreCard';
import CommonArtistsCard from '../components/blend/CommonArtistsCard';
import SimilarGenresCard from '../components/blend/SimilarGenresCard';
import DifferencesCard from '../components/blend/DifferencesCard';
import UserSelectionModal from '../components/blend/UserSelectionModal';
import { fetchTopArtists } from '../api/spotify';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/* ---------- helpers ---------- */
function computeBlend(userAData, userBData, userAName, userBName) {
  const artistsA = userAData.items;
  const artistsB = userBData.items;

  const artistMapA = new Map(artistsA.map((a) => [a.id, a]));
  const artistMapB = new Map(artistsB.map((b) => [b.id, b]));

  // 1. Common artists
  const commonArtistIds = artistsA
    .map((a) => a.id)
    .filter((id) => artistMapB.has(id));
  const commonArtists = commonArtistIds.map((id) => artistMapA.get(id));

  // 2. Genre analysis
  const allGenresA = artistsA.flatMap((a) => a.genres);
  const allGenresB = artistsB.flatMap((b) => b.genres);

  const genreSetA = new Set(allGenresA);
  const genreSetB = new Set(allGenresB);

  const similarGenres = [...genreSetA].filter((g) => genreSetB.has(g));
  const uniqueGenresA = [...genreSetA].filter((g) => !genreSetB.has(g));
  const uniqueGenresB = [...genreSetB].filter((g) => !genreSetA.has(g));

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

  return {
    userA: { name: userAName, avatarUrl: '' },
    userB: { name: userBName, avatarUrl: '' },
    tasteMatch: finalScore,
    commonArtists: commonArtistIds.map((id) => {
    const artist = artistMapA.get(id);
    return {
        name: artist.name,
        imageUrl: artist.images[0]?.url || '',
        spotifyUrl: artist.external_urls?.spotify || '#',
    };
    }),
    similarGenres: similarGenres.map((g) => ({ genre: g })),
    differences: {
      userAName,
      userBName,
      userAOnlyArtists: artistsA
        .filter((a) => !artistMapB.has(a.id))
        .map((a) => ({ name: a.name, imageUrl: a.images[0]?.url || '' })),
      userBOnlyArtists: artistsB
        .filter((b) => !artistMapA.has(b.id))
        .map((b) => ({ name: b.name, imageUrl: b.images[0]?.url || '' })),
      uniqueGenres: {
        userA: uniqueGenresA,
        userB: uniqueGenresB,
      },
    },
  };
}

/** Create a mock “friend” dataset from the current user’s data */
function generateFriendMockData(yourData) {
  return {
    items: yourData.items.map((artist, idx) => {
      const sharedArtist = idx % 4 === 0; // 25% shared artists
      const sharedGenre = idx % 3 !== 0;  // 66% shared genres

      const newGenres = sharedGenre
        ? artist.genres
        : artist.genres.map((g) => `${g}-alt`);

      return {
        ...artist,
        id: sharedArtist ? artist.id : `${artist.id}_friend_${idx}`,
        name: sharedArtist ? artist.name : `${artist.name} (Alt)`,
        genres: newGenres,
      };
    }),
  };
}

/* ---------- component ---------- */
export default function BlendPage() {
  const [blendData, setBlendData] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  /** Fetch data & compute blend */
  const loadBlend = async (targetUser = null) => {
    setLoading(true);
    try {
      // current user's artists
      const userData = await fetchTopArtists();
  
      let friendData;
      let friendName;
  
      if (targetUser) {
        // real friend data
        const res = await fetch(
          `${API_BASE}/api/users/${targetUser._id}/top-artists`,
          { credentials: 'include' }
        );
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Failed to fetch friend data:', errorText);
          throw new Error(`Failed to fetch ${targetUser.displayName}'s music data`);
        }
        
        friendData = await res.json();
        friendName = targetUser.displayName;
      } else {
        // mock friend data
        friendData = generateFriendMockData(userData);
        friendName = 'Sample User';
      }
  
      const blend = computeBlend(userData, friendData, 'You', friendName);
      setBlendData(blend);
      setSelectedUser(targetUser);
    } catch (err) {
      console.error('Error computing blend', err);
      alert(`Error: ${err.message}`); // Show user-friendly error
    } finally {
      setLoading(false);
    }
  };

  /* initial load */
  useEffect(() => {
    loadBlend();
  }, []);

  /* handle selecting a different user */
  const handleSelectUser = (user) => {
    setShowUserModal(false);
    loadBlend(user);
  };

  /* ---------- render ---------- */
  if (loading || !blendData) {
    return <div className="text-white p-8">Loading blend data...</div>;
  }

  return (
    <div className="flex-1 px-6 md:px-12 py-3 space-y-10 bg-gradient-to-b from-slate-900 via-black to-slate-950 text-white">
      <div className="flex-1 px-12 py-8 space-y-8 overflow-auto">
        {/* Header + user picker */}
        <div className="flex justify-between items-start">
          <BlendHeader selectedUser={selectedUser} />
          <button
            onClick={() => setShowUserModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            {selectedUser
              ? `Change from ${selectedUser.displayName}`
              : 'Select Real User'}
          </button>
        </div>

        {/* Main cards */}
        <TasteScoreCard
          score={blendData.tasteMatch}
          userA={blendData.userA}
          userB={blendData.userB}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CommonArtistsCard artists={blendData.commonArtists} />
          <SimilarGenresCard genres={blendData.similarGenres} />
          <DifferencesCard differences={blendData.differences} />
        </div>

        {/* User selector modal */}
        {showUserModal && (
          <UserSelectionModal
            onClose={() => setShowUserModal(false)}
            onSelectUser={handleSelectUser}
          />
        )}
      </div>
    </div>
  );
}