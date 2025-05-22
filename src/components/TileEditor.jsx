import { useEffect, useState } from 'react';
import { useProfileStore } from '../state/profileStore';

const TileEditor = ({ tile }) => {
  const updateTile = useProfileStore((s) => s.updateTile);
  const removeTile = useProfileStore((s) => s.removeTile);
  const setEditorOpen = useProfileStore((s) => s.setEditorOpen);

  const [form, setForm] = useState({ ...tile });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsed = ['w', 'h'].includes(name) ? parseInt(value) : value;
    setForm({ ...form, [name]: parsed });
  };

  const close = () => setEditorOpen(false);

  const save = () => {
    updateTile(tile.id, form);
    close();
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white text-black rounded-lg p-6 w-[90%] max-w-md space-y-4">
        <h2 className="text-xl font-bold">Edit Tile</h2>

        {tile.type === 'text' && (
          <input
            type="text"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Text"
            className="w-full border p-2 rounded"
          />
        )}

        {tile.type === 'artist' && (
          <>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Artist Name"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full border p-2 rounded"
            />
          </>
        )}

        <input
          type="color"
          name="bgColor"
          value={form.bgColor}
          onChange={handleChange}
          className="w-full"
        />

        <input
          type="text"
          name="bgImage"
          value={form.bgImage || ''}
          onChange={handleChange}
          placeholder="Background Image URL"
          className="w-full border p-2 rounded"
        />

        <select
          name="font"
          value={form.font}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="sans-serif">Sans-serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>

        {/* 📐 Predefined Size Controls */}
        <div className="flex gap-2">
          <select
            name="w"
            value={form.w}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={1}>Width: 1</option>
            <option value={2}>Width: 2</option>
            <option value={4}>Width: 4</option>
          </select>

          <select
            name="h"
            value={form.h}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value={1}>Height: 1</option>
            <option value={2}>Height: 2</option>
          </select>
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={save} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          <button onClick={close} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button
            onClick={() => {
              removeTile(tile.id);
              close();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileEditor;
