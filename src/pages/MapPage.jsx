// src/pages/MapPage.js
import React, { useState, useEffect } from 'react';
import EventList from '../components/map/eventList';
import FriendList from '../components/map/friendList';
import FilterBar from '../components/map/filterBar';
import SearchBar from '../components/map/searchBar';
import MapView from '../components/map/mapView';
import { fetchEventsByLocation } from '../api/ticketmaster';

const sampleEvents = [
  {
    _id: 'rockapellas', 
    title: 'The Rockapellas',
    artistId: '60af8840c45e2f001f4d32b1',
    location: {
      type: 'Point',
      coordinates: [-72.2896, 43.7025]
    },
    date: new Date('2024-05-20T22:00:00'),
    genre: 'pop',
    description: 'A capella group performance',
    image: '/images/rockapellas.jpg'
  },
  {
    _id: 'sheba',
    title: 'Sheba',
    artistId: '60af8840c45e2f001f4d32b2',
    location: {
      type: 'Point',
      coordinates: [-72.2880, 43.7030]
    },
    date: new Date('2024-05-20T20:00:00'),
    genre: 'pop',
    description: 'fight club themed performance',
    image: '/images/sheba.jpg'
  },
  {
    _id: 'coast-jazz',
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
    _id: 'john-doe-1',
    displayName: 'John Doe',
    location: {
      type: 'Point',
      coordinates: [-72.2802, 43.7025]
    }
  },
  {
    _id: 'jane-smith-2',
    displayName: 'Jane Smith',
    location: {
      type: 'Point',
      coordinates: [-72.2840, 43.7040]
    }
  },
  {
    _id: 'emily-johnson-3',
    displayName: 'Emily Johnson',
    location: {
      type: 'Point',
      coordinates: [-72.2815, 43.7060]
    }
  },
  {
    _id: 'michael-brown-4',
    displayName: 'Michael Brown',
    location: {
      type: 'Point',
      coordinates: [-72.2830, 43.7010]
    }
  },
  {
    _id: 'sarah-williams-5',
    displayName: 'Sarah Williams',
    location: {
      type: 'Point',
      coordinates: [-72.2865, 43.7035]
    }
  }
];



const MapPage = () => {
  const [events, setEvents] = useState([]);
  const [showEvents, setShowEvents] = useState(true);
  const [showFriends, setShowFriends] = useState(true);
  const [filters, setFilters] = useState({ genre: '', sortBy: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedFriendId, setSelectedFriendId] = useState(null);


  useEffect(() => {
    async function loadEvents() {
      const fetchedEvents = await fetchEventsByLocation(43.7, -72.28);
      setEvents(fetchedEvents);
    }
    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = [...sampleEvents];

    if (filters.genre) {
      filtered = filtered.filter(event =>
        event.genre.toLowerCase() === filters.genre.toLowerCase()
      );
    }

    if (searchTerm) {
      const newSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(newSearchTerm) ||
        event.description.toLowerCase().includes(newSearchTerm) // next fix here
      );
    }

    if (filters.sortBy === 'nearest') {
      filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (filters.sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setEvents(filtered);
  }, [filters, searchTerm]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };


  return (
    <div className="w-screen h-screen flex bg-gradient-to-b from-[#012e40] via-[#001c29] to-black text-white">
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Sidebar */}
        <div className="w-[24rem] min-w-[300px] top-50 p-6 space-y-6 bg-black/30 backdrop-blur-lg overflow-y-auto max-h-screen">
          <SearchBar onSearchChange={handleSearchChange} />
          <FilterBar onFilterChange={handleFilterChange} />
          <EventList 
            events={showEvents ? events : []} 
            onSelect={setSelectedEventId} 
            visible={showEvents}
          />
          <FriendList friends={showFriends ? sampleFriends : []} visible={showFriends} onSelect={setSelectedFriendId}  />
        </div>

        {/* Main area (map will eventually go here) */}
        <div className="flex-1 relative">
          <MapView
            events={events}
            showEvents={showEvents}
            setShowEvents={setShowEvents}
            showFriends={showFriends}
            setShowFriends={setShowFriends}
            selectedEventId={selectedEventId} 
            friends={sampleFriends}
            selectedFriendId={selectedFriendId}
          />
        </div>

      </div>
    </div>
  );
};

export default MapPage;
