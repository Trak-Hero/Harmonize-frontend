import { useProfileStore } from '../state/profileStore';

const Tile = ({ tile }) => {
  const setEditorOpen = useProfileStore((s) => s.setEditorOpen);

  const style = {
    backgroundColor: tile.bgColor || '#1e1e1e',
    backgroundImage: tile.bgImage ? `url(${tile.bgImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: tile.font || 'sans-serif',
  };

  return (
    <div
      className="rounded-xl p-4 text-white shadow-md cursor-pointer hover:scale-[1.02] transition"
      style={style}
      onClick={() => setEditorOpen(true, tile.id)}
    >
      {tile.type === 'text' && (
        <p className="text-lg">{tile.content || 'Click to edit text'}</p>
      )}
      {tile.type === 'artist' && (
        <div className="text-center">
          <img
            src={tile.image || '/placeholder.jpg'}
            alt={tile.name || 'Artist'}
            className="rounded-full w-16 h-16 mx-auto mb-2 object-cover"
          />
          <h2 className="font-bold text-md">{tile.name || 'Artist Name'}</h2>
        </div>
      )}
      {tile.type === 'picture' && tile.bgImage && (
        <div className="h-32 w-full rounded overflow-hidden" />
      )}
    </div>
  );
};

export default Tile;