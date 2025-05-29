// src/components/map/EventCard.jsx

import React, { useState, useEffect } from 'react';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import PeopleIcon from '@mui/icons-material/People';

function distance(lat1, lon1, lat2, lon2) {
  const r = 6371; // km
  const p = Math.PI / 180;

  const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2
                + Math.cos(lat1 * p) * Math.cos(lat2 * p) *
                  (1 - Math.cos((lon2 - lon1) * p)) / 2;

  return 2 * r * Math.asin(Math.sqrt(a));
};
const EventCard = ({ event }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [eventDistance, setEventDistance] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        if (event.location?.coordinates?.length === 2) {
          const [lng, lat] = event.location.coordinates;
          const dist = distance(latitude, longitude, lat, lng);
          setEventDistance(dist.toFixed(2));
        }
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, [event]);

  const formattedDate = new Date(event.date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
  });

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white text-black shadow-sm">
      <img
        src={event.image}
        alt={event.title}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="text-base font-semibold text-black">{event.title}</h3>
        <p className="text-sm text-gray-700">
          {eventDistance && (
            <span className="text-green-600 font-medium">
              {eventDistance} km
            </span>
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
