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
    await updateTile(tile._id || tile.id, form);
    setEditorOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-zinc-900 w-full max-w-md rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">Edit Tile</h2>

        {/* Title for artist / song */}
        {(tile.type === 'artist' || tile.type === 'song') && (
          <div>
            <label className="block mb-1">Title</label>
            <input
              name="title"
              value={form.title || ''}
              onChange={onChange}
              className="w-full rounded bg-zinc-800 p-2"
            />
          </div>
        )}

        {/* Content for text */}
        {tile.type === 'text' && (
          <div>
            <label className="block mb-1">Content</label>
            <textarea
              name="content"
              rows={4}
              value={form.content || ''}
              onChange={onChange}
              className="w-full rounded bg-zinc-800 p-2"
            />
          </div>
        )}

        {/* Image URL for picture */}
        {tile.type === 'picture' && (
          <div>
            <label className="block mb-1">Image URL</label>
            <input
              name="bgImage"
              value={form.bgImage || ''}
              onChange={onChange}
              className="w-full rounded bg-zinc-800 p-2"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={() => setEditorOpen(false)}
            className="px-4 py-2 bg-zinc-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 rounded text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileEditor;
