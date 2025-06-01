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

      <div className="mt-2">
          <p className="text-sm text-gray-300 font-medium">Percent Match:</p>
          <p className="text-xl font-bold text-green-400">{friend.matchPercent || 0}%</p>

          <Link
            to={`/blendmode/${friend.id}`}
            className="mt-1 inline-block text-sm text-blue-400 hover:underline">
            See More
          </Link>
      </div>
    </div>
  );
};

export default FriendCard;
