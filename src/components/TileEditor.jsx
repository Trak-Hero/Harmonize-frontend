import { useEffect, useState } from 'react';
import { useProfileStore } from '../state/profileStore';

/**
 * Simple editor for a “text” tile.
 * Extend later for artist / song / picture types.
 */
const TileEditor = ({ tile = {} }) => {
  const updateTile    = useProfileStore((s) => s.updateTile);
  const setEditorOpen = useProfileStore((s) => s.setEditorOpen);

  const [content, setContent] = useState(tile.content ?? '');

  /* keep local form in sync when a different tile is selected */
  useEffect(() => setContent(tile.content ?? ''), [tile]);

  const save = async () => {
    if (tile._id) {
      await updateTile(tile._id, { content });
    }
    setEditorOpen(false);          // close modal either way
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-zinc-900 w-full max-w-md rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold">Edit text tile</h2>

        <textarea
          autoFocus
          className="w-full h-40 p-3 rounded bg-zinc-800 border border-zinc-700 focus:outline-none resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
