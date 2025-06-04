import React from 'react';
import { Link } from 'react-router-dom';

const FriendCard = ({ friend }) => {
  if (!friend) return null;

  const {
    id,
    _id,
    name,
    username,
    avatar,
    genres  = [],
    artists = [],
    matchPercent = 0,
  } = friend;

  const safeId   = id || _id || '';
  const safeName = name || username || 'Unknown';

  return (
    <div className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white text-center hover:scale-[1.02] transition-transform duration-200">
      <Link to={`/friends/${safeId}`} className="block hover:opacity-90">
        <div className="flex justify-center mb-4">
          <img
<<<<<<< HEAD
<<<<<<< HEAD
            src={avatar || 'https://placehold.co/150'}
=======
            src={avatar || 'https://via.placeholder.com/150'}
>>>>>>> c5dddb1 (istg)
=======
            src={avatar || 'https://placehold.co/150'}
>>>>>>> 129f8a0 (1)
            alt={`${safeName}'s avatar`}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        <h2 className="text-lg font-semibold mb-2">{safeName}</h2>

        <p className="text-sm text-gray-100 mb-1">
          <span className="font-medium text-gray-300">Genres:</span>{' '}
          {(genres ?? []).join(', ') || '—'}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-300">Top Artists:</span>{' '}
          {(artists ?? []).join(', ') || '—'}
        </p>

        <p className="text-sm text-gray-300 font-medium">Percent Match:</p>
        <p className="text-xl font-bold text-green-400">{matchPercent}%</p>
      </Link>

      <Link
        to={`/blendmode/${safeId}`}
        className="mt-2 inline-block text-sm text-blue-400 hover:underline"
      >
        See more on Blend Mode
      </Link>
    </div>
  );
};

export default FriendCard;
