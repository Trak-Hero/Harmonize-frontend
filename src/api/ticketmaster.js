import.meta.env.VITE_TICKETMASTER_API_KEY
import geohash from 'ngeohash';

export async function fetchEventsByLocation(lat, lng, radius = 100) {
  const geoPoint = geohash.encode(lat, lng);
  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&geoPoint=${geoPoint}&radius=${radius}&unit=miles&classificationName=music`;


  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data._embedded && data._embedded.events) {
      return data._embedded.events.map((event) => ({
        _id: event.id,
        title: event.name,
        location: {
          type: 'Point',
          coordinates: [
            parseFloat(event._embedded.venues[0].location.longitude),
            parseFloat(event._embedded.venues[0].location.latitude),
          ],
        },
        date: event.dates.start.dateTime,
        genre: event.classifications?.[0]?.genre?.name || 'Unknown',
        description: event.info || 'No description available',
        image: event.images?.[0]?.url || '',
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}
