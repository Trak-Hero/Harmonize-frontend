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
    // IMPROVED: Better image selection logic for different tile types
    let chosenImage = '';
    
    // For artist tiles - check multiple possible image sources
    if (tile.type === 'artist') {
      chosenImage = tile.bgImage || tile.image || tile.artistImage || tile.images?.[0]?.url || '';
      console.log('[Tile.jsx] Artist tile image sources:', {
        bgImage: tile.bgImage,
        image: tile.image,
        artistImage: tile.artistImage,
        imagesArray: tile.images,
        chosen: chosenImage
      });
    } 
    // For song tiles - check album cover and other sources
    else if (tile.type === 'song') {
      chosenImage = tile.bgImage || tile.image || tile.albumCover || tile.album?.images?.[0]?.url || '';
      console.log('[Tile.jsx] Song tile image sources:', {
        bgImage: tile.bgImage,
        image: tile.image,
        albumCover: tile.albumCover,
        albumImages: tile.album?.images,
        chosen: chosenImage
      });
    } 
    // For other tiles, prefer bgImage first
    else {
      chosenImage = tile.bgImage || tile.image || '';
    }

    // If the chosenImage is literally "/" or empty, show placeholder instead
    const safeImageSrc =
      chosenImage && chosenImage !== '/' && chosenImage !== '' 
        ? chosenImage 
        : '/placeholder.jpg';
    
    console.log('[Tile.jsx] Final image logic for tile:', {
      type: tile.type,
      title: displayTitle,
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
            alt={displayTitle || 'Tile background'}
            onError={(e) => { 
              console.warn('[Tile.jsx] Image failed to load:', safeImageSrc);
              e.target.src = '/placeholder.jpg'; 
            }}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        )}

        {/* ARTIST or SONG TILE: overlay the title on top of the background image */}
        {(tile.type === 'artist' || tile.type === 'song') && showTitle && (
          <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10">
            <div className="text-white">
              <h3 className="text-xl font-bold text-white drop-shadow-lg">{displayTitle}</h3>
              {/* Show additional info if available */}
              {tile.type === 'song' && tile.artist && (
                <p className="text-sm text-white/80 mt-1">by {tile.artist}</p>
              )}
              {tile.type === 'artist' && tile.genres && tile.genres.length > 0 && (
                <p className="text-sm text-white/80 mt-1">{tile.genres.slice(0, 2).join(', ')}</p>
              )}
            </div>
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
                alt="User uploaded content"
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

        {/* EDIT / DELETE BUTTONS - Only show on hover */}
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); setEditorOpen(true, id); }}
            className="bg-black/70 text-white px-2 py-1 rounded text-xs hover:bg-black/90 mr-1"
          >
            Edit
          </button>
        </div>

        <div className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Delete this tile?')) deleteTile(id);
            }}
            className="bg-red-500/70 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
          >
            Delete
          </button>
        </div>

        {/* Fallback overlay for tiles without images */}
        {(tile.type === 'artist' || tile.type === 'song') && (!chosenImage || chosenImage === '/') && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 z-5">
            <div className="text-center text-white p-4">
              <div className="text-4xl mb-2">
                {tile.type === 'artist' ? '🎤' : '🎵'}
              </div>
              <h3 className="text-lg font-bold">{displayTitle}</h3>
              {tile.type === 'song' && tile.artist && (
                <p className="text-sm opacity-80">by {tile.artist}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error('[Tile.jsx] Error rendering tile:', tile, err);
    return <div className="text-red-500 p-4">Failed to load tile</div>;
  }
};

export default Tile;