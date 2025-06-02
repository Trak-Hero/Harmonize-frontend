import React, { useEffect, useState } from 'react';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import PeopleIcon from '@mui/icons-material/People';

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
  const hasImage = !!friend.image;
  const [userLocation, setUserLocation] = useState(null);
  const [friendDistance, setFriendDistance] = useState(null);

  useEffect(() => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
  
          if (friend.location?.coordinates?.length === 2) {
            const [lng, lat] = friend.location.coordinates;
            const dist = distance(latitude, longitude, lat, lng);
            setFriendDistance(dist.toFixed(2));
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }, [friend]);

  const handleClick = () => {
    if (onSelect) onSelect(friend._id); // Trigger the marker popup by ID
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer flex items-center justify-between gap-4 p-4 rounded-xl bg-white border-l-4 border-blue-500 text-black shadow transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
    >
      {hasImage ? (
        <img
          src={friend.image}
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
          {friendDistance} km • {friend.lastActive || 'Active now'}
        </p>
      </div>

      <div className="flex items-center gap-3 text-black/70">
        <PeopleIcon fontSize="small" />
        <InfoOutlineIcon fontSize="small" />
      </div>
    </div>
  );
};

export default Friend;
