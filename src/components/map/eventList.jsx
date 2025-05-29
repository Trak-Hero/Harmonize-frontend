import React from 'react';
import EventCard from './eventCard'; // Ensure the filename is capitalized to match the component

const EventList = ({ events }) => {
  return (
    <div className="flex flex-col gap-4">
      {events.length === 0 ? (
        <p className="text-white text-center">No events found</p>
      ) : (
        events.map((event, idx) => (
          <EventCard key={idx} event={event} />
        ))
      )}
    </div>
  );
};

export default EventList;
