import { useState, useEffect } from 'react';

export default function CommonArtistsCard({ artists }) {
  const [showAll, setShowAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isExpanding, setIsExpanding] = useState(false);

  const visibleArtists = showAll ? artists : artists.slice(0, 4);

  // Initial staggered reveal animation
  useEffect(() => {
    const initialCount = Math.min(4, artists.length);
    let currentCount = 0;
    
    const revealNextArtist = () => {
      if (currentCount < initialCount) {
        setVisibleCount(currentCount + 1);
        currentCount++;
        setTimeout(revealNextArtist, 150); // Stagger by 150ms
      }
    };

    // Start after a brief delay
    const timer = setTimeout(revealNextArtist, 300);
    return () => clearTimeout(timer);
  }, [artists.length]);

  // Handle show more/less expansion
  useEffect(() => {
    if (showAll && visibleCount <= 4) {
      setIsExpanding(true);
      let currentCount = 4;
      
      const revealNextArtist = () => {
        if (currentCount < artists.length) {
          setVisibleCount(currentCount + 1);
          currentCount++;
          setTimeout(revealNextArtist, 100); // Faster reveal for expansion
        } else {
          setIsExpanding(false);
        }
      };

      setTimeout(revealNextArtist, 100);
    } else if (!showAll) {
      setVisibleCount(4);
      setIsExpanding(false);
    }
  }, [showAll, artists.length, visibleCount]);

  return (
    <div className="relative p-6 rounded-2xl text-white shadow-xl bg-gradient-to-br from-green-700 via-emerald-500 to-orange-400 transform transition-all duration-500 hover:scale-105">
      {/* Animated header */}
      <h2 className="text-2xl font-afacad font-semibold mb-4 opacity-0 animate-fade-in-up" 
          style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        Common Artists
      </h2>

      <div className="flex flex-wrap justify-center gap-4">
        {visibleArtists.map((a, index) => (
          <a
            key={a.name}
            href={a.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center bg-black/30 p-2 rounded-xl shadow-inner backdrop-blur-sm border border-white/20 transition-all duration-500 transform ${
                index < visibleCount
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95'
            } hover:scale-110 hover:bg-black/40 hover:border-white/40`}
            style={{
                transitionDelay: showAll && index >= 4 ? `${(index - 4) * 100}ms` : '0ms'
            }}
            >

            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={a.imageUrl}
                alt={a.name}
                className="w-24 h-24 object-cover rounded-2xl border-2 border-white/30 shadow-md transition-transform duration-300 hover:scale-110"
              />
              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
            <span className="mt-2 text-white font-medium text-sm transition-all duration-200 hover:text-blue-100">
              {a.name}
            </span>
          </a>
        ))}
      </div>

      {artists.length > 4 && (
        <div className="mt-4 text-center">
            <button
            onClick={() => setShowAll(!showAll)}
            className={`outline-none focus:outline-none text-sm font-semibold px-4 py-2 rounded-full shadow transition-all duration-300
                ${showAll ? 'bg-white text-green-800' : 'bg-white text-orange-800'}
                hover:bg-gray-100 hover:scale-105
                ${isExpanding ? 'animate-pulse opacity-60 cursor-not-allowed' : ''}
            `}
            disabled={isExpanding}
            >
            {showAll ? 'Show Less' : `Show More (${artists.length - 4} more)`}
            </button>
        </div>
    )}

      {/* Custom CSS for fade-in-up animation */}
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