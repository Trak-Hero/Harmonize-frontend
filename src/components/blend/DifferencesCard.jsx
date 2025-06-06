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
  const [visibleCount, setVisibleCount] = useState(0);

  const totalToShow = expanded ? genreDifferences.length : Math.min(7, genreDifferences.length);
  const visibleGenres = genreDifferences.slice(0, visibleCount);

  useEffect(() => {
    let current = 0;
    const reveal = () => {
      if (current < totalToShow) {
        setVisibleCount(current + 1);
        current++;
        setTimeout(reveal, 100);
      }
    };
    setVisibleCount(0); // Reset
    setTimeout(reveal, 100);
  }, [expanded, genreDifferences.length, totalToShow]);

  return (
    <div className="bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-700 p-6 rounded-2xl text-white shadow-xl">
      <h2 className="text-2xl font-serif font-semibold mb-4 text-white">Different Genres</h2>

      {hasDifferences ? (
        <>
          <ul className="space-y-2">
            {visibleGenres.map((item, i) => (
              <li
                key={i}
                className="flex justify-between border-b border-white/20 pb-1 opacity-0 translate-y-2 transition-all duration-500"
                style={{ transitionDelay: `${i * 80}ms`, opacity: 1, transform: 'translateY(0)' }}
              >
                <a
                  href={`https://open.spotify.com/search/genre%3A%22${encodeURIComponent(item.genre)}%22`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize font-medium tracking-wide text-white hover:underline cursor-pointer hover:brightness-110 transition"
                >
                  {item.genre}
                </a>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-opacity-80 ${item.color}`}>
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
    </div>
  );
}
