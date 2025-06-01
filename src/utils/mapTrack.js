// src/utils/mapTrack.js
export default function mapTrack(track = {}) {
  return {
    id:      track.id || crypto.randomUUID(),
    name:    track.name || track.title || 'Untitled',
    artists: track.artists?.map(a => a.name) || [track.artist || 'Unknown'],
    image:
      track.album?.images?.[0]?.url ||
      track.cover ||
      track.image ||
      '/fallback.jpg',
    preview: track.preview_url || track.preview || null,
  };
}
