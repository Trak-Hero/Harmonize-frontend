import { useState, useEffect } from 'react';

export default function DifferencesCard({ differences }) {
  const {
    uniqueGenres = { userA: [], userB: [] },
    userAName = 'User A',
    userBName = 'User B',
  } = differences;

  const genreDifferences = [
    ...uniqueGenres.userA.map((genre) => ({
      genre,
      user: userAName,
      color: 'bg-pink-500',
    })),
    ...uniqueGenres.userB.map((genre) => ({
      genre,
      user: userBName,
      color: 'bg-indigo-500',
    })),
  ];

  const hasDifferences = genreDifferences.length > 0;
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? genreDifferences : genreDifferences.slice(0, 7);

  return (
    <div className="bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-700 p-6 rounded-2xl text-white shadow-xl">
      <h2 className="text-2xl font-serif font-semibold mb-4 opacity-0 animate-fade-in-up"
          style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        Different Genres
      </h2>

      {hasDifferences ? (
        <>
          <ul className="space-y-2">
            {visibleItems.map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center border-b border-white/20 pb-2 opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
              >
                <span className="capitalize tracking-wide">{item.genre}</span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${item.color} bg-opacity-80`}
                >
                  {item.user}
                </span>
              </li>
            ))}
          </ul>

          {genreDifferences.length > 7 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm bg-white text-purple-800 font-semibold px-4 py-1.5 rounded-full shadow hover:bg-gray-100 transition"
              >
                {expanded ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-white/90 text-sm">You have overlapping music tastes.</p>
      )}

      {/* Fade-in animation style */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
