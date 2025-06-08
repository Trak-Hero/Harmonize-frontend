import React, { useState, useEffect } from 'react';
import EventList from '../components/map/eventList';
import FriendList from '../components/map/friendList';
import FilterBar from '../components/map/filterBar';
import SearchBar from '../components/map/searchBar';
import MapView from '../components/map/mapView';
import { fetchEventsByLocation } from '../api/ticketmaster';
import useLocationStore from '../state/locationStore';
import useFriendStore from '../state/friendStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const promptForLocation = async () => {
  const confirm = window.confirm("Allow location access to show events and friends near you?");
  if (!confirm) return;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      
      // Validate coordinates before saving
      if (latitude === 0 && longitude === 0) {
        console.error('Invalid coordinates received: 0,0');
        alert("❌ Invalid location detected. Please try again.");
        return;
      }
      
      if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
        console.error('Invalid coordinates received:', { latitude, longitude });
        alert("❌ Invalid location detected. Please try again.");
        return;
      }
      
      console.log('📍 Valid location received:', { latitude, longitude });
      useLocationStore.getState().setUserLocation({ latitude, longitude });

      try {
        const response = await fetch(`${API_BASE}/api/users/location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ latitude, longitude }),
        });
        
        if (!response.ok) {
          const error = await response.json();
          console.error('Location save failed:', error);
          alert("❌ Failed to save your location. Please try again.");
        } else {
          console.log('✅ Location saved successfully');
        }
      } catch (err) {
        console.error('Location save error:', err);
        alert("❌ Failed to save your location. Please try again.");
      }
    },
    (error) => {
      console.error('Geolocation error:', error);
      alert(`❌ Failed to get your location: ${error.message}. Please allow location access in browser settings.`);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }
  );
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

  const { userLocation, fetchUserLocation, locationLoaded } = useLocationStore();
  const { currentUserId, friends, fetchAllFriends } = useFriendStore();

    useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          if (
            latitude === 0 || longitude === 0 ||
            Math.abs(latitude) > 90 || Math.abs(longitude) > 180
          ) {
            console.error('[❌ Location] Invalid coordinates received:', latitude, longitude);
            return;
          }

          console.log('[📍 Location] Sending coordinates:', latitude, longitude);
          useLocationStore.getState().setUserLocation({ latitude, longitude });

          const res = await fetch(`${API_BASE}/api/users/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ latitude, longitude }),
          });

          const data = await res.json();
          if (!res.ok) {
            console.error('[❌ Location] Failed to save:', data);
          } else {
            console.log('[✅ Location] Saved to backend:', data.location);
          }
        } catch (err) {
          console.error('[❌ Location] Failed to send location:', err);
        }
      },
      (err) => {
        console.error('[❌ Location] Geolocation error:', err);
        alert(`❌ Failed to get your location: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);


  useEffect(() => {
    if (!locationLoaded) fetchUserLocation();
  }, [ fetchUserLocation,locationLoaded]);

  useEffect(() => {
    if (!userLocation && locationLoaded) promptForLocation();
  }, [userLocation, locationLoaded]);

  useEffect(() => {
    if (userLocation && currentUserId) fetchAllFriends();
  }, [userLocation, currentUserId, fetchAllFriends]);

  useEffect(() => {
    if (!userLocation) return;

    const enriched = friends
      .filter(f => f.location?.coordinates?.length === 2)
      .map(f => {
        const [lng, lat] = f.location.coordinates;
        const distance = calculateDistance(userLocation.latitude, userLocation.longitude, lat, lng);
        return { ...f, distance };
      });

    // 🔍 DEBUG: Add these console logs to see what's happening
    console.log('[🔍 DEBUG] All friends from store:', friends);
    console.log('[🔍 DEBUG] Friends with location data:', friends.filter(f => f.location));
    console.log('[🔍 DEBUG] Friends with valid coordinates:', friends.filter(f => f.location?.coordinates?.length === 2));
    console.log('[🔍 DEBUG] Your location:', userLocation);
    console.log('[🔍 DEBUG] Enriched friends with distances:', enriched);

    setAllFriends(enriched);
    setFilteredFriends(enriched);
  }, [friends, userLocation]);

  useEffect(() => {
    async function loadEvents() {
      const radius = filters.distance || 100;
      const fallbackCoords = { lat: 43.7, lon: -72.28 };
      const latitude = userLocation?.latitude ?? fallbackCoords.lat;
      const longitude = userLocation?.longitude ?? fallbackCoords.lon;

      try {
        const rawEvents = await fetchEventsByLocation(latitude, longitude, radius);
        const enriched = rawEvents.map((e) => {
          const [lng, lat] = e.location.coordinates;
          return {
            ...e,
            distance: calculateDistance(latitude, longitude, lat, lng),
          };
        });

        setEvents(enriched);
        setAllEvents(enriched);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    }

    if (userLocation || filters.distance) loadEvents();
  }, [userLocation, filters.distance]);

  useEffect(() => {
    let filtered = [...allFriends];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(friend =>
        friend.displayName?.toLowerCase().includes(term) ||
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
        <div className="w-[24rem] min-w-[300px] top-50 p-6 space-y-3 bg-black/30 backdrop-blur-lg overflow-y-auto max-h-screen">
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
