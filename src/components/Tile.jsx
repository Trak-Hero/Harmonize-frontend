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

    // Simplified image logic - prioritize bgImage since that's what we're setting in the modals
    let chosenImage = '';
    
    if (tile.bgImage && tile.bgImage.trim() && tile.bgImage !== '/') {
      chosenImage = tile.bgImage.trim();
    } else if (tile.albumCover && tile.albumCover.trim() && tile.albumCover !== '/') {
      chosenImage = tile.albumCover.trim();
    } else if (tile.artistImage && tile.artistImage.trim() && tile.artistImage !== '/') {
      chosenImage = tile.artistImage.trim();
    } else if (tile.image && tile.image.trim() && tile.image !== '/') {
      chosenImage = tile.image.trim();
    }

    const safeImageSrc = chosenImage || '/placeholder.jpg';

    console.log('[Tile.jsx] Image logic for tile:', {
      type: tile.type,
      bgImage: tile.bgImage,
      albumCover: tile.albumCover,
      artistImage: tile.artistImage,
      image: tile.image,
      chosenImage,
      safeImageSrc
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
              src={safeImageSrc}
              alt=""
              crossOrigin="anonymous"
              onLoad={() => console.log('[Tile.jsx] image loaded successfully:', safeImageSrc)}
              onError={(e) => {
                console.warn('[Tile.jsx] Image failed to load:', safeImageSrc);
                console.warn('[Tile.jsx] Original tile data:', tile);
                e.currentTarget.src = '/placeholder.jpg';
              }}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ARTIST TILE: overlay title over background image */}
        {tile.type === 'artist' && showTitle && (
          <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10">
            <h3 className="text-xl font-bold text-white drop-shadow-lg">{displayTitle}</h3>
          </div>
        )}

        {/* SONG TILE: overlay title over album cover */}
        {tile.type === 'song' && showTitle && (
          <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10">
            <h3 className="text-xl font-bold text-white drop-shadow-lg">{displayTitle}</h3>
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
        {tile.type === 'picture' && !chosenImage && (
          <div className="relative z-10 h-full w-full flex items-center justify-center text-white bg-gray-600">
            <span>Click Edit to add image</span>
          </div>
        )}

        {/* SPACER TILE */}
        {tile.type === 'spacer' && (
          <div className="h-full w-full bg-transparent"></div>
        )}

        {/* EDIT / DELETE BUTTONS */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditorOpen(true, id);
          }}
          className="absolute top-2 right-2 z-20 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Edit
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Delete this tile?')) deleteTile(id);
          }}
          className="absolute top-2 left-2 z-20 bg-red-500/70 text-white px-2 py-1 rounded text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
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