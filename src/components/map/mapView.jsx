import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import useLocationStore from '../../state/locationStore';

const LocationMarker = () => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click() {
      this.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      this.flyTo(e.latlng, this.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

const MapResizeFix = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
};

const getInitials = (name = '') => {
  const words = name.trim().split(' ');
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0]?.toUpperCase() || '';
  return (words[0][0] + words[1][0]).toUpperCase();
};

const getColor = (name) => {
  // Pick color based on name hash
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const FriendsMarkers = ({ visible, friends = [], selectedFriendId }) => {
  const markerRefs = useRef({});
  const map = useMap();

  useEffect(() => {
    if (selectedFriendId && markerRefs.current[selectedFriendId]) {
      const marker = markerRefs.current[selectedFriendId];
      const latLng = marker.getLatLng();
      map.flyTo(latLng, 15); // zoom level 15
      marker.openPopup();
    }
  }, [selectedFriendId, map]);

  if (!visible) return null;

  return friends.map((friend) => {
    const initials = getInitials(friend.displayName || friend.username);
    const bgColor = getColor(friend.displayName || friend.username);
    const icon = L.divIcon({
      html: `<div style="
        background-color: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 14px;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 0 3px rgba(0,0,0,0.3);
      ">${initials}</div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    return friend.location?.coordinates?.length === 2 ? (
      <Marker
        key={friend._id}
        position={[friend.location.coordinates[1], friend.location.coordinates[0]]}
        icon={icon}
        ref={(ref) => {
          if (ref) markerRefs.current[friend._id] = ref;
        }}
      >
        <Popup>
          <div>
            <h2>{friend.displayName || friend.username}</h2>
          </div>
        </Popup>
      </Marker>
    ) : null;
  });
};

const EventMarkers = ({ visible, events = [], selectedEventId }) => {
  const markerRefs = useRef({});
  const fetchedKeysRef = useRef(new Set());
  const [cityMap, setCityMap] = useState({});
  const map = useMap();

  useEffect(() => {
    events.forEach(async (event) => {
      const key = `${event.location.coordinates[1]},${event.location.coordinates[0]}`;
      if (!fetchedKeysRef.current.has(key)) {
        fetchedKeysRef.current.add(key);
        try {
          const res = await fetch(`http://localhost:8080/api/geocode/reverse?lat=${event.location.coordinates[1]}&lon=${event.location.coordinates[0]}&addressdetails=1}`);
          const data = await res.json();
          setCityMap(prev => ({ ...prev, [key]: data.city }));
        } catch (error) {
          setCityMap(prev => ({ ...prev, [key]: 'Unknown' }));
        }
      }
    });
  }, [events]);

  useEffect(() => {
    if (selectedEventId && markerRefs.current[selectedEventId]) {
      const marker = markerRefs.current[selectedEventId];
      const latLng = marker.getLatLng();
      map.flyTo(latLng, 15); // zoom level 15
      marker.openPopup();
    }
  }, [selectedEventId, map]);

  if (!visible) return null;

  return events.map((event, idx) => {
    const id = event._id || `event-${idx}`;
    const [lng, lat] = event.location.coordinates;
    const key = `${lat},${lng}`;
    const city = cityMap[key] || 'Loading...';

    const isApple = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform);
    const mapUrl = isApple
      ? `http://maps.apple.com/?daddr=${lat},${lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;


    return (
      <Marker
        key={id}
        position={[lat, lng]}
        ref={(ref) => { if (ref) markerRefs.current[id] = ref; }}
        icon={L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        })}
      >
        <Popup minWidth={260} maxWidth={300}>
          <div className="backdrop-blur-sm bg-black/50 rounded-2xl p-4 shadow-xl space-y-3 text-white font-sans">
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-300">{new Date(event.date).toLocaleString()}</p>
            <p className="text-sm italic text-gray-400">📍 {city}</p>

            <div className="space-y-2">
              {event.ticketUrl && (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Buy Ticket
                </a>
              )}
              <div className="flex gap-2">
                <a
                  href={`http://maps.apple.com/?daddr=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-gray-800 text-white font-medium py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Apple Maps
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-gray-800 text-white font-medium py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Google Maps
                </a>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  });
};

const MapView = ({ events, showEvents, setShowEvents, showFriends, setShowFriends, selectedEventId, friends, selectedFriendId }) => {
  const { userLocation } = useLocationStore();
  const defaultCenter = { lat: 43.7022, lng: -72.2896 };
  const center = userLocation ? { lat: userLocation.latitude, lng: userLocation.longitude } : defaultCenter;
  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-[999] space-x-2">
        <button
          onClick={() => setShowEvents(prev => !prev)}
          className={`px-4 py-2 rounded-md shadow transition ${
            showEvents ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-gray-300'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setShowFriends(prev => !prev)}
          className={`px-4 py-2 rounded-md shadow transition ${
            showFriends ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-gray-300'
          }`}
        >
          Friends
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizeFix />
        <LocationMarker />
        <FriendsMarkers
          visible={showFriends}
          friends={friends} // from props
          selectedFriendId={selectedFriendId}
        />
        <EventMarkers visible={showEvents} events={events} selectedEventId={selectedEventId} />
      </MapContainer>
    </div>
  );
};

export default MapView;
