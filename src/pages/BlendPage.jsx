import React, { useEffect, useState } from 'react';
import BlendHeader from '../components/blend/BlendHeader';
import TasteScoreCard from '../components/blend/TasteScoreCard';
import CommonArtistsCard from '../components/blend/CommonArtistsCard';
import SimilarGenresCard from '../components/blend/SimilarGenresCard';
import DifferencesCard from '../components/blend/DifferencesCard';
import { fetchTopArtists } from '../api/spotify'; // your own data

function computeBlend(userAData, userBData, userAName, userBName) {
  const artistsA = userAData.items;
  const artistsB = userBData.items;

  const artistMapA = new Map(artistsA.map((a) => [a.id, a]));
  const artistMapB = new Map(artistsB.map((b) => [b.id, b]));

  // 1. Common Artists (by ID)
  const commonArtistIds = artistsA
    .map((a) => a.id)
    .filter((id) => artistMapB.has(id));

  const commonArtists = commonArtistIds.map((id) => artistMapA.get(id));

  // 2. Genre Analysis
  const allGenresA = artistsA.flatMap((a) => a.genres);
  const allGenresB = artistsB.flatMap((b) => b.genres);

  const genreSetA = new Set(allGenresA);
  const genreSetB = new Set(allGenresB);

  const similarGenres = [...genreSetA].filter((g) => genreSetB.has(g));
  const uniqueGenresA = [...genreSetA].filter((g) => !genreSetB.has(g));
  const uniqueGenresB = [...genreSetB].filter((g) => !genreSetA.has(g));

  // 3. Popularity Similarity (avg difference in matched artists)
  const popularityDiffs = commonArtistIds.map((id) => {
    const a = artistMapA.get(id).popularity;
    const b = artistMapB.get(id).popularity;
    return Math.abs(a - b);
  });

  const avgPopularityDiff = popularityDiffs.length
    ? popularityDiffs.reduce((sum, d) => sum + d, 0) / popularityDiffs.length
    : 100;

  // 4. Score Components
  const artistScore = (commonArtistIds.length / Math.min(artistsA.length, artistsB.length)) * 100;
  const genreScore = (similarGenres.length / (new Set([...allGenresA, ...allGenresB]).size)) * 100;
  const popularityScore = 100 - avgPopularityDiff;

  // Weighted blend (feel free to adjust)
  const finalScore = Math.round(
    0.5 * artistScore +
    0.3 * genreScore +
    0.2 * popularityScore
  );

  return {
    userA: { name: userAName, avatarUrl: '' },
    userB: { name: userBName, avatarUrl: '' },
    tasteMatch: finalScore,
    commonArtists: commonArtists.map((a) => ({
      name: a.name,
      imageUrl: a.images[0]?.url || '',
    })),
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

export default function BlendPage() {
  const [blendData, setBlendData] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const userData = await fetchTopArtists(); // your data

         const friendMockData = {
            items: userData.items.map((artist, idx) => {
                const sharedArtist = idx % 4 === 0; // 25% of artists are shared
                const sharedGenre = idx % 3 !== 0;  // 66% of genres are similar

                const newGenres = sharedGenre
                ? artist.genres.map((g) => g) // keep original
                : artist.genres.map((g) => g + '-alt'); // mutate genres

                return {
                ...artist,
                id: sharedArtist ? artist.id : artist.id + '_friend_' + idx,
                name: sharedArtist ? artist.name : artist.name + ' (Alt)',
                genres: newGenres,
                };
            }),
        };




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
