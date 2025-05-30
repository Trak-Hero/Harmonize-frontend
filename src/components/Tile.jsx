import { useProfileStore } from '../state/profileStore';

const Tile = ({ tile }) => {
  const setEditorOpen = useProfileStore((s) => s.setEditorOpen);

  return (
    <div
      className="relative h-full w-full rounded-lg overflow-hidden border border-white/40"
      style={{
        backgroundColor: tile.bgColor,
        backgroundImage: tile.bgImage ? `url(${tile.bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: tile.font || 'sans-serif',
      }}
    >
      {/* ✏️ Edit Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent triggering parent drag
          setEditorOpen(true, tile.id);
        }}
        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs z-10 hover:bg-opacity-80"
      >
        Edit
      </button>

      {/* Your Tile content here */}
      <div className="p-4">
        {tile.type === 'text' && <p>{tile.content}</p>}
        {tile.type === 'artist' && (
          <>
            {tile.image && <img src={tile.image} alt={tile.name} className="w-full h-24 object-cover rounded" />}
            <p className="mt-2 font-semibold">{tile.name}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Tile;
