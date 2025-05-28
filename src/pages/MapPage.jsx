// src/pages/MapPage.js
import React, { useState, useEffect } from 'react';
import EventList from '../components/map/eventList';
import FriendList from '../components/map/friendList';
import FilterBar from '../components/map/filterBar';
import SearchBar from '../components/map/searchBar';
import MapView from '../components/map/mapView';

const sampleEvents = [
  {
    title: 'The Rockapellas',
    artistId: '60af8840c45e2f001f4d32b1', // example ObjectId
    location: {
      type: 'Point',
      coordinates: [-72.2896, 43.7025]  // [lng, lat]
    },
    date: new Date('2024-05-20T22:00:00'),
    genre: 'pop',
    description: 'A capella group performance',
    image: '/images/rockapellas.jpg'
  },
  {
    title: 'Sheba',
    artistId: '60af8840c45e2f001f4d32b2',
    location: {
      type: 'Point',
      coordinates: [-72.2880, 43.7030]
    },
    date: new Date('2024-05-20T20:00:00'),
    genre: 'jazz',
    description: 'Smooth jazz evening',
    image: '/images/sheba.jpg'
  },
  {
    title: 'Coast Jazz Orchestra',
    artistId: '60af8840c45e2f001f4d32b3',
    location: {
      type: 'Point',
      coordinates: [-72.2850, 43.7050]
    },
    date: new Date('2024-05-24T19:00:00'),
    genre: 'jazz',
    description: 'Live performance by the coast',
    image: '/images/jazz.jpg'
  }
];

const sampleFriends = [
  {
    displayName: 'John Doe',
    location: {
      type: 'Point',
      coordinates: [-72.2896, 43.7025]
    }
  }
];

const MapPage = () => {
  const [events, setEvents] = useState([]);
  
  const [filters, setFilters] = useState({ genre: '', sortBy: '' });
  const [searchTerm, setSearchTerm] = useState('');


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
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setEvents(filtered);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <div className="w-screen h-screen flex bg-gradient-to-b from-[#012e40] via-[#001c29] to-black text-white">
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <div className="w-[24rem] min-w-[300px] top-50 p-6 space-y-6 bg-black/30 backdrop-blur-lg">
          <SearchBar onSearchChange={handleSearchChange} />
          <FilterBar onFilterChange={handleFilterChange} />
          <EventList events={events} />
          <FriendList friends={friends} />
        </div>

        {/* Main area (map will eventually go here) */}
        <div className="flex-1 relative">
          <MapView events={events} />
        </div>

      </div>
    </div>
  );
};

export default MapPage;
