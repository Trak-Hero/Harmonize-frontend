import { useState } from 'react';

export default function CommonArtistsCard({ artists }) {
  const [showAll, setShowAll] = useState(false);

  const visibleArtists = showAll ? artists : artists.slice(0, 4);

  return (
    <div className="relative p-6 rounded-2xl text-white shadow-xl border border-blue-400 bg-gradient-to-br from-green-700 via-emerald-500 to-orange-400">
      <h2 className="text-2xl font-serif font-semibold mb-4">Common Artists</h2>

      <div className="flex flex-wrap justify-center gap-4">
        {visibleArtists.map((a) => (
          <div
            key={a.name}
            className="flex flex-col items-center bg-black/30 p-2 rounded-xl shadow-inner backdrop-blur-sm border border-white/20"
          >
            <img
              src={a.imageUrl}
              alt={a.name}
              className="w-24 h-24 object-cover rounded-2xl border-2 border-white/30 shadow-md"
            />
            <span className="mt-2 text-white font-medium text-sm">{a.name}</span>
          </div>
        ))}
      </div>

      {artists.length > 4 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-100 underline hover:text-white transition"
          >
            {showAll ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  );
}
