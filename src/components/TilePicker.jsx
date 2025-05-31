import { useState } from 'react';
import { useProfileStore } from '../state/profileStore';
import ArtistSearchModal from './ArtistSearchModal';

const TilePicker = ({ onAdd }) => {
  const addTileStore = useProfileStore((s) => s.addTile);
  const userId       = useProfileStore((s) => s.currentUserId);

  const [showArtistModal, setShowArtistModal] = useState(false);

  const add = (payload) => {
    if (onAdd) {
      onAdd(payload);
    } else {
      addTileStore(payload);
    }
  };

  const handleClick = (type) => {
    if (type === 'artist') {
      setShowArtistModal(true);
    } else {
      add({ type });
    }
  };

  const types = ['text', 'artist', 'song', 'picture', 'spacer'];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => handleClick(type)}
            className="flex items-center justify-center px-4 py-6 font-semibold text-white rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-shadow shadow-md"
          >
            + {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {showArtistModal && (
        <ArtistSearchModal
          userId={userId}
          onClose={() => setShowArtistModal(false)}
        />
      )}
    </>
  );
};

export default TilePicker;
