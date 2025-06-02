// utils/mapTrack.js
export default function mapTrack(item) {
  if (!item) {
    console.warn('mapTrack: received null/undefined item');
    return null;
  }

  try {
    // Handle different data structures from Spotify API
    const track = item.track || item;
    
    if (!track) {
      console.warn('mapTrack: no track data found in item:', item);
      return null;
    }

    // Extract basic track info
    const id = track.id || `temp_${Date.now()}_${Math.random()}`;
    const name = track.name || 'Unknown Track';
    
    // Handle artists array safely
    let artists = [];
    if (track.artists && Array.isArray(track.artists)) {
      artists = track.artists
        .filter(artist => artist && artist.name)
        .map(artist => artist.name);
    } else if (track.artist && track.artist.name) {
      // Handle single artist object
      artists = [track.artist.name];
    }

    // Handle album info safely
    let image = null;
    let albumName = null;
    
    if (track.album) {
      albumName = track.album.name;
      if (track.album.images && Array.isArray(track.album.images) && track.album.images.length > 0) {
        // Get medium sized image, fallback to largest available
        image = track.album.images.find(img => img.width >= 300)?.url || 
                track.album.images[0]?.url;
      }
    }

    // Handle preview URL
    const preview_url = track.preview_url || null;
    
    // Handle external URLs
    const external_urls = track.external_urls || {};

    const mappedTrack = {
      id,
      name,
      artists,
      album: albumName,
      image,
      preview_url,
      external_urls,
      // Keep original for debugging
      _original: track
    };

    return mappedTrack;
  } catch (error) {
    console.error('mapTrack error:', error, 'Item:', item);
    // Return a fallback object instead of null to prevent crashes
    return {
      id: `error_${Date.now()}`,
      name: 'Error loading track',
      artists: [],
      album: null,
      image: null,
      preview_url: null,
      external_urls: {}
    };
  }
}