import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { calculateBlendPercentage } from '../../utils/blendCalculator';
import { Link } from 'react-router-dom';
import useLocationStore from '../../state/locationStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const OPENCAGE_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

function getInitials(name = '') {
  const words = name.trim().split(' ');
  if (words.length < 2) return words[0]?.[0]?.toUpperCase() || '';
  return (words[0][0] + words[1][0]).toUpperCase();
}

function getColor(name) {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  let hash = 0;
  for (let char of name) hash = char.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function MapResizeFix() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

function UserMarker() {
  const { userLocation, currentUser } = useLocationStore();
  if (!userLocation || !currentUser) return null;

  const initials = getInitials(currentUser.displayName || currentUser.username);
  const icon = L.divIcon({
    html: currentUser.avatar
      ? `<div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4);">
           <img src="${currentUser.avatar}" style="width:100%;height:100%;object-fit:cover;" />
         </div>`
      : `<div style="background-color:${getColor(currentUser.displayName || currentUser.username)};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;font-weight:bold;border:2px solid white;box-shadow:0 0 3px rgba(0,0,0,0.3);">${initials}</div>`,
    iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
  });

  return (
    <Marker position={[userLocation.latitude, userLocation.longitude]} icon={icon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function LocationMarker() {
  const [pos, setPos] = useState(null);
  useMapEvents({
    click() { this.locate(); },
    locationfound(e) { setPos(e.latlng); this.flyTo(e.latlng, this.getZoom()); },
  });
  return pos ? <Marker position={pos}><Popup>You are here</Popup></Marker> : null;
}

function FriendsMarkers({ visible, friends = [], selectedFriendId }) {
  const markerRefs = useRef({});
  const map = useMap();
  const [cityMap, setCityMap] = useState({});
  const [blendMap, setBlendMap] = useState({}); // friendId → {pct, loading}

  // fetch city names
  useEffect(() => {
    if (!friends.length || !OPENCAGE_KEY) return;
    const controller = new AbortController();
    friends.forEach(({ _id, location }) => {
      const [lng, lat] = location.coordinates;
      const key = `${lat},${lng}`;
      if (cityMap[key]) return;

      fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_KEY}`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => {
          const comp = data.results?.[0]?.components;
          const city = comp?.city || comp?.town || comp?.village || comp?.state || 'Unknown';
          setCityMap(prev => ({ ...prev, [key]: city }));
        })
        .catch(() => setCityMap(prev => ({ ...prev, [key]: 'Unknown' })));
    });
    return () => controller.abort();
  }, [friends, cityMap]);

  // pan and open popup for selected friend
  useEffect(() => {
    if (selectedFriendId && markerRefs.current[selectedFriendId]) {
      const marker = markerRefs.current[selectedFriendId];
      map.flyTo(marker.getLatLng(), 15);
      marker.openPopup();
    }
  }, [selectedFriendId, map]);

  const handlePopupOpen = async (friendId) => {
    if (blendMap[friendId]?.loading || blendMap[friendId]?.pct != null) return;
    setBlendMap(prev => ({ ...prev, [friendId]: { pct: null, loading: true } }));
    const pct = await calculateBlendPercentage(friendId).catch(() => 0);
    setBlendMap(prev => ({ ...prev, [friendId]: { pct, loading: false } }));
  };

  if (!visible) return null;

  return friends.map(friend => {
    const fid = friend.id || friend._id;
    const [lng, lat] = friend.location.coordinates;
    const city = cityMap[`${lat},${lng}`] || 'Loading...';
    const { pct, loading } = blendMap[fid] || {};

    const initials = getInitials(friend.displayName || friend.username);
    const hasAvatar = !!friend.avatar;
    const icon = L.divIcon({
      html: hasAvatar
        ? `<div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4);">
             <img src="${friend.avatar}" style="width:100%;height:100%;object-fit:cover;" />
           </div>`
        : `<div style="background-color:${getColor(friend.displayName || friend.username)};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;font-weight:bold;border:2px solid white;box-shadow:0 0 3px rgba(0,0,0,0.3);">${initials}</div>`,
      iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
    });

    return (
      <Marker
        key={fid}
        position={[lat, lng]}
        icon={icon}
        ref={ref => ref && (markerRefs.current[fid] = ref)}
      >
        <Popup
          minWidth={260}
          maxWidth={300}
          onOpen={() => handlePopupOpen(fid)}
        >
          <div className="backdrop-blur-sm bg-black/60 rounded-2xl p-4 shadow-xl text-white space-y-4 font-sans">
            <div className="flex gap-3 items-center">
              {hasAvatar ? (
                <img src={friend.avatar} alt={friend.displayName} className="w-14 h-14 rounded-lg object-cover border border-white shadow" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow border border-white">{initials}</div>
              )}
              <div className="flex flex-col gap-1 text-sm text-white/90">
                <h2 className="text-base font-semibold">{friend.displayName || friend.username}</h2>
                <div className="flex items-center gap-1 text-white/70">
                  <span>📍</span>
                  <span>{city}</span>
                </div>
              </div>
            </div>

            <div className="text-sm font-medium text-white/90">
              Blend Match:{' '}
              {loading ? '...' : pct != null ? <span className="font-bold text-green-400">{pct}%</span> : '—'}
            </div>

            <Link
              to={`/friends/${fid}`}
              className="block w-full bg-blue-600 text-white text-center font-semibold py-2 rounded-xl hover:bg-blue-700 transition"
            >
              Go to Profile
            </Link>

            <div className="flex gap-2">
              <a href={`http://maps.apple.com/?daddr=${lat},${lng}`} target="_blank" rel="noopener noreferrer"
                 className="flex-1 text-center bg-gray-800 text-white font-medium py-2 rounded-xl hover:bg-gray-700 transition">
                Apple Maps
              </a>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noopener noreferrer"
                 className="flex-1 text-center bg-gray-800 text-white font-medium py-2 rounded-xl hover:bg-gray-700 transition">
                Google Maps
              </a>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  });
}

function EventMarkers({ visible, events = [], selectedEventId }) {
  const markerRefs = useRef({});
  const map = useMap();
  const [cityMap, setCityMap] = useState({});

  useEffect(() => {
    events.forEach(event => {
      const [lng, lat] = event.location.coordinates;
      const key = `${lat},${lng}`;
      if (cityMap[key]) return;

      fetch(`${API_BASE}/api/geocode/reverse?lat=${lat}&lon=${lng}&addressdetails=1`)
        .then(res => res.json())
        .then(data => setCityMap(prev => ({ ...prev, [key]: data.city || 'Unknown' })))
        .catch(() => setCityMap(prev => ({ ...prev, [key]: 'Unknown' })));
    });
  }, [events, cityMap]);

  useEffect(() => {
    if (selectedEventId && markerRefs.current[selectedEventId]) {
      const marker = markerRefs.current[selectedEventId];
      map.flyTo(marker.getLatLng(), 15);
      marker.openPopup();
    }
  }, [selectedEventId, map]);

  if (!visible) return null;

  return events.map((event, idx) => {
    const id = event._id || `event-${idx}`;
    const [lng, lat] = event.location.coordinates;
    const city = cityMap[`${lat},${lng}`] || 'Loading...';

    const icon = event.image
      ? L.divIcon({
          html: `<div style="width:36px;height:36px;border-radius:8px;overflow:hidden;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4);">
               <img src="${event.image}" style="width:100%;height:100%;object-fit:cover;" />
             </div>`,
          iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
        })
      : L.divIcon({
          html: `<div style="background-color:#3B82F6;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;font-weight:bold;border:2px solid white;box-shadow:0 0 3px rgba(0,0,0,0.3);">
               ${getInitials(event.title)}
             </div>`,
          iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -36],
        });

    return (
      <Marker key={id} position={[lat, lng]} icon={icon}
              ref={ref => ref && (markerRefs.current[id] = ref)}>
        <Popup minWidth={280} maxWidth={320}>
          <div className="backdrop-blur-sm bg-black/60 rounded-2xl p-4 shadow-xl text-white space-y-4">
            <div className="flex gap-3 items-center">
              {event.image ? (
                <img src={event.image} alt={event.title} className="w-14 h-14 rounded-lg object-cover border border-white shadow" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow border border-white">
                  {getInitials(event.title)}
                </div>
              )}
              <div className="flex flex-col gap-1 text-sm text-white/90">
                <h2 className="text-base font-semibold">{event.title}</h2>
                <div className="flex items-center gap-1 text-white/70">
                  <span>🕒</span>
                  <span>{new Date(event.date).toLocaleString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: 'numeric', minute: '2-digit', hour12: true,
                  })}</span>
                </div>
                <div className="flex items-center gap-1 text-white/70">
                  <span>📍</span>
                  <span>{city}</span>
                </div>
              </div>
            </div>
            {event.ticketUrl && (
              <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer"
                 className="block w-full text-center bg-white text-black font-semibold py-2 rounded-xl hover:bg-gray-200">
                Buy Ticket
              </a>
            )}
            <div className="flex gap-2">
              <a href={`http://maps.apple.com/?daddr=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-gray-800 text-white py-2 rounded-xl hover:bg-gray-700">Apple Maps</a>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-gray-800 text-white py-2 rounded-xl hover:bg-gray-700">Google Maps</a>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  });
}

function MapView({
  events, showEvents, setShowEvents,
  showFriends, setShowFriends,
  selectedEventId, friends, selectedFriendId
}) {
  const { userLocation } = useLocationStore();
  const center = userLocation
    ? { lat: userLocation.latitude, lng: userLocation.longitude }
    : { lat: 43.7022, lng: -72.2896 };

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-[999] space-x-2">
        <button onClick={() => setShowEvents(prev => !prev)} className={`${showEvents ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-gray-300'} px-4 py-2 rounded-md shadow`}>
          Events
        </button>
        <button onClick={() => setShowFriends(prev => !prev)} className={`${showFriends ? 'bg-blue-500 text-white' : 'bg-white text-black hover:bg-gray-300'} px-4 py-2 rounded-md shadow`}>
          Friends
        </button>
      </div>

      <MapContainer center={center} zoom={13} scrollWheelZoom className="w-full h-full z-0">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapResizeFix />
        <UserMarker />
        <LocationMarker />
        <FriendsMarkers visible={showFriends} friends={friends} selectedFriendId={selectedFriendId} />
        <EventMarkers visible={showEvents} events={events} selectedEventId={selectedEventId} />
      </MapContainer>
    </div>
  );
}


export default MapView;
