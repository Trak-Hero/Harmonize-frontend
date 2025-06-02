// src/components/Tile.jsx
import { useProfileStore } from '../state/profileStore';

const Tile = ({ tile }) => {
  if (!tile || typeof tile !== 'object') {
    console.warn('[Tile.jsx] Skipped rendering invalid tile:', tile);
    return <div className="text-red-500 p-4">Invalid tile</div>;
  }

  try {
    console.log('[Tile.jsx] rendering tile:', tile);
    const setEditorOpen = useProfileStore((s) => s.setEditorOpen);
    const deleteTile    = useProfileStore((s) => s.deleteTile);

    // If the tile has a “title” (used for artist/song/text), use that:
    const displayTitle = tile.title ?? tile.name ?? tile.content ?? '';
    const showTitle    = !!displayTitle;
    const id           = tile._id || tile.id;

    // ────────────── CHANGED HERE ──────────────
    // Always prefer tile.bgImage (that’s what is actually saved in Mongo).
    // We no longer look at tile.image, because our schema does NOT store “image”.
    let chosenImage = '';
    if (tile.bgImage && tile.bgImage !== '/') {
      chosenImage = tile.bgImage;
    }
    // If chosenImage is empty or literally “/”, we’ll show a placeholder later:
    const safeImageSrc =
      chosenImage && chosenImage !== '/' ? chosenImage : '/placeholder.jpg';
    // ───────────────────────────────────────────

    return (
      <div
        className="relative h-full w-full rounded-lg overflow-hidden border border-white/40 group"
        style={{
          backgroundColor: tile.bgColor ?? 'transparent',
          fontFamily: tile.font || 'sans-serif',
        }}
      >
        {/* ── Background Image (all tile types except “picture”) ── */}
        {tile.type !== 'picture' && chosenImage && (
          <img
            src={safeImageSrc}
            alt=""
            onError={(e) => { e.target.src = '/placeholder.jpg'; }}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}

        {/* ── Artist or Song tile: show the title overlay at the bottom ── */}
        {(tile.type === 'artist' || tile.type === 'song') && showTitle && (
          <div className="absolute inset-0 flex items-end p-4 bg-black/40 backdrop-blur-sm z-10">
            <h3 className="text-xl font-bold text-white">{displayTitle}</h3>
          </div>
        )}

        {/* ── Text tile: center the text on a plain background ── */}
        {tile.type === 'text' && (
          <div className="relative z-10 p-4 text-white break-words whitespace-pre-wrap h-full flex items-center justify-center">
            <div className="text-center">
              {tile.content || 'Click Edit to add text'}
            </div>
          </div>
        )}

        {/* ── Picture tile: honors its own bgImage field ── */}
        {tile.type === 'picture' && (
          <div className="relative z-10 h-full w-full">
            {tile.bgImage && tile.bgImage !== '/' ? (
              <img
                src={tile.bgImage}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white bg-gray-600">
                <span>Click Edit to add image</span>
              </div>
            )}
          </div>
        )}

        {/* ── Spacer tile: nothing to render ── */}
        {tile.type === 'spacer' && null}

        {/* ── Edit / Delete buttons (owner only can see these) ── */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditorOpen(true, id);
          }}
          className="absolute top-2 right-2 z-20 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Delete this tile?')) deleteTile(id);
          }}
          className="absolute top-2 left-2 z-20 bg-red-500/70 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    );
  } catch (err) {
    console.error('[Tile.jsx] Error rendering tile:', tile, err);
    return <div className="text-red-500 p-4">Failed to load tile</div>;
  }
};

export default Tile;
