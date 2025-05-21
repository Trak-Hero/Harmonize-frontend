const mockSongs = [
  { name: 'The Less I Know The Better', artist: 'Tame Impala', image: 'https://i.scdn.co/image/track1.jpg' },
  { name: 'Kyoto', artist: 'Phoebe Bridgers', image: 'https://i.scdn.co/image/track2.jpg' },
  { name: 'EARFQUAKE', artist: 'Tyler, The Creator', image: 'https://i.scdn.co/image/track3.jpg' },
  { name: 'Young and Beautiful', artist: 'Lana Del Rey', image: 'https://i.scdn.co/image/track4.jpg' },
  { name: 'Do I Wanna Know?', artist: 'Arctic Monkeys', image: 'https://i.scdn.co/image/track5.jpg' },
];

const FavoriteSongs = () => (
  <div>
    <h2 className="text-xl font-bold mb-3">Favorite Songs</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {mockSongs.map((song, idx) => (
        <div
          key={idx}
          className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white"
        >
          <img
            src={song.image}
            alt={song.name}
            className="w-full h-32 object-cover rounded"
          />
          <div className="mt-2 font-medium text-sm">{song.name}</div>
          <div className="text-xs text-gray-400">{song.artist}</div>
        </div>
      ))}
    </div>
  </div>
);

export default FavoriteSongs;
