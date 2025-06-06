// src/components/Tile.jsx
import { useProfileStore } from '../state/profileStore';

const Tile = ({ tile }) => {
  if (!tile || typeof tile !== 'object') {
    console.warn('[Tile.jsx] Skipped rendering invalid tile:', tile);
    return <div className="text-red-500 p-4">Invalid tile</div>;
  }

  try {
    console.log('[Tile.jsx] Rendering tile with full data:', JSON.stringify(tile, null, 2));

    const setEditorOpen = useProfileStore((s) => s.setEditorOpen);
    const deleteTile = useProfileStore((s) => s.deleteTile);

    const displayTitle = tile.title ?? tile.name ?? tile.content ?? '';
    const displayContent = tile.content ?? '';
    const id = tile._id || tile.id;

    let chosenImage = '';
    if (tile.type !== 'text' && tile.bgImage && tile.bgImage.trim() && tile.bgImage !== '/') {
      chosenImage = tile.bgImage.trim();
    }

    return (
      <div
        className="relative h-full w-full rounded-lg overflow-hidden border border-white/40 group"
        style={{
          backgroundColor: tile.bgColor ?? (tile.type === 'text' ? '#374151' : 'transparent'),
          fontFamily: tile.font || 'sans-serif',
        }}
      >
        {/* Background image for non-text tiles */}
        {chosenImage && tile.type !== 'text' && (
          <div className="absolute inset-0 z-0">
            <img
              src={chosenImage}
              alt={displayTitle || tile.type}
              crossOrigin="anonymous"
              onLoad={() => console.log('[Tile.jsx] ✅ Image loaded:', chosenImage)}
              onError={(e) => {
                console.error('[Tile.jsx] ❌ Image failed:', chosenImage);
                e.currentTarget.src = `https://placehold.co/200x200/4B5563/FFFFFF?text=${encodeURIComponent(tile.type.toUpperCase())}`;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 z-10"></div>
          </div>
        )}

        {/* Fallback for non-text tiles with no image */}
        {!chosenImage && tile.type !== 'text' && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
            <span className="text-white/60 text-sm">No Image</span>
          </div>
        )}

        {/* ARTIST/SONG TILE */}
        {(tile.type === 'artist' || tile.type === 'song') && displayTitle && (
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-lg drop-shadow-lg leading-tight">
              {displayTitle}
            </h3>
          </div>
        )}

        {/* TEXT TILE */}
        {tile.type === 'text' && (
          <div className="relative z-10 p-4 h-full flex items-center justify-center">
            <div className="text-center text-white break-words whitespace-pre-wrap leading-relaxed">
              {displayContent || 'Click Edit to add text'}
            </div>
          </div>
        )}

        {/* PICTURE TILE */}
        {tile.type === 'picture' && !chosenImage && (
          <div className="relative z-10 h-full w-full flex items-center justify-center text-white bg-gray-600">
            <span>🖼️ Click Edit to add image</span>
          </div>
        )}

        {/* SPACER TILE */}
        {tile.type === 'spacer' && (
          <div className="h-full w-full bg-transparent flex items-center justify-center text-white/40">
            <span className="text-sm">Spacer</span>
          </div>
        )}

        {/* Edit & Delete buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditorOpen(true, id);
          }}
          className="absolute top-2 right-2 z-30 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Delete this tile?')) deleteTile(id);
          }}
          className="absolute top-2 left-2 z-30 bg-red-500/70 text-white px-2 py-1 rounded text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
