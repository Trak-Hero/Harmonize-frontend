import { useProfileStore } from '../state/profileStore';

/**
 * Generic tile renderer.
 *  – Shows a subtle border so users can see tile bounds
 *  – Passes _id (not id) to open the editor
 */
const Tile = ({ tile }) => {
  const setEditorOpen = useProfileStore((s) => s.setEditorOpen);

  return (
    <div
      /* ▼ visually separate each grid item */
      className="relative h-full w-full rounded-lg overflow-hidden border border-white/40"
      style={{
        backgroundColor: tile.bgColor,
        backgroundImage: tile.bgImage ? `url(${tile.bgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: tile.font || 'sans-serif',
      }}
    >
      {/* edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          /* ✅ pass Mongo `_id` so the store can find the tile */
          setEditorOpen(true, tile._id);
        }}
        className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70"
      >
        Edit
      </button>

      {/* tile body */}
      <div className="p-4">
        {tile.type === 'text'   && <p>{tile.content}</p>}
        {tile.type === 'artist' && (
          <>
            {tile.image && (
              <img
                src={tile.image}
                alt={tile.name}
                className="w-full h-24 object-cover rounded"
              />
            )}
            <p className="mt-2 font-semibold">{tile.name}</p>
          </>
        )}
        {/* add other tile types here */}
      </div>
    </div>
  );
};

export default Tile;
