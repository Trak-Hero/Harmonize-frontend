// src/pages/BlendPage.jsx - Updated version
import React, { useEffect, useState } from 'react';
import BlendHeader from '../components/blend/BlendHeader';
import TasteScoreCard from '../components/blend/TasteScoreCard';
import CommonArtistsCard from '../components/blend/CommonArtistsCard';
import SimilarGenresCard from '../components/blend/SimilarGenresCard';
import DifferencesCard from '../components/blend/DifferencesCard';
import UserSelectionModal from '../components/blend/UserSelectionModal';
import { fetchTopArtists } from '../api/spotify';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function computeBlend(userAData, userBData, userAName, userBName) {
  const getArtistNames = (list) => list.map((a) => a.name);
  const getGenres = (list) => list.flatMap((a) => a.genres);

  const artistsA = userAData.items;
  const artistsB = userBData.items;

  const artistNamesA = new Set(getArtistNames(artistsA));
  const artistNamesB = new Set(getArtistNames(artistsB));

  const commonArtists = artistsA.filter((a) => artistNamesB.has(a.name));

  const uniqueA = artistsA.filter((a) => !artistNamesB.has(a.name));
  const uniqueB = artistsB.filter((a) => !artistNamesA.has(a.name));

  const genresA = getGenres(artistsA);
  const genresB = getGenres(artistsB);

  const uniqueGenresA = [...new Set(genresA.filter((g) => !genresB.includes(g)))];
  const uniqueGenresB = [...new Set(genresB.filter((g) => !genresA.includes(g)))];

  const similarGenres = [...new Set(genresA.filter((g) => genresB.includes(g)))];

  const tasteMatch = Math.round((commonArtists.length / Math.min(artistsA.length, artistsB.length)) * 100);

  return {
    userA: { name: userAName, avatarUrl: '' },
    userB: { name: userBName, avatarUrl: '' },
    tasteMatch,
    commonArtists: commonArtists.map((a) => ({
      name: a.name,
      imageUrl: a.images[0]?.url || '',
    })),
    similarGenres: similarGenres.map((g) => ({ genre: g })),
    differences: {
      userAName,
      userBName,
      userAOnlyArtists: uniqueA.map((a) => ({
        name: a.name,
        imageUrl: a.images[0]?.url || '',
      })),
      userBOnlyArtists: uniqueB.map((a) => ({
        name: a.name,
        imageUrl: a.images[0]?.url || '',
      })),
      uniqueGenres: {
        userA: uniqueGenresA,
        userB: uniqueGenresB,
      },
    },
  };
}

export default function BlendPage() {
  const [blendData, setBlendData] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadBlend = async (targetUser = null) => {
    setLoading(true);
    try {
      const userData = await fetchTopArtists(); // Current user's data
      
      let friendData;
      let friendName;
      
      if (targetUser) {
        // Fetch selected user's data
        const res = await fetch(`${API_BASE}/api/users/${targetUser._id}/top-artists`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch friend data');
        friendData = await res.json();
        friendName = targetUser.displayName;
      } else {
        // Use mock data as fallback
        friendData = {
          items: [
            {
              name: 'Joji',
              genres: ['lo-fi', 'alternative r&b'],
              images: [{ url: '/artists/joji.jpg' }],
            },
            {
              name: 'Beabadoobee',
              genres: ['bedroom pop', 'indie rock'],
              images: [{ url: '/artists/beabadoobee.jpg' }],
            },
            {
              name: 'BIBI',
              genres: ['k-r&b', 'k-pop'],
              images: [{ url: '/artists/bibi.jpg' }],
            },
            {
              name: 'IU',
              genres: ['k-pop', 'ballad'],
              images: [{ url: '/artists/iu.jpg' }],
            },
          ],
        };
        friendName = 'Sample User';
      }

      const blend = computeBlend(userData, friendData, 'You', friendName);
      setBlendData(blend);
      setSelectedUser(targetUser);
    } catch (e) {
      console.error('Error computing blend', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlend(); // Load with mock data initially
  }, []);

  const handleSelectUser = (user) => {
    setShowUserModal(false);
    loadBlend(user);
  };

  if (loading) {
    return <div className="text-white p-8">Loading blend data...</div>;
  }

  if (!blendData) {
    return <div className="text-white p-8">Loading blend data...</div>;
  }

  return (
    <div className="flex-1 px-6 md:px-12 py-3 space-y-10 bg-gradient-to-b from-slate-900 via-black to-slate-950 text-white">
      <div className="flex-1 px-12 py-8 space-y-8 overflow-auto">
        <div className="flex justify-between items-start">
          <BlendHeader selectedUser={selectedUser} />
          <button
            onClick={() => setShowUserModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            {selectedUser ? `Change from ${selectedUser.displayName}` : 'Select Real User'}
          </button>
        </div>

        <TasteScoreCard score={blendData.tasteMatch} userA={blendData.userA} userB={blendData.userB} />
        
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