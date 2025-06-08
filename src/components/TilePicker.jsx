import { useState } from 'react';
import { useProfileStore } from '../state/profileStore';
import ArtistSearchModal from './ArtistSearchModal';
import SongSearchModal   from './SongSearchModal';

const TilePicker = ({ onAdd }) => {
  const addTileStore = useProfileStore((s) => s.addTile);
  const addTempTile = useProfileStore((s) => s.addTempTile);
  const setEditorOpen = useProfileStore((s) => s.setEditorOpen);
  const userId = useProfileStore((s) => s.currentUserId);

  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showSongModal,   setShowSongModal]   = useState(false);

  const add = (payload) => (onAdd ? onAdd(payload) : addTileStore(payload));

  const handleClick = async (type) => {
    if (type === 'artist') {
      setShowArtistModal(true);
    } else if (type === 'song') {
      setShowSongModal(true);
    } else if (type === 'text') {
      // Create text tile with default content and open editor immediately
      const tempId = addTempTile({ 
        type: 'text', 
        content: '',
        userId: userId 
      });
      setEditorOpen(true, tempId);
    } else if (type === 'picture') {
      // Create picture tile with empty bgImage and open editor immediately
      const tempId = addTempTile({ 
        type: 'picture', 
        bgImage: '',
        userId: userId 
      });
      setEditorOpen(true, tempId);
    } else {
      // For other types (spacer), create normally
      add({ type, userId: userId });
    }
  };

  const types = ['text', 'artist', 'song', 'picture', 'spacer'];

  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => handleClick(type)}
            className="flex items-center justify-center px-4 py-6 font-semibold text-white rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-shadow shadow-md whitespace-nowrap"
          >
            + {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {showArtistModal && (
        <ArtistSearchModal userId={userId} onClose={() => setShowArtistModal(false)} />
      )}
      {showSongModal && (
        <SongSearchModal userId={userId} onClose={() => setShowSongModal(false)} />
      )}
    </>
  );
};

export default TilePicker;