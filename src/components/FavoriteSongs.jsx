import { useEffect, useState } from 'react';

const FavoriteSongs = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/spotify/recent')
      .then((res) => res.json())
      .then((data) => setTracks(data))
      .catch((err) => console.error('Error fetching top tracks:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Loading favorite songs...</p>;

  return (
    <div className="space-y-4">
      {tracks.map((track, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <img src={track.album.images[0]?.url} alt="" className="w-12 h-12 rounded" />
          <div>
            <p className="font-medium">{track.name}</p>
            <p className="text-sm text-gray-400">{track.artists.map(a => a.name).join(', ')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoriteSongs;
