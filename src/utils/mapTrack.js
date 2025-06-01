// src/utils/mapTrack.js

export default function mapTrack(track) {
  return {
    name: track.name || track.title || 'Untitled',
    artists: track.artists?.map(a => a.name) || [track.artist || 'Unknown'],
    image:
      track.album?.images?.[0]?.url ||
      track.cover ||
      track.image ||
      '/fallback.jpg',
  };
}
