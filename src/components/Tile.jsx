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
    const deleteTile = useProfileStore((s) => s.deleteTile);

    const displayTitle = tile.title ?? tile.name ?? tile.content ?? '';
    const showTitle = !!displayTitle;
    const id = tile._id || tile.id;

    // Primary image source is bgImage (set by the modals)
    let chosenImage = '';
    
    if (tile.bgImage && tile.bgImage.trim() && tile.bgImage !== '/') {
      chosenImage = tile.bgImage.trim();
    }

    console.log('[Tile.jsx] Image logic for tile:', {
      type: tile.type,
      bgImage: tile.bgImage,
      chosenImage,
      hasImage: !!chosenImage
    });

    return (
      <div
        className="relative h-full w-full rounded-lg overflow-hidden border border-white/40 group"
        style={{
          backgroundColor: tile.bgColor ?? 'transparent',
          fontFamily: tile.font || 'sans-serif',
        }}
      >
        {/* Background image for all tiles that have one */}
        {chosenImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={chosenImage}
              alt={displayTitle || tile.type}
              crossOrigin="anonymous"
              onLoad={() => console.log('[Tile.jsx] image loaded successfully:', chosenImage)}
              onError={(e) => {
                console.warn('[Tile.jsx] Image failed to load:', chosenImage);
                console.warn('[Tile.jsx] Original tile data:', tile);
                e.currentTarget.src = `https://placehold.co/200x200?text=${tile.type}`;
              }}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30 z-10"></div>
          </div>
        )}

        {/* ARTIST TILE: overlay title over background image */}
        {tile.type === 'artist' && (
          <div className="absolute inset-0 flex items-end p-4 z-20">
            {showTitle && (
              <h3 className="text-xl font-bold text-white drop-shadow-lg">{displayTitle}</h3>
            )}
            {!chosenImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-white">
                <span>🎤 {displayTitle || 'Artist'}</span>
              </div>
            )}
          </div>
        )}

        {/* SONG TILE: overlay title over album cover */}
        {tile.type === 'song' && (
          <div className="absolute inset-0 flex items-end p-4 z-20">
            {showTitle && (
              <h3 className="text-xl font-bold text-white drop-shadow-lg">{displayTitle}</h3>
            )}
            {!chosenImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-white">
                <span>🎵 {displayTitle || 'Song'}</span>
              </div>
            )}
          </div>
        )}

        {/* TEXT TILE */}
        {tile.type === 'text' && (
          <div className="relative z-10 p-4 text-white break-words whitespace-pre-wrap h-full flex items-center justify-center">
            <div className="text-center drop-shadow-lg">
              {tile.content || 'Click Edit to add text'}
            </div>
          </div>
        )}

        {/* PICTURE TILE - no overlay, just the image */}
        {tile.type === 'picture' && (
          <>
            {!chosenImage && (
              <div className="relative z-10 h-full w-full flex items-center justify-center text-white bg-gray-600">
                <span>🖼️ Click Edit to add image</span>
              </div>
            )}
          </>
        )}

        {/* SPACER TILE */}
        {tile.type === 'spacer' && (
          <div className="h-full w-full bg-transparent flex items-center justify-center text-white/40">
            <span className="text-sm">Spacer</span>
          </div>
        )}

        {/* EDIT / DELETE BUTTONS */}
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