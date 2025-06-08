import { useEffect, useState } from 'react';
import axios from 'axios';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { genreOrigins } from '../utils/genreOrigins';
import { countryCoords } from '../utils/countryCoords';

const API = import.meta.env.VITE_API_BASE_URL ?? '';
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export default function GenreMap() {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/genre-stats`, { withCredentials: true })
      .then(res => {
        const { histogram } = res.data;

        const countryGroups = {};
        Object.entries(histogram).forEach(([genre, count]) => {
          const country = genreOrigins[genre.toLowerCase()];
          if (!country || !countryCoords[country]) return;
          if (!countryGroups[country]) countryGroups[country] = [];
          countryGroups[country].push({ genre, count });
        });

        const genreMarkers = Object.entries(countryGroups).flatMap(([country, genres]) => {
          const [lon, lat] = countryCoords[country];
          return genres.map((g, i) => ({
            ...g,
            country,
            coordinates: [lon, lat + i * 0.7],
          }));
        });

        setMarkers(genreMarkers);
      })
      .catch(err => console.error('[GenreMap] Failed:', err));
  }, []);

  return (
    <section className="max-w-6xl mx-auto mt-20 px-4">
      <h2 className="text-3xl font-semibold text-white text-center mb-6">Your Genre Geography</h2>
      <ComposableMap projection="geoEqualEarth" width={800} height={500} >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: '#1f1f1f', stroke: '#333', outline: 'none', transition: 'fill 0.2s ease' },
                  hover: { fill: '#444', outline: 'none' },
                  pressed: { fill: '#666', outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {markers.map(({ coordinates, genre, count }, i) => (
          <Marker key={i} coordinates={coordinates}>
            <circle
              r={3 + Math.sqrt(count)}
              fill={`hsl(${(i * 37) % 360}, 70%, 60%)`}
              stroke="#000"
              strokeWidth={0.5}
            />
            <text
              textAnchor="middle"
              y={-8}
              style={{ fill: '#ccc', fontSize: 9, pointerEvents: 'none', family: 'Afacad' }}
            >
              {genre}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </section>
  );
}
