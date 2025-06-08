import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BlendHeader from '../components/blend/BlendHeader';
import TasteScoreCard from '../components/blend/TasteScoreCard';
import CommonArtistsCard from '../components/blend/CommonArtistsCard';
import SimilarGenresCard from '../components/blend/SimilarGenresCard';
import DifferencesCard from '../components/blend/DifferencesCard';
import UserSelectionModal from '../components/blend/UserSelectionModal';
import { fetchTopArtists } from '../api/spotify';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function computeBlend(userAData, userBData, userAName, userBName) {
  const artistsA = userAData.items;
  const artistsB = userBData.items;

  const artistMapA = new Map(artistsA.map((a) => [a.id, a]));
  const artistMapB = new Map(artistsB.map((b) => [b.id, b]));

  const commonArtistIds = artistsA
    .map((a) => a.id)
    .filter((id) => artistMapB.has(id));
  const commonArtists = commonArtistIds.map((id) => artistMapA.get(id));

  const allGenresA = artistsA.flatMap((a) => a.genres);
  const allGenresB = artistsB.flatMap((b) => b.genres);

  const genreSetA = new Set(allGenresA);
  const genreSetB = new Set(allGenresB);

  const similarGenres = [...genreSetA].filter((g) => genreSetB.has(g));
  const uniqueGenresA = [...genreSetA].filter((g) => !genreSetB.has(g));
  const uniqueGenresB = [...genreSetB].filter((g) => !genreSetA.has(g));

  const popularityDiffs = commonArtistIds.map((id) => {
    const a = artistMapA.get(id).popularity ?? 50;
    const b = artistMapB.get(id).popularity ?? 50;
    return Math.abs(a - b);
  });
  const avgPopularityDiff = popularityDiffs.length
    ? popularityDiffs.reduce((sum, d) => sum + d, 0) / popularityDiffs.length
    : 100;

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

function generateFriendMockData(yourData, selectedUser = null) {
  return {
    items: yourData.items.map((artist, idx) => {
      const seed = selectedUser?._id?.slice(-2) || '00';
      const seedNum = parseInt(seed, 16) || 1;
      
      const sharedArtist = (idx + seedNum) % 5 === 0;
      const sharedGenre = (idx + seedNum) % 3 !== 0;

      const newGenres = sharedGenre
        ? artist.genres
        : artist.genres.map((g) => `${g}-variant-${seedNum}`);

      return {
        ...artist,
        id: sharedArtist ? artist.id : `${artist.id}_${seedNum}_${idx}`,
        name: sharedArtist ? artist.name : `${artist.name} (Alt ${seedNum})`,
        genres: newGenres,
      };
    }),
  };
}

export default function BlendPage() {
  const [blendData, setBlendData] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const loadBlend = async (targetUser = null) => {
    setLoading(true);
    setError('');
    try {
      const userData = await fetchTopArtists();

      let friendData;
      let friendName;

      if (targetUser) {
        try {
          const res = await fetch(
            `${API_BASE}/spotify/user/${targetUser._id}/top-artists`,
            { credentials: 'include' }
          );
          
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          
          friendData = await res.json();
          friendName = targetUser.displayName;
          
          console.log('Friend data fetched:', friendData); 
        } catch (fetchError) {
          console.warn('Could not fetch user data:', fetchError);
          if (fetchError.message.includes('404') || fetchError.message.includes('Spotify not connected')) {
            friendData = generateFriendMockData(userData, targetUser);
            friendName = `${targetUser.displayName} (Mock Data)`;
          } else {
            throw fetchError; 
          }
        }
      } else {
        friendData = generateFriendMockData(userData);
        friendName = 'Sample User';
      }

      const blend = computeBlend(userData, friendData, 'You', friendName);
      setBlendData(blend);
      setSelectedUser(targetUser);
    } catch (err) {
      console.error('Error computing blend', err);
      setError('Failed to load blend data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = searchParams.get('user');
    
    if (userId) {
      fetch(`${API_BASE}/api/users/${userId}`, { credentials: 'include' })
        .then(r => r.ok ? r.json() : null)
        .then(user => {
          if (user) {
            console.log('Loading blend for user from URL:', user.displayName || user.username);
            loadBlend(user);
          } else {
            console.warn('User not found from URL parameter, loading default');
            loadBlend();
          }
        })
        .catch((err) => {
          console.error('Error fetching user from URL parameter:', err);
          loadBlend();
        });
    } else {
      loadBlend();
    }
  }, [searchParams]);

  const handleSelectUser = (user) => {
    setShowUserModal(false);
    loadBlend(user);
  };

  if (error) {
    return (
      <div className="flex-1 px-6 md:px-12 py-3 space-y-10 bg-gradient-to-b from-slate-900 via-black to-slate-950 text-white">
        <div className="text-red-400 p-8">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => { setError(''); loadBlend(selectedUser); }} 
            className="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || !blendData) {
    return <div className="text-white p-8">Loading blend data...</div>;
  }

  return (
    <div className="flex-1 px-6 md:px-12 py-3 space-y-10 bg-gradient-to-b from-slate-900 via-black to-slate-950 text-white">
      <div className="flex-1 px-12 py-8 space-y-8 overflow-auto">
        <div className="flex justify-between items-start">
          <BlendHeader selectedUser={selectedUser} />
          <button
            onClick={() => setShowUserModal(true)}
            className="whitespace-nowrap px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-afacad font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
            {selectedUser
              ? `Change from ${selectedUser.displayName}`
              : 'Select Friend'}
          </button>
        </div>

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