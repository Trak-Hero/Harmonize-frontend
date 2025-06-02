import React from 'react';
import EventCard from './eventCard';

const EventList = ({ events, onSelect, visible=true }) => {
  if (!visible) return null;
  return (
    <div className="flex flex-col gap-4">
      {events.length === 0 ? (
        <p className="text-white text-center">No events found</p>
      ) : (
        events.map((event, idx) => (
          <EventCard 
            key={idx} 
            event={event} 
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  );
};

export default EventList;
