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
    const showTitle = !!displayTitle;
    const id = tile._id || tile.id;

    // Check for bgImage
    let chosenImage = '';
    if (tile.bgImage && tile.bgImage.trim() && tile.bgImage !== '/') {
      chosenImage = tile.bgImage.trim();
    }

    console.log('[Tile.jsx] Image analysis:', {
      type: tile.type,
      title: displayTitle,
      bgImage: tile.bgImage,
      chosenImage,
      hasValidImage: !!chosenImage,
      imageLength: tile.bgImage?.length || 0
    });

    return (
      <div
        className="relative h-full w-full rounded-lg overflow-hidden border border-white/40 group"
        style={{
          backgroundColor: tile.bgColor ?? '#374151', // Default gray background
          fontFamily: tile.font || 'sans-serif',
        }}
      >
        {/* Background image for all tiles that have one */}
        {chosenImage ? (
          <div className="absolute inset-0 z-0">
            <img
              src={chosenImage}
              alt={displayTitle || tile.type}
              crossOrigin="anonymous"
              onLoad={() => console.log('[Tile.jsx] ✅ Image loaded successfully:', chosenImage)}
              onError={(e) => {
                console.error('[Tile.jsx] ❌ Image failed to load:', chosenImage);
                console.error('[Tile.jsx] Tile data:', tile);
                e.currentTarget.src = `https://placehold.co/200x200/4B5563/FFFFFF?text=${encodeURIComponent(tile.type.toUpperCase())}`;
              }}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
            <span className="text-white/60 text-sm">No Image</span>
          </div>
        )}

        {/* Content overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
          {/* Title at bottom */}
          {showTitle && (
            <div className="mt-auto">
              <h3 className="text-white font-bold text-lg drop-shadow-lg leading-tight">
                {displayTitle}
              </h3>
            </div>
          )}
          
          {/* Type indicator if no title */}
          {!showTitle && (
            <div className="flex items-center justify-center h-full">
              <span className="text-white/80 text-lg capitalize">{tile.type}</span>
            </div>
          )}
        </div>

        {/* Edit/Delete buttons */}
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