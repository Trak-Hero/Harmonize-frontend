import { useEffect, useState } from 'react';
import { useProfileStore } from '../state/profileStore';

const TileEditor = () => {
  const { tiles, editingTileId, updateTile, setEditorOpen } = useProfileStore();
  const tile = tiles.find((t) => (t._id || t.id) === editingTileId);

  const [form, setForm] = useState({});

  useEffect(() => {
    if (tile) setForm(tile);
  }, [tile]);

  if (!tile) return null;

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    const tileId = tile._id || tile.id;
    
    // If this is a temporary tile (starts with 'tmp_'), create a new tile
    if (typeof tileId === 'string' && tileId.startsWith('tmp_')) {
      const { addTile } = useProfileStore.getState();
      await addTile(form, tileId); // Pass tempId to replace the temporary tile
    } else {
      // Otherwise, update existing tile
      await updateTile(tileId, form);
    }
    
    setEditorOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-zinc-900 w-full max-w-md rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Edit Tile</h2>

        {/* Title for artist / song */}
        {(tile.type === 'artist' || tile.type === 'song') && (
          <div>
            <label className="block mb-1 text-white">Title</label>
            <input
              name="title"
              value={form.title || ''}
              onChange={onChange}
              className="w-full rounded bg-zinc-800 p-2 text-white"
              placeholder="Enter title..."
            />
          </div>
        )}

        {/* Content for text */}
        {tile.type === 'text' && (
          <div>
            <label className="block mb-1 text-white">Content</label>
            <textarea
              name="content"
              rows={4}
              value={form.content || ''}
              onChange={onChange}
              className="w-full rounded bg-zinc-800 p-2 text-white"
              placeholder="Enter your text..."
            />
          </div>
        )}

        {/* Image URL for picture */}
        {tile.type === 'picture' && (
          <div>
            <label className="block mb-1 text-white">Image URL</label>
            <input
              name="bgImage"
              value={form.bgImage || ''}
              onChange={onChange}
              className="w-full rounded bg-zinc-800 p-2 text-white"
              placeholder="https://example.com/photo.jpg"
            />
            {form.bgImage && (
              <div className="mt-2">
                <img
                  src={form.bgImage}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Background Color for all tiles */}
        <div>
          <label className="block mb-1 text-white">Background Color</label>
          <input
            name="bgColor"
            type="color"
            value={form.bgColor || '#000000'}
            onChange={onChange}
            className="w-full h-10 rounded bg-zinc-800 p-1"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={() => setEditorOpen(false)}
            className="px-4 py-2 bg-zinc-700 rounded text-white hover:bg-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileEditor;