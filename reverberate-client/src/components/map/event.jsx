import React from 'react';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import PeopleIcon from '@mui/icons-material/People';

const Event = ({ event }) => {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white text-black shadow-sm">
      <img
        src={event.image}
        alt={event.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <h3 className="flex items-start text-base font-semibold leading-tight">{event.name}</h3>
        <p className="flex items-start text-sm text-gray-500">{event.distance} • {event.time}</p>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <PeopleIcon fontSize="small" />
        <InfoOutlineIcon fontSize="small" />
      </div>
    </div>
  );
};

export default Event;
