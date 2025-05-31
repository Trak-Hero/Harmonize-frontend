import { useState } from 'react';
import { useProfileStore } from '../state/profileStore';

export default function PictureLinkModal({ userId, onClose }) {
  const addTile = useProfileStore((s) => s.addTile);
  const [url, setUrl] = useState('');

  const save = async () => {
    if (!url.trim()) return;
    await addTile({
      userId,
      type: 'picture',
      bgImage: url.trim(),
      x: 0, y: Infinity, w: 2, h: 2,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-zinc-900 w-full max-w-md rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Add Image URL</h2>
        <input
          className="w-full px-4 py-2 rounded bg-zinc-800 text-white"
          placeholder="https://example.com/photo.jpg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-zinc-700 rounded text-white">Cancel</button>
          <button onClick={save}   className="px-4 py-2 bg-blue-500 rounded text-white">Save</button>
        </div>
      </div>
    </div>
  );
}
