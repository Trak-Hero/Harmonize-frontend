const mockArtists = [
  { id: 1, name: 'Tame Impala', image: 'https://i.scdn.co/image/tame-impala.jpg' },
  { id: 2, name: 'Phoebe Bridgers', image: 'https://i.scdn.co/image/phoebe.jpg' },
  { id: 3, name: 'Tyler, The Creator', image: 'https://i.scdn.co/image/tyler.jpg' },
  { id: 4, name: 'Lana Del Rey', image: 'https://i.scdn.co/image/lana.jpg' },
  { id: 5, name: 'Arctic Monkeys', image: 'https://i.scdn.co/image/arctic.jpg' },
];

const FavoriteArtists = () => (
  <div>
    <h2 className="text-xl font-bold mb-3">Favorite Artists</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {mockArtists.map((artist) => (
        <div
          key={artist.id}
          className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white"
        >
          <img
            src={artist.image}
            alt={artist.name}
            className="w-full h-32 object-cover rounded"
          />
          <div className="mt-2 font-medium text-sm">{artist.name}</div>
        </div>
      ))}
    </div>
  </div>
);

export default FavoriteArtists;
