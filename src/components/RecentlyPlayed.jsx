import { useEffect, useState } from 'react';

const RecentlyPlayed = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/spotify/recent')
      .then((res) => res.json())
      .then((data) => setTracks(data))
      .catch((err) => console.error('Error fetching recent tracks:', err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Recently Played</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tracks.map((item, idx) => {
          const track = item.track;
          return (
            <div key={idx} className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white">
              <img
                src={track?.album?.images?.[0]?.url}
                alt={track?.name || 'track'}
                className="w-full h-32 object-cover rounded"
              />
              <div className="mt-2 font-medium text-sm truncate">{track?.name}</div>
              <div className="text-xs text-gray-400">
                {track?.artists?.map((a) => a.name).join(', ')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyPlayed;
