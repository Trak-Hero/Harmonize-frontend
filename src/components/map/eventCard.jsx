import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import useLocationStore from '../../state/locationStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const distance = (lat1, lon1, lat2, lon2) => {
  const r = 6371;
  const p = Math.PI / 180;
  const a =
    0.5 -
    Math.cos((lat2 - lat1) * p) / 2 +
    Math.cos(lat1 * p) * Math.cos(lat2 * p) * (1 - Math.cos((lon2 - lon1) * p)) / 2;
  return 2 * r * Math.asin(Math.sqrt(a));
};

const getInitials = (title = '') => {
  const words = title.trim().split(' ');
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0]?.toUpperCase() || '';
  return (words[0][0] + words[1][0]).toUpperCase();
};

const EventCard = ({ event, onSelect }) => {
  const { userLocation } = useLocationStore();
  const [eventDistance, setEventDistance] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [city, setCity] = useState('Loading...');

  const [lng, lat] = event.location?.coordinates || [];

  useEffect(() => {
    if (userLocation && lat != null && lng != null) {
      const dist = distance(userLocation.latitude, userLocation.longitude, lat, lng);
      setEventDistance(dist.toFixed(2));
    }
  }, [userLocation, lat, lng]);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/geocode/reverse?lat=${lat}&lon=${lng}&addressdetails=1`);
        const data = await res.json();
        setCity(data.city || 'Unknown');
      } catch {
        setCity('Unknown');
      }
    };

    if (lat != null && lng != null) {
      fetchCity();
    }
  }, [lat, lng]);

  const formattedDate = new Date(event.date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const hasImage = !!event.image;

  const handleCardClick = () => onSelect?.(event._id);
  const handleTicketClick = (e) => {
    e.stopPropagation();
    if (event.ticketUrl) {
      window.open(event.ticketUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setShowPopup((prev) => !prev);
  };

  const handleClose = () => setShowPopup(false);

  const popup = showPopup && ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={handleClose}
      />
      {/* Centered Popup */}
      <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md">
        <div className="bg-gradient-to-b from-gray-900 to-black text-white shadow-xl rounded-xl p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <Typography variant="h6" sx={{ fontSize: '1.125rem', fontWeight: 600 }}>
                {event.title}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', opacity: 0.7 }}>
                {city}
              </Typography>
            </div>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* Distance */}
          {eventDistance && (
            <div className="inline-flex items-center px-3 py-1.5 mb-4 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs text-blue-300 font-medium">
              {eventDistance} km away
            </div>
          )}

          {/* Info */}
          <div className="space-y-4 text-sm">
            <div className="flex gap-2 items-start">
              <LocationOnIcon fontSize="small" sx={{ fontSize: '18px', opacity: 0.6 }} />
              <div>
                <div className="font-medium text-white">Location</div>
                <div className="text-white/70">{city}</div>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <AccessTimeIcon fontSize="small" sx={{ fontSize: '18px', opacity: 0.6 }} />
              <div>
                <div className="font-medium text-white">Date & Time</div>
                <div className="text-white/70">{formattedDate}</div>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <ConfirmationNumberIcon fontSize="small" sx={{ fontSize: '18px', opacity: 0.6 }} />
              <div>
                <div className="font-medium text-white">Tickets</div>
                <div className="text-white/70">
                  {event.ticketUrl ? 'Available' : 'Not available yet'}
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Button */}
          {event.ticketUrl && (
            <Button
              onClick={handleTicketClick}
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                fontSize: '0.875rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669, #047857)',
                },
              }}
            >
              Get Tickets
            </Button>
          )}
        </div>
      </div>
    </>,
    document.body
  );

  return (
    <div className="relative flex">
      {/* Main Card */}
      <div
        onClick={handleCardClick}
        className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border-l-4 border-green-500 text-black shadow transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-95 cursor-pointer h-28 w-full"
      >
        {hasImage ? (
          <img src={event.image} alt={event.title} className="w-12 h-12 rounded-xl object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center font-bold text-lg">
            {getInitials(event.title)}
          </div>
        )}

        <div className="flex-1">
          <h3 className="text-base font-semibold text-black">{event.title}</h3>
          <p className="text-sm text-gray-700">
            {eventDistance && <span className="text-green-600 font-medium">{eventDistance} km</span>}
            {eventDistance && ' • '}
            {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-3 text-black/70">
          <PeopleIcon fontSize="small" />
          <InfoOutlineIcon
            fontSize="small"
            className="cursor-pointer hover:text-green-600 hover:scale-110 transition-all duration-200"
            onClick={handleInfoClick}
          />
        </div>
      </div>

      {/* Render Popup (Portal) */}
      {popup}
    </div>
  );
};

export default EventCard;
