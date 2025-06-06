import React, { useState, useEffect } from 'react';
import EventList from '../components/map/eventList';
import FriendList from '../components/map/friendList';
import FilterBar from '../components/map/filterBar';
import SearchBar from '../components/map/searchBar';
import MapView from '../components/map/mapView';
import { fetchEventsByLocation } from '../api/ticketmaster';
import useLocationStore from '../state/locationStore';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';



const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const MapPage = () => {
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [showEvents, setShowEvents] = useState(true);
  const [showFriends, setShowFriends] = useState(true);
  const [filters, setFilters] = useState({ genre: '', sortBy: '', distance: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  const { userLocation, fetchUserLocation } = useLocationStore();

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  // Fetch events based on user location
  useEffect(() => {
    async function loadEvents() {
      const radius = filters.distance || 100;
      const fallbackCoords = { lat: 43.7, lon: -72.28 };
      const latitude = userLocation?.latitude ?? fallbackCoords.lat;
      const longitude = userLocation?.longitude ?? fallbackCoords.lon;

      try {
        const rawEvents = await fetchEventsByLocation(latitude, longitude, radius);
        const enriched = rawEvents.map(e => ({
          ...e,
          distance: calculateDistance(latitude, longitude, e.location.coordinates[1], e.location.coordinates[0])
        }));
        setEvents(enriched);
        setAllEvents(enriched);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    }

    if (userLocation || filters.distance) {
      loadEvents();
    }
  }, [userLocation, filters.distance]);

  useEffect(() => {
    async function loadFriends() {
      try {
        const res = await fetch(`${API_BASE}/spotify/friends/top`, {
          credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to fetch friends');
        const data = await res.json();

        // Map to location-enhanced friends
        const enriched = data.friends
          .filter(f => f.friend?.location?.coordinates)
          .map(({ friend, topArtists, topTracks }) => {
            const [lng, lat] = friend.location.coordinates;
            const distance = calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng);
            return {
              ...friend,
              distance,
              topArtists,
              topTracks,
            };
          });

        setAllFriends(enriched);
        setFilteredFriends(enriched);
      } catch (err) {
        console.error('Error loading friends:', err);
      }
    }

    if (userLocation) {
      loadFriends();
    }
  }, [userLocation]);

  // Filter and sort friends
  useEffect(() => {
    let filtered = [...allFriends];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(friend =>
        friend.displayName.toLowerCase().includes(term) ||
        friend.userName?.toLowerCase().includes(term)
      );
    }

    if (filters.sortBy === 'nearest') {
      filtered.sort((a, b) => a.distance - b.distance);
    }

    if (filters.distance) {
      const maxDistance = parseFloat(filters.distance);
      filtered = filtered.filter(friend => friend.distance <= maxDistance);
    }

    setFilteredFriends(filtered);
  }, [filters, searchTerm, allFriends]);

  // Filter and sort events
  useEffect(() => {
    let filtered = [...allEvents];

    if (filters.genre) {
      const genreKey = filters.genre.toLowerCase().replace(/[^a-z0-9]/g, '');
      filtered = filtered.filter(event => event.genreKey === genreKey);
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

    if (filters.distance) {
      const maxDistance = parseFloat(filters.distance);
      filtered = filtered.filter(event => event.distance <= maxDistance);
    }

    setEvents(filtered);
  }, [filters, searchTerm, allEvents]);

  const genreOptions = Array.from(new Set(allEvents.map(e => e.genre))).sort();

  return (
    <div className="w-screen h-screen flex bg-gradient-to-b from-[#012e40] via-[#001c29] to-black text-white">
      <div className="flex flex-1 overflow-hidden h-full">
        <div className="w-[24rem] min-w-[300px] top-50 p-6 space-y-6 bg-black/30 backdrop-blur-lg overflow-y-auto max-h-screen">
          <SearchBar onSearchChange={setSearchTerm} />
          <FilterBar onFilterChange={setFilters} genres={genreOptions} />
          <EventList events={showEvents ? events : []} onSelect={setSelectedEventId} visible={showEvents} />
          <FriendList friends={showFriends ? filteredFriends : []} visible={showFriends} onSelect={setSelectedFriendId} />
        </div>
        <div className="flex-1 relative">
          <MapView
            events={events}
            showEvents={showEvents}
            setShowEvents={setShowEvents}
            showFriends={showFriends}
            setShowFriends={setShowFriends}
            selectedEventId={selectedEventId}
            friends={filteredFriends}
            selectedFriendId={selectedFriendId}
          />
        </div>
      </div>
    </div>
  );
};

export default MapPage;
