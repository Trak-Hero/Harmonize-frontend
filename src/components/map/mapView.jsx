import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';

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

  useEffect(() => {
    if (selectedFriendId && markerRefs.current[selectedFriendId]) {
      markerRefs.current[selectedFriendId].openPopup();
    }
  }, [selectedFriendId]);

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

  useEffect(() => {
    if (selectedEventId && markerRefs.current[selectedEventId]) {
      const marker = markerRefs.current[selectedEventId];
      marker.openPopup();
    }
  }, [selectedEventId]);

  if (!visible) return null;

  return events.map((event, idx) => {
    const id = event._id || `event-${idx}`;
    const [lng, lat] = event.location.coordinates;

    return (
      <Marker
        key={id}
        position={[lat, lng]}
        ref={(ref) => {
          if (ref) markerRefs.current[id] = ref;
        }}
        icon={L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        })}
      >
        <Popup>
          <div>
            <h2 className="font-bold">{event.title}</h2>
            <p>{event.description}</p>
            <p>{new Date(event.date).toLocaleString()}</p>
          </div>
        </Popup>
      </Marker>
    );
  });
};

const MapView = ({ events, showEvents, setShowEvents, showFriends, setShowFriends, selectedEventId, friends, selectedFriendId }) => {
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
        center={{ lat: 43.7022, lng: -72.2896 }}
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
