import React, { useState, useEffect } from 'react';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import PeopleIcon from '@mui/icons-material/People';
import useLocationStore from '../../state/locationStore';

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

const getInitials = (title = '') => {
  const words = title.trim().split(' ');
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0]?.toUpperCase() || '';
  return (words[0][0] + words[1][0]).toUpperCase();
};

const EventCard = ({ event, onSelect }) => {
  const { userLocation } = useLocationStore();
  const [eventDistance, setEventDistance] = useState(null);
  
  useEffect(() => {
    if (userLocation && event.location?.coordinates?.length === 2) {
      const [lng, lat] = event.location.coordinates;
      const dist = distance(userLocation.latitude, userLocation.longitude, lat, lng);
      setEventDistance(dist.toFixed(2));
    }
  }, [userLocation, event]);


  const formattedDate = new Date(event.date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const hasImage = !!event.image;

  const handleClick = () => {
    if (onSelect) {
      onSelect(event._id); // Pass the ID to parent map handler
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border-l-4 border-green-500 text-black shadow transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-95 cursor-pointer"
    >
      {hasImage ? (
        <img
          src={event.image}
          alt={event.title}
          className="w-12 h-12 rounded-xl object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center font-bold text-lg">
          {getInitials(event.title)}
        </div>
      )}

      <div className="flex-1">
        <h3 className="text-base font-semibold text-black">{event.title}</h3>
        <p className="text-sm text-gray-700">
          {eventDistance && (
            <span className="text-green-600 font-medium">{eventDistance} km</span>
          )}
          {eventDistance && ' • '}
          {formattedDate}
        </p>
      </div>

      <div className="flex items-center gap-3 text-black/70">
        <PeopleIcon fontSize="small" />
        <InfoOutlineIcon fontSize="small" />
      </div>
    </div>
  );
};

export default EventCard;
