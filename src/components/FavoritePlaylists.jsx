export default function FavoritePlaylists({ playlists = [] }) {
  if (!playlists.length) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
      <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {playlists.map((pl) => (
          <li key={pl.id} className="flex items-center gap-3">
            {pl.image ? (
              <img
                src={pl.image}
                alt=""
                className="h-12 w-12 object-cover rounded shadow"
              />
            ) : (
              <div className="h-12 w-12 bg-white/10 rounded" />
            )}
            <div className="flex-1">
              <p className="font-medium">{pl.name}</p>
              <p className="text-xs text-white/60">{pl.tracks} tracks</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
