import { useProfileStore } from '../state/profileStore';

const Tile = ({ tile }) => {
  const setEditorOpen = useProfileStore((s) => s.setEditorOpen);
  const deleteTile    = useProfileStore((s) => s.deleteTile);

  const id           = tile._id || tile.id;                 // works for temp + saved
  const displayTitle = tile.title ?? tile.name ?? tile.content ?? '';

  return (
    <div
      className="relative h-full w-full rounded-lg overflow-hidden border border-white/40"
      style={{
        backgroundColor: tile.bgColor ?? 'transparent',
        backgroundImage: tile.bgImage ? `url(${tile.bgImage})` : undefined,
        backgroundSize:  'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* ----- Edit ----- */}
      <button
        onClick={(e) => { e.stopPropagation(); setEditorOpen(true, id); }}
        className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70"
      >
        Edit
      </button>

      {/* ----- Delete ----- */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (window.confirm('Delete this tile?')) deleteTile(id);
        }}
        className="absolute top-2 left-2 bg-red-500/70 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
      >
        Delete
      </button>

      {/* TEXT */}
      {tile.type === 'text' && <div className="p-4 text-white">{tile.content}</div>}

      {/* ARTIST / SONG */}
      {(tile.type === 'artist' || tile.type === 'song') && displayTitle && (
        <div className="absolute inset-0 flex items-end p-4 bg-black/40 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white">{displayTitle}</h3>
        </div>
      )}

      {/* PICTURE */}
      {tile.type === 'picture' && tile.bgImage && (
        <img src={tile.bgImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
    </div>
  );
};

export default Tile;
