// api/geocode.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export async function geocodePlace(query) {
  const res = await fetch(`${API_BASE}/api/geocode?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Geocoding failed');
  return await res.json(); // Should return { latitude, longitude }
}
