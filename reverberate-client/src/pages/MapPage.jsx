import React, { useState, useEffect } from 'react';
import EventList from '../components/map/eventList';
import FilterBar from '../components/map/filterBar';

const sampleEvents = [
  {
    name: 'The Rockapellas',
    genre: 'pop',
    distance: '0.5',
    time: '2024-05-20T22:00:00',
    image: '/images/rockapellas.jpg',
  },
  {
    name: 'Sheba',
    genre: 'jazz',
    distance: '0.6',
    time: '2024-05-20T20:00:00',
    image: '/images/sheba.jpg',
  },
  {
    name: 'Coast Jazz Orchestra',
    genre: 'jazz',
    distance: '1',
    time: '2024-05-24T19:00:00',
    image: '/images/jazz.jpg',
  },
];

const MapPage = () => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ genre: '', sortBy: '' });

  useEffect(() => {
    let filtered = [...sampleEvents];

    if (filters.genre) {
      filtered = filtered.filter(event =>
        event.genre.toLowerCase() === filters.genre.toLowerCase()
      );
    }

    if (filters.sortBy === 'nearest') {
      filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (filters.sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.time) - new Date(b.time));
    }

    setEvents(filtered);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="w-screen h-screen flex bg-gradient-to-b from-[#012e40] via-[#001c29] to-black text-white">
      <div className="w-[24rem] min-w-[300px] p-6 space-y-6 bg-black/30 backdrop-blur-lg">
        <FilterBar onFilterChange={handleFilterChange} />
        <EventList events={events} />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-3xl font-semibold text-white/80">
          Map View Coming Soon
        </div>
      </div>
    </div>
  );
};

export default MapPage;
