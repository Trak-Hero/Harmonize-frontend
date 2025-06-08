import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { calculateBlendPercentage } from '../../utils/blendCalculator';

const FriendCard = ({ friend }) => {
  const [blendPercentage, setBlendPercentage] = useState(0);
  const [isCalculating, setIsCalculating] = useState(true);

  if (!friend) return null;

  const {
    id,
    _id,
    name,
    username,
    displayName,
    avatar,
    genres = [],
    artists = [],
  } = friend;

  const safeId = id || _id || '';
  const safeName = displayName || name || username || 'Unknown';

  useEffect(() => {
    const calculateBlend = async () => {
      if (!safeId) return;
      
      setIsCalculating(true);
      try {
        const percentage = await calculateBlendPercentage(safeId);
        setBlendPercentage(percentage);
      } catch (error) {
        console.error('Error calculating blend for friend:', safeName, error);
        setBlendPercentage(0);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateBlend();
  }, [safeId, safeName]);

  return (
    <div className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white text-center hover:scale-[1.02] transition-transform duration-200">
      <Link to={`/friends/${safeId}`} className="block hover:opacity-90">
        <div className="flex justify-center mb-4">
          <img
            src={avatar || 'https://placehold.co/150'}
            alt={`${safeName}'s avatar`}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        <h2 className="text-lg font-semibold mb-2">{safeName}</h2>

        {/* <p className="text-sm text-gray-100 mb-1">
          <span className="font-medium text-gray-300">Genres:</span>{' '}
          {(genres ?? []).join(', ') || '—'}
        </p>

        <p className="text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-300">Top Artists:</span>{' '}
          {(artists ?? []).join(', ') || '—'}
        </p> */}

        <p className="text-sm text-gray-300 font-medium">Percent Match:</p>
        <p className="text-xl font-bold text-green-400">
          {isCalculating ? (
            <span className="animate-pulse">...</span>
          ) : (
            `${blendPercentage}%`
          )}
        </p>
      </Link>

      <Link
        to={`/blend?user=${safeId}`}
        className="mt-2 inline-block text-sm text-blue-400 hover:underline"
      >
        See more on Blend Mode
      </Link>
    </div>
  );
};

export default FriendCard;