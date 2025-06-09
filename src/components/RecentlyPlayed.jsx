import React from 'react';

const RecentlyPlayed = ({ recent = [] }) => {
  if (!Array.isArray(recent) || recent.length === 0) {
    return (
      <div className="p-6 bg-black/50 rounded-xl text-white text-center">
        <h2 className="text-xl font-bold mb-3">Recently Played</h2>
        <p className="text-white/60">No recently played tracks to show.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Recently Played</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {recent.map((item, idx) => {
         
          const track = item.track ?? item;

          const albumImages = track.album?.images ?? [];
          const imageUrl = albumImages[0]?.url ?? '';


          const trackName = track.name ?? 'Unknown Title';
          const artistList = Array.isArray(track.artists)
            ? track.artists.map(a => a.name).join(', ')
            : 'Unknown Artist';

          return (
            <div
              key={track.id ?? idx}
              className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white flex flex-col items-start"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={trackName}
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <div className="w-full h-32 bg-gray-800 flex items-center justify-center rounded">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}

              <div className="mt-2 font-medium text-sm truncate w-full">
                {trackName}
              </div>
              <div className="text-xs text-gray-400 truncate w-full">
                {artistList}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyPlayed;