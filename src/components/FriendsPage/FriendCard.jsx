import React from 'react';
import { Link } from 'react-router-dom';

const FriendCard = ({ friend }) => {
  return (
    <div className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white text-center hover:scale-[1.02] transition-transform duration-200">
      <div className="flex justify-center mb-4">
        <img
          src={friend.avatar || 'https://via.placeholder.com/150'}
          alt={`${friend.name}'s avatar`}
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>
      <h2 className="text-lg font-semibold mb-2">{friend.name}</h2>
      <p className="text-sm text-gray-500 mb-1">
        <span className="font-medium text-gray-400">Genres:</span> {friend.genres.join(', ')}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium text-gray-400">Top Artists:</span> {friend.artists.join(', ')}
      </p>

      {friend.sharedPlaylists?.length > 0 && (
        <div className="text-left mt-4">
          <h4 className="text-sm font-semibold mb-1 text-gray-300">Shared Playlists</h4>
          <ul className="list-none list-inside text-sm text-blue-600 space-y-1">
            {friend.sharedPlaylists.map((playlist) => (
              <li key={playlist.id}>
                <Link to={`/playlists/${playlist.id}`} className="hover:underline">
                  {playlist.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FriendCard;
