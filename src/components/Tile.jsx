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

    const displayTitle = tile.title ?? tile.name ?? tile.content ?? '';
    const showTitle    = !!displayTitle;
    const id = tile._id || tile.id;

    // ―――――――――――――――――――――――――――――――――――
    // FIXED: Better image selection logic for different tile types
    let chosenImage = '';
    
    // For artist/song tiles, check multiple possible image field names
    if (tile.type === 'artist' || tile.type === 'song') {
      chosenImage =
        tile.bgImage ||
        tile.image ||
        tile.albumCover ||
        tile.artistImage ||
        (tile.images?.[0]?.url ?? '') || // <-- Add this line
        '';
    }

    // If the chosenImage is literally "/" or empty, show placeholder instead
    const safeImageSrc =
      chosenImage && chosenImage !== '/' && chosenImage !== '' 
        ? chosenImage 
        : '/placeholder.jpg';
    
    console.log('[Tile.jsx] Image logic for tile:', {
      type: tile.type,
      bgImage: tile.bgImage,
      image: tile.image,
      albumCover: tile.albumCover,
      artistImage: tile.artistImage,
      chosenImage,
      safeImageSrc
    });
    // ―――――――――――――――――――――――――――――――――――

    return (
      <div
        className="relative h-full w-full rounded-lg overflow-hidden border border-white/40 group"
        style={{
          backgroundColor: tile.bgColor ?? 'transparent',
          fontFamily: tile.font || 'sans-serif',
        }}
      >
        {/* Background Image: now uses improved safeImageSrc logic */}
        {tile.type !== 'picture' && chosenImage && chosenImage !== '/' && (
          <img
            src={safeImageSrc}
            alt=""
            onError={(e) => { 
              console.warn('[Tile.jsx] Image failed to load:', safeImageSrc);
              e.target.src = '/placeholder.jpg'; 
            }}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}

        {/* ARTIST or SONG TILE: overlay the title on top of the background image */}
        {(tile.type === 'artist' || tile.type === 'song') && showTitle && (
          <div className="absolute inset-0 flex items-end p-4 bg-black/40 backdrop-blur-sm z-10">
            <h3 className="text-xl font-bold text-white">{displayTitle}</h3>
          </div>
        )}

        {/* TEXT TILE */}
        {tile.type === 'text' && (
          <div className="relative z-10 p-4 text-white break-words whitespace-pre-wrap h-full flex items-center justify-center">
            <div className="text-center">
              {tile.content || 'Click Edit to add text'}
            </div>
          </div>
        )}

        {/* PICTURE TILE */}
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

        {/* SPACER TILE */}
        {tile.type === 'spacer' && null}

        {/* EDIT / DELETE BUTTONS */}
        <button
          onClick={(e) => { e.stopPropagation(); setEditorOpen(true, id); }}
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