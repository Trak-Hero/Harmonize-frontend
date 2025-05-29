import React, { useState, useEffect } from 'react';
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

const FriendsMarkers = ({ visible }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/friends', {
          credentials: 'include'
        });        
        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    fetchFriends();
  }, []);

  if (!visible) return null;

  return friends.map(friend =>
    friend.location?.coordinates?.length === 2 ? (
      <Marker
        key={friend._id}
        position={[friend.location.coordinates[1], friend.location.coordinates[0]]}
        icon={L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png',
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        })}
      >
        <Popup>
          <div>
            <h2>{friend.displayName || friend.username}</h2>
          </div>
        </Popup>
      </Marker>
    ) : null
  );
};

const EventMarkers = ({ visible, events }) => {
  if (!visible) return null;

  return events.map((event, idx) => (
    <Marker
      key={`event-${idx}`}
      position={[event.location.coordinates[1], event.location.coordinates[0]]}
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
  ));
};

const MapView = ({ events, showEvents, setShowEvents, showFriends, setShowFriends }) => {
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
        <FriendsMarkers visible={showFriends} />
        <EventMarkers visible={showEvents} events={events} />
      </MapContainer>
    </div>
  );
};

export default MapView;
