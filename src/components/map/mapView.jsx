import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
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

const MapView = () => {
  return (
    <div className="w-full h-full relative"> {/* Make parent relative to position buttons */}
      {/* Overlayed buttons */}
      <div className="absolute top-4 left-4 z-[999] space-x-2">
        <button className="bg-white text-black px-4 py-2 rounded-md shadow">
          Events
        </button>
        <button className="bg-white text-black px-4 py-2 rounded-md shadow">
          Friends
        </button>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={{ lat: 43.7022, lng: -72.2896 }}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizeFix />
        <LocationMarker />
      </MapContainer>
    </div>
  );
};

export default MapView;
