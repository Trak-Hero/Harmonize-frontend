const FavoriteSongs = ({ songs }) => (
  <div>
    <h2 className="text-xl font-bold mb-3">Favorite Songs</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {songs.map((song, idx) => (
        <div key={idx} className="bg-black/50 rounded-xl p-4 backdrop-blur-md text-white">
          <img
            src={song.album?.images?.[0]?.url}
            alt={song.name}
            className="w-full h-32 object-cover rounded"
          />
          <div className="mt-2 font-medium text-sm">{song.name}</div>
          <div className="text-xs text-gray-400">
            {song.artists?.map((a) => a.name).join(', ')}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FavoriteSongs;
