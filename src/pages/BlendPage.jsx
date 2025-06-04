import React, { useEffect, useState } from 'react';
import BlendHeader from '../components/blend/BlendHeader';
import TasteScoreCard from '../components/blend/TasteScoreCard';
import CommonArtistsCard from '../components/blend/CommonArtistsCard';
import SimilarGenresCard from '../components/blend/SimilarGenresCard';
import DifferencesCard from '../components/blend/DifferencesCard';
import { fetchTopArtists } from '../api/spotify'; // your own data

const friendMockData = {
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

  useEffect(() => {
    const load = async () => {
      try {
        const userData = await fetchTopArtists(); // your data
        const blend = computeBlend(userData, friendMockData, 'You', 'Minsoo');
        setBlendData(blend);
      } catch (e) {
        console.error('Error computing blend', e);
      }
    };

    load();
  }, []);

  if (!blendData) return <div className="text-white p-8">Loading blend data...</div>;

  return (
    <div className="flex-1 px-6 md:px-12 py-3 space-y-10 bg-gradient-to-b from-slate-900 via-black to-slate-950 text-white">
      <div className="flex-1 px-12 py-8 space-y-8 overflow-auto">
        <BlendHeader />
        <TasteScoreCard score={blendData.tasteMatch} userA={blendData.userA} userB={blendData.userB} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CommonArtistsCard artists={blendData.commonArtists} />
          <SimilarGenresCard genres={blendData.similarGenres} />
          <DifferencesCard differences={blendData.differences} />
        </div>
      </div>
    </div>
  );
}
