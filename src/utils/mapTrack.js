export default function mapTrack(item) {
  if (!item) {
    console.warn('mapTrack: received null/undefined item');
    return null;
  }

  try {
    const track = item.track || item;
    
    if (!track) {
      console.warn('mapTrack: no track data found in item:', item);
      return null;
    }

    const id = track.id || `temp_${Date.now()}_${Math.random()}`;
    const name = track.name || 'Unknown Track';
    
    let artists = [];
    if (track.artists && Array.isArray(track.artists)) {
      artists = track.artists
        .filter(artist => artist && artist.name)
        .map(artist => artist.name);
    } else if (track.artist && track.artist.name) {
      artists = [track.artist.name];
    }

    let image = null;
    let albumName = null;
    
    if (track.album) {
      albumName = track.album.name;
      if (track.album.images && Array.isArray(track.album.images) && track.album.images.length > 0) {
        image = track.album.images.find(img => img.width >= 300)?.url || 
                track.album.images[0]?.url;
      }
    }

    const preview_url = track.preview_url || null;
    
    const external_urls = track.external_urls || {};

    const mappedTrack = {
      id,
      name,
      artists,
      album: albumName,
      image,
      preview_url,
      external_urls,
      _original: track
    };

    return mappedTrack;
  } catch (error) {
    console.error('mapTrack error:', error, 'Item:', item);
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