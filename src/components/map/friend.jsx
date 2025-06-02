import React from 'react';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import PeopleIcon from '@mui/icons-material/People';

const getInitials = (name = '') => {
  const words = name.trim().split(' ');
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0]?.toUpperCase() || '';
  return (words[0][0] + words[1][0]).toUpperCase();
};

const Friend = ({ friend }) => {
  const hasImage = !!friend.image;

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border-l-4 border-blue-500 text-black shadow-sm">
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
        <h3 className="text-base font-semibold text-black">{friend.displayName}</h3>
        <p className="text-sm text-gray-700">
          {friend.location.coordinates.join(', ')} • {friend.lastActive}
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
