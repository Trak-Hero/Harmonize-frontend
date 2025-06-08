import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import useLocationStore from '../../state/locationStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const UserMarker = () => {
  const { userLocation, currentUser } = useLocationStore();

  if (!userLocation || !currentUser) return null;

  const initials = getInitials(currentUser.displayName || currentUser.username);
  const hasAvatar = !!currentUser.avatar;
  const bgColor = getColor(currentUser.displayName || currentUser.username);

  const icon = hasAvatar
    ? L.divIcon({
        html: `<div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.4);
        ">
          <img src="${currentUser.avatar}" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      })
    : L.divIcon({
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

  return (
    <Marker
      position={[userLocation.latitude, userLocation.longitude]}
      icon={icon}
    >
      <Popup>You are here</Popup>
    </Marker>
  );
};


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
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const OPENCAGE_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

const FriendsMarkers = ({ visible, friends = [], selectedFriendId }) => {
  const markerRefs = useRef({});
  const fetchedKeysRef = useRef(new Set());
  const [cityMap, setCityMap] = useState({});
  const map = useMap();

  useEffect(() => {
    if (!friends?.length || !OPENCAGE_KEY) return;

    const controller = new AbortController();

    const fetchCities = async () => {
      const promises = friends.map(async (friend) => {
        const [lng, lat] = friend.location?.coordinates || [];
        if (lat == null || lng == null) return;

        const key = `${lat},${lng}`;
        if (fetchedKeysRef.current.has(key)) return;

        fetchedKeysRef.current.add(key);

        try {
          const res = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_KEY}`,
            { signal: controller.signal }
          );
          const data = await res.json();
          const components = data?.results?.[0]?.components;
          const city =
            components?.city ||
            components?.town ||
            components?.village ||
            components?.state ||
            'Unknown';

          setCityMap((prev) => ({ ...prev, [key]: city }));
        } catch (err) {
          if (err.name !== 'AbortError') {
            setCityMap((prev) => ({ ...prev, [key]: 'Unknown' }));
          }
        }
      });

      await Promise.all(promises);
    };

    fetchCities();

    return () => controller.abort();
  }, [friends]);

 
  useEffect(() => {
    if (selectedFriendId && markerRefs.current[selectedFriendId]) {
      const marker = markerRefs.current[selectedFriendId];
      const latLng = marker.getLatLng();
      map.flyTo(latLng, 15);
      marker.openPopup();
    }
  }, [selectedFriendId, map]);

  if (!visible) return null;

  return friends.map((friend) => {
    const initials = getInitials(friend.displayName || friend.username);
    const bgColor = getColor(friend.displayName || friend.username);
    const [lng, lat] = friend.location.coordinates;
    const key = `${lat},${lng}`;
    const city = cityMap[key] || 'Loading...';

    const hasPfp = !!friend.pfpUrl;
    const icon = hasPfp
      ? L.divIcon({
          html: `<div style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid white;
            box-shadow: 0 0 4px rgba(0,0,0,0.4);
          ">
            <img src="${friend.pfpUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        })
      : L.divIcon({
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

    return (
      <Marker
        key={friend._id}
        position={[lat, lng]}
        icon={icon}
        ref={(ref) => {
          if (ref) markerRefs.current[friend._id] = ref;
        }}
      >
        <Popup minWidth={210} maxWidth={260}>
          <div className="backdrop-blur-sm bg-black/50 rounded-2xl p-4 shadow-xl space-y-2 text-white font-sans">
            <h2 className="text-md font-semibold">{friend.displayName || friend.username}</h2>
            <p className="text-sm italic text-gray-300">📍 {city}</p>
            <div className="flex gap-1">
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
        </Popup>
      </Marker>
    );
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
          const res = await fetch(`${API_BASE}/api/geocode/reverse?lat=${event.location.coordinates[1]}&lon=${event.location.coordinates[0]}&addressdetails=1`);
          const data = await res.json();
          setCityMap(prev => ({ ...prev, [key]: data.city }));
        } catch {
          setCityMap(prev => ({ ...prev, [key]: 'Unknown' }));
        }
      }
    });
  }, [events]);

  useEffect(() => {
    if (selectedEventId && markerRefs.current[selectedEventId]) {
      const marker = markerRefs.current[selectedEventId];
      const latLng = marker.getLatLng();
      map.flyTo(latLng, 15);
      marker.openPopup();
    }
  }, [selectedEventId, map]);

  if (!visible) return null;

  return events.map((event, idx) => {
    const id = event._id || `event-${idx}`;
    const [lng, lat] = event.location.coordinates;
    const key = `${lat},${lng}`;
    const city = cityMap[key] || 'Loading...';

    const hasImage = !!event.image;
    const icon = hasImage
      ? L.divIcon({
          html: `<div style="
            width: 36px;
            height: 36px;
            border-radius: 8px;
            overflow: hidden;
            border: 2px solid white;
            box-shadow: 0 0 4px rgba(0,0,0,0.4);
          ">
            <img src="${event.image}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        })
      : L.divIcon({
          html: `<div style="
            background-color: #3B82F6;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            font-weight: bold;
            border: 2px solid white;
            box-shadow: 0 0 3px rgba(0,0,0,0.3);
          ">${getInitials(event.title)}</div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

    return (
      <Marker
        key={id}
        position={[lat, lng]}
        icon={icon}
        ref={(ref) => { if (ref) markerRefs.current[id] = ref; }}
      >
        <Popup minWidth={280} maxWidth={320}>
          <div className="backdrop-blur-sm bg-black/60 rounded-2xl p-4 shadow-xl text-white space-y-4 font-sans">
            <div className="flex gap-3 items-center">
              {/* Left: Image */}
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-14 h-14 rounded-lg object-cover border border-white shadow"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow border border-white">
                  {getInitials(event.title)}
                </div>
              )}

              {/* Right: Info */}
              <div className="flex flex-col gap-1 text-sm text-white/90">
                <h2 className="text-base font-semibold text-white leading-snug">{event.title}</h2>

                <div className="flex items-center gap-1 text-white/70">
                  <span>🕒</span>
                  <span>
                    {new Date(event.date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-white/70">
                  <span>📍</span>
                  <span>{city}</span>
                </div>
              </div>
            </div>

            {/* Ticket Button */}
            {event.ticketUrl && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white text-black font-semibold py-2 rounded-xl hover:bg-gray-200 transition"
              >
                Buy Ticket
              </a>
            )}

            {/* Map Buttons */}
            <div className="flex gap-2">
              <a
                href={`http://maps.apple.com/?daddr=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-gray-800 text-white font-medium py-2 rounded-xl hover:bg-gray-700 transition"
              >
                Apple Maps
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-gray-800 text-white font-medium py-2 rounded-xl hover:bg-gray-700 transition"
              >
                Google Maps
              </a>
            </div>
          </div>
        </Popup>


      </Marker>
    );
  });
};

const MapView = ({
  events,
  showEvents,
  setShowEvents,
  showFriends,
  setShowFriends,
  selectedEventId,
  friends,
  selectedFriendId,
}) => {
  const { userLocation } = useLocationStore();
  const defaultCenter = { lat: 43.7022, lng: -72.2896 };
  const center = userLocation
    ? { lat: userLocation.latitude, lng: userLocation.longitude }
    : defaultCenter;

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-[999] space-x-2">
        <button
          onClick={() => setShowEvents((prev) => !prev)}
          className={`px-4 py-2 rounded-md shadow transition ${
            showEvents
              ? 'bg-blue-500 text-white'
              : 'bg-white text-black hover:bg-gray-300'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setShowFriends((prev) => !prev)}
          className={`px-4 py-2 rounded-md shadow transition ${
            showFriends
              ? 'bg-blue-500 text-white'
              : 'bg-white text-black hover:bg-gray-300'
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
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizeFix />
        <UserMarker /> {/* ✅ This shows your actual location */}
        <FriendsMarkers
          visible={showFriends}
          friends={friends}
          selectedFriendId={selectedFriendId}
        />
        <EventMarkers
          visible={showEvents}
          events={events}
          selectedEventId={selectedEventId}
        />
      </MapContainer>
    </div>
  );
};


export default MapView;
