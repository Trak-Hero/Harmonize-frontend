import React, { useState, useEffect } from 'react';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CloseIcon from '@mui/icons-material/Close';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
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
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (userLocation && event.location?.coordinates?.length === 2) {
      const [lng, lat] = event.location.coordinates;
      const dist = distance(userLocation.latitude, userLocation.longitude, lat, lng);
      setEventDistance(dist.toFixed(2));
    }
  }, [userLocation, event]);

  const handleInfoClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? 'event-info-popover' : undefined;

  const formattedDate = new Date(event.date).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const hasImage = !!event.image;

  const handleClick = () => {
    if (onSelect) {
      onSelect(event._id);
    }
  };

  const handleTicketClick = (e) => {
    e.stopPropagation();
    if (event.ticketUrl) {
      window.open(event.ticketUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border-l-4 border-green-500 text-black shadow transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-95 cursor-pointer h-28"
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
        <InfoOutlineIcon
          fontSize="small"
          className="cursor-pointer hover:text-green-600 hover:scale-110 transition-all duration-200"
          onClick={handleInfoClick}
        />
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        disableRestoreFocus
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            maxWidth: '320px',
            minWidth: '280px',
            border: '1px solid rgba(0,0,0,0.08)',
          }
        }}
      >
        <div className="relative">
          {/* Header with image or gradient */}
          <div className="relative h-24 bg-gradient-to-br from-green-500 to-green-600 overflow-hidden">
            {hasImage && (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Close button */}
            <IconButton
              onClick={handleClose}
              size="small"
              className="absolute top-2 right-2 text-white hover:bg-white/20"
              sx={{ 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>

            {/* Title overlay */}
            <div className="absolute bottom-3 left-4 right-4">
              <Typography 
                variant="h6" 
                className="text-white font-bold truncate"
                sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}
              >
                {event.title}
              </Typography>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Distance chip */}
            {eventDistance && (
              <div className="flex justify-center">
                <Chip
                  label={`${eventDistance} km away`}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 500 }}
                />
              </div>
            )}

            {/* Event details */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <LocationOnIcon 
                  fontSize="small" 
                  className="text-gray-500 mt-0.5 flex-shrink-0" 
                />
                <div>
                  <Typography variant="body2" className="font-medium text-gray-800">
                    Venue
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.venue || 'Location TBD'}
                  </Typography>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AccessTimeIcon 
                  fontSize="small" 
                  className="text-gray-500 mt-0.5 flex-shrink-0" 
                />
                <div>
                  <Typography variant="body2" className="font-medium text-gray-800">
                    Date & Time
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formattedDate}
                  </Typography>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ConfirmationNumberIcon 
                  fontSize="small" 
                  className="text-gray-500 mt-0.5 flex-shrink-0" 
                />
                <div>
                  <Typography variant="body2" className="font-medium text-gray-800">
                    Tickets
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {event.ticketUrl ? 'Available for purchase' : 'Not available yet'}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Action button */}
            {event.ticketUrl && (
              <div className="pt-2">
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleTicketClick}
                  sx={{
                    backgroundColor: '#10b981',
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.2,
                    '&:hover': {
                      backgroundColor: '#059669',
                    }
                  }}
                >
                  Get Tickets
                </Button>
              </div>
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default EventCard;