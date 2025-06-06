// src/components/FavoriteArtists.jsx
import React from 'react';

const FavoriteArtists = ({ artists = [] }) => {
  if (!Array.isArray(artists) || artists.length === 0) {
    return (
      <div className="p-6 bg-black/50 rounded-xl text-white text-center">
        <h2 className="text-xl font-bold mb-3">Favorite Artists</h2>
        <p className="text-white/60">No favorite artists to show.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Favorite Artists</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {artists.map((artist) => {
          // Each artist object from /api/me/spotify now has `artist.image` (not `artist.images`)
          const imgUrl = artist.image || '';
          const name   = artist.name || 'Unknown Artist';

          return (
            <div
              key={artist.id}
              className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white flex flex-col items-center"
            >
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt={name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-full h-32 bg-gray-700 rounded mb-2 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
              <div className="mt-2 font-medium text-sm text-center truncate w-full">
                {name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoriteArtists;