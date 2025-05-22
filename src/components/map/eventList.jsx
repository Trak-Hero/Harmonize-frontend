import React from 'react';
import Event from './event';

const EventList = ({ events }) => {
  return (
    <div className="flex flex-col gap-4">
      {events.length === 0 ? (
        <p className="text-white text-center">No events found</p>
      ) : (
        events.map((event, idx) => (
          <Event key={idx} event={event} />
        ))
      )}
    </div>
  );
};

export default EventList;
