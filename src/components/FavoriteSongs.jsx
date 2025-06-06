import React from 'react';

const FavoriteSongs = ({ songs = [] }) => {
  // 1) If `songs` isn’t an array or is empty, show a placeholder.
  if (!Array.isArray(songs) || songs.length === 0) {
    return (
      <div className="p-6 bg-black/50 rounded-xl text-white text-center">
        <h2 className="text-xl font-bold mb-3">Favorite Songs</h2>
        <p className="text-white/60">No favorite songs to display.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Favorite Songs</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {songs.map((song, idx) => {
          // Safe‐access `song.album`
          const albumImages = song.album?.images ?? [];
          const imageUrl = albumImages[0]?.url ?? '';

          // Safe‐access `song.name` and `song.artists`
          const songName = song.name ?? 'Unknown Title';
          const artistList = Array.isArray(song.artists)
            ? song.artists.map(a => a.name).join(', ')
            : 'Unknown Artist';

          return (
            <div
              key={song.id ?? idx}
              className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white flex flex-col items-start"
            >
              {/* Only render <img> if there’s a valid imageUrl */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={songName}
                  className="w-full h-32 object-cover rounded"
                />
              ) : (
                <div className="w-full h-32 bg-gray-800 flex items-center justify-center rounded">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}

              <div className="mt-2 font-medium text-sm truncate w-full">
                {songName}
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

export default FavoriteSongs;