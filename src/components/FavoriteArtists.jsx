const FavoriteArtists = ({ artists }) => (
  <div>
    <h2 className="text-xl font-bold mb-3">Favorite Artists</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {artists.map((artist) => (
        <div key={artist.id} className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white">
          <img
            src={artist.images?.[0]?.url}
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
