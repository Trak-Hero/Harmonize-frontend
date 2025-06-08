import React, { useEffect, useState } from 'react';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import useLocationStore from '../../state/locationStore';
import { calculateBlendPercentage } from '../../utils/blendCalculator';

function distance(lat1, lon1, lat2, lon2) {
  const r = 6371;
  const p = Math.PI / 180;
  const a =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    Math.cos(lat1 * p) *
      Math.cos(lat2 * p) *
      (1 - Math.cos((lon2 - lon1) * p)) / 2;
  return 2 * r * Math.asin(Math.sqrt(a));
}

const getInitials = (name = '') => {
  const words = name.trim().split(' ');
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0]?.toUpperCase() || '';
  return (words[0][0] + words[1][0]).toUpperCase();
};

const Friend = ({ friend, onSelect }) => {
  const hasAvatar = !!friend.avatar;
  const { userLocation } = useLocationStore();
  const [friendDistance, setFriendDistance] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [blendPercentage, setBlendPercentage] = useState(0);
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    if (
      userLocation &&
      friend.location?.coordinates?.length === 2
    ) {
      const [lng, lat] = friend.location.coordinates;
      const dist = distance(userLocation.latitude, userLocation.longitude, lat, lng);
      setFriendDistance(dist.toFixed(2));
    }
  }, [userLocation, friend]);

  useEffect(() => {
    const fetchBlend = async () => {
      const safeId = friend.id || friend._id;
      if (!safeId) return;
      setIsCalculating(true);
      try {
        const percentage = await calculateBlendPercentage(safeId);
        setBlendPercentage(percentage);
      } catch (err) {
        console.error('Blend error:', err);
        setBlendPercentage(0);
      } finally {
        setIsCalculating(false);
      }
    };

    if (showPopup) fetchBlend();
  }, [showPopup, friend]);

  return (
    <div className="relative">
      <div
        onClick={() => {
          if (onSelect) onSelect(friend._id);
        }}
        className="cursor-pointer flex items-center justify-between gap-4 p-4 rounded-xl bg-white border-l-4 border-blue-500 text-black shadow transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
      >
        {hasAvatar ? (
          <img
            src={friend.avatar}
            alt={friend.displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-lg">
            {getInitials(friend.displayName)}
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-base font-semibold">{friend.displayName}</h3>
          <p className="text-sm text-gray-700">
            {friendDistance && (
              <span className="text-green-600 font-medium">{friendDistance} km</span>
            )}
            {friendDistance && ' • '}
            {friend.lastActive || 'Active now'}
          </p>
        </div>

        <div className="flex items-center text-black/80">
          <InfoOutlineIcon
            fontSize="small"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setShowPopup(true);
            }}
          />
        </div>
      </div>

      {showPopup && (
        <div className="absolute z-50 top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 w-64 rounded-xl shadow-xl text-center border">
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <CloseIcon fontSize="small" />
          </button>

          <div className="flex justify-center mb-3">
            <img
              src={friend.avatar || 'https://placehold.co/100'}
              alt={`${friend.displayName}'s avatar`}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>

          <h2 className="text-base font-semibold mb-1">{friend.displayName}</h2>

          <p className="text-xs text-gray-600 mb-1">
            <span className="font-medium text-gray-700">Genres:</span>{' '}
            {friend.genres?.length ? friend.genres.join(', ') : '—'}
          </p>

          <p className="text-xs text-gray-500 mb-2">
            <span className="font-medium text-gray-700">Top Artists:</span>{' '}
            {friend.artists?.length ? friend.artists.join(', ') : '—'}
          </p>

          <p className="text-xs text-gray-600 font-medium">Blend Match:</p>
          <p className="text-lg font-bold text-green-600 mb-2">
            {isCalculating ? <span className="animate-pulse">...</span> : `${blendPercentage}%`}
          </p>

          <Link
            to={`/friends/${friend.id || friend._id}`}
            className="inline-block px-3 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Go to Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default Friend;
