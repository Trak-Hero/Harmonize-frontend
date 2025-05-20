import { useProfileStore } from '../state/profileStore';

const TilePicker = () => {
  const addTile = useProfileStore((state) => state.addTile);

  const tileTypes = [
    { type: 'artist', label: 'Artist' },
    { type: 'song', label: 'Song' },
    { type: 'text', label: 'Text' },
    { type: 'picture', label: 'Picture' },
    { type: 'spacer', label: 'Spacer' },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {tileTypes.map((t) => (
        <button
          key={t.type}
          className="bg-neutral-800 p-3 rounded text-white"
          onClick={() =>
            addTile({
              type: t.type,
              bgColor: '#222',
              content: t.type === 'text' ? 'New Text' : '',
            })
          }
        >
          ➕ {t.label}
        </button>
      ))}
    </div>
  );
};

export default TilePicker;
