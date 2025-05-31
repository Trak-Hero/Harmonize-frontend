import { useProfileStore } from '../state/profileStore';

const Tile = ({ tile }) => {
  const setEditorOpen = useProfileStore((s) => s.setEditorOpen);

  return (
    <div
      className="relative h-full w-full rounded-lg overflow-hidden border border-white/40"
      style={{
        backgroundColor: tile.bgColor ?? 'transparent',
        backgroundImage:  tile.bgImage ? `url(${tile.bgImage})` : undefined,
        backgroundSize:   'cover',
        backgroundPosition: 'center',
        fontFamily: tile.font || 'sans-serif',
      }}
    >
      {/* Edit button */}
      <button
        onClick={(e) => { e.stopPropagation(); setEditorOpen(true, tile._id); }}
        className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70"
      >
        Edit
      </button>

      {/* ─── TEXT TILE ─── */}
      {tile.type === 'text' && (
        <div className="p-4 text-white">{tile.content}</div>
      )}

      {/* ─── ARTIST TILE ─── */}
      {tile.type === 'artist' && (
        <div className="absolute inset-0 flex items-end p-4 bg-black/40 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white">{tile.title}</h3>
        </div>
      )}

      {/* other tile types can be added here … */}
    </div>
  );
};

export default Tile;
