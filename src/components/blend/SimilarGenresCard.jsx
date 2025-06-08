import { useState, useEffect } from 'react';

export default function SimilarGenresCard({ genres = [] }) {
  const hasGenres = genres.length > 0;
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  const totalToShow = expanded ? genres.length : Math.min(7, genres.length);
  const visibleGenres = genres.slice(0, visibleCount);

  useEffect(() => {
    let current = 0;
    const reveal = () => {
      if (current < totalToShow) {
        setVisibleCount(current + 1);
        current++;
        setTimeout(reveal, 100);
      }
    };
    setVisibleCount(0); 
    setTimeout(reveal, 100);
  }, [expanded, genres.length, totalToShow]);

  return (
  <div className="bg-gradient-to-br from-emerald-600/70 via-lime-400/50 to-green-200/40 p-6 rounded-2xl text-white shadow-xl transform transition-all duration-500 hover:scale-105">      <h2 className="text-2xl font-afacad font-semibold text-white mb-4">Similar Genres</h2>
      {hasGenres ? (
        <>
          <ul className="space-y-2">
            {visibleGenres.map((g, i) => (
              <li
                key={i}
                className="flex justify-between border-b border-white/30 pb-1 opacity-0 translate-y-2 transition-all duration-500"
                style={{ transitionDelay: `${i * 80}ms`, opacity: 1, transform: 'translateY(0)' }}
              >
                <a
                  href={`https://open.spotify.com/search/genre%3A%22${encodeURIComponent(g.genre)}%22`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="capitalize font-medium tracking-wide text-white hover:underline cursor-pointer hover:brightness-110 transition"
                >
                  {g.genre}
                </a>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/20">
                  Shared
                </span>
              </li>
            ))}
          </ul>

          {genres.length > 7 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm bg-white text-green-900 font-semibold px-4 py-1.5 rounded-full shadow hover:bg-gray-100 transition"
              >
                {expanded ? 'Show Less' : 'Show More'}
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-white/90 text-sm">No similar genres found between these users.</p>
      )}
    </div>
  );
}
