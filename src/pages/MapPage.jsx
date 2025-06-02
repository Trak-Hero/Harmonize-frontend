// src/pages/MapPage.js
import React, { useState, useEffect } from 'react';
import EventList from '../components/map/eventList';
import FriendList from '../components/map/friendList';
import FilterBar from '../components/map/filterBar';
import SearchBar from '../components/map/searchBar';
import MapView from '../components/map/mapView';
import { fetchEventsByLocation } from '../api/ticketmaster';

const sampleFriends = [
  { _id: 'john-doe-1', displayName: 'John Doe', location: { type: 'Point', coordinates: [-72.2802, 43.7025] } },
  { _id: 'jane-smith-2', displayName: 'Jane Smith', location: { type: 'Point', coordinates: [-72.2840, 43.7040] } },
  { _id: 'emily-johnson-3', displayName: 'Emily Johnson', location: { type: 'Point', coordinates: [-72.2815, 43.7060] } },
  { _id: 'michael-brown-4', displayName: 'Michael Brown', location: { type: 'Point', coordinates: [-72.2830, 43.7010] } },
  { _id: 'sarah-williams-5', displayName: 'Sarah Williams', location: { type: 'Point', coordinates: [-72.2865, 43.7035] } }
];

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const MapPage = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [userCoords, setUserCoords] = useState({ lat: 43.7, lon: -72.28 }); // fallback default
  const [showEvents, setShowEvents] = useState(true);
  const [showFriends, setShowFriends] = useState(true);
  const [filters, setFilters] = useState({ genre: '', sortBy: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lon: longitude });
        const rawEvents = await fetchEventsByLocation(latitude, longitude);
        const enriched = rawEvents.map(e => ({
          ...e,
          distance: calculateDistance(latitude, longitude, e.location.coordinates[1], e.location.coordinates[0])
        }));
        setEvents(enriched);
        setAllEvents(enriched);
      } catch (err) {
        console.error("Geolocation or fetch failed, using fallback", err);
        const fallback = await fetchEventsByLocation(43.7, -72.28);
        const enriched = fallback.map(e => ({
          ...e,
          distance: calculateDistance(43.7, -72.28, e.location.coordinates[1], e.location.coordinates[0])
        }));
        setEvents(enriched);
        setAllEvents(enriched);
      }
    }
    loadEvents();
  }, []);

  useEffect(() => {
    let filtered = [...allEvents];

    const normalizeGenre = str => str?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';

    if (filters.genre) {
      const filterGenre = normalizeGenre(filters.genre);
      filtered = filtered.filter(event => normalizeGenre(event.genre) === filterGenre);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term)
      );
    }

    if (filters.sortBy === 'nearest') {
      filtered.sort((a, b) => a.distance - b.distance);
    } else if (filters.sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setEvents(filtered);
  }, [filters, searchTerm, allEvents]);

  return (
    <div className="w-screen h-screen flex bg-gradient-to-b from-[#012e40] via-[#001c29] to-black text-white">
      <div className="flex flex-1 overflow-hidden h-full">
        <div className="w-[24rem] min-w-[300px] top-50 p-6 space-y-6 bg-black/30 backdrop-blur-lg overflow-y-auto max-h-screen">
          <SearchBar onSearchChange={setSearchTerm} />
          <FilterBar onFilterChange={setFilters} />
          <EventList events={showEvents ? events : []} onSelect={setSelectedEventId} visible={showEvents} />
          <FriendList friends={showFriends ? sampleFriends : []} visible={showFriends} onSelect={setSelectedFriendId} />
        </div>
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
