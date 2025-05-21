import { useProfileStore } from '../state/profileStore';

const TilePicker = () => {
  const addTile = useProfileStore((s) => s.addTile);

  const types = ['text', 'artist', 'song', 'picture', 'spacer'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => addTile({ type })}
          className="flex items-center justify-center px-4 py-6 font-semibold text-white rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-shadow shadow-md"
        >
          + {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default TilePicker;
