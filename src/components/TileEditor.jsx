import { useEffect, useState } from 'react';
import { useProfileStore } from '../state/profileStore';

const TileEditor = ({ tile = {} }) => {
  const addTile       = useProfileStore((s) => s.addTile);
  const updateTile    = useProfileStore((s) => s.updateTile);
  const setEditorOpen = useProfileStore((s) => s.setEditorOpen);

  const [content, setContent] = useState(tile.content ?? '');

  /* keep draft in sync if user switches tiles */
  useEffect(() => setContent(tile.content ?? ''), [tile]);

  const save = async () => {
    if (tile._id) {
      /* existing tile → PATCH */
      await updateTile(tile._id, { content });
    } else {
      /* new placeholder → POST, then replace */
      await addTile({ ...tile, content }, tile.id);
    }aimport { useEffect, useState } from 'react';
    import { useProfileStore } from '../state/profileStore';
    
    const TileEditor = () => {
      const { tiles, editingTileId, updateTile, setEditorOpen } = useProfileStore();
      const tile = tiles.find((t) => t._id === editingTileId || t.id === editingTileId);
      const [form, setForm] = useState({});
    
      useEffect(() => {
        if (tile) setForm(tile);
      }, [tile]);
    
      const handleSave = async () => {
        if (!tile) return;
        await updateTile(tile._id || tile.id, form);
        setEditorOpen(false);
      };
    
      const onChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
      if (!tile) return null;
    
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Tile</h2>
    
            {/* Title (for song/artist) */}
            {(tile.type === 'song' || tile.type === 'artist') && (
              <div className="mb-4">
                <label className="block font-semibold mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title || ''}
                  onChange={onChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}
    
            {/* Content (for text tile) */}
            {tile.type === 'text' && (
              <div className="mb-4">
                <label className="block font-semibold mb-1">Content</label>
                <textarea
                  name="content"
                  value={form.content || ''}
                  onChange={onChange}
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                />
              </div>
            )}
    
            {/* bgImage (for picture tile) */}
            {tile.type === 'picture' && (
              <div className="mb-4">
                <label className="block font-semibold mb-1">Image URL</label>
                <input
                  type="text"
                  name="bgImage"
                  value={form.bgImage || ''}
                  onChange={onChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
    
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditorOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    export default TileEditor;
    
    setEditorOpen(false);          // close modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-zinc-900 w-full max-w-md rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">Text tile</h2>

        <textarea
          autoFocus
          className="w-full h-40 p-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type something…"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setEditorOpen(false)}
            className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-400 font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileEditor;
