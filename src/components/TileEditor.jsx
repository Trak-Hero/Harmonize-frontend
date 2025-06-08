import { useEffect, useState } from 'react';
import { useProfileStore } from '../state/profileStore';

const fonts = [
  { label: 'Default (sans-serif)', value: '' },
  { label: 'Serif',         value: 'serif' },
  { label: 'Monospace',     value: 'monospace' },
  { label: 'Cursive',       value: 'cursive' },
  { label: 'Fantasy',       value: 'fantasy' },
];

const sizes = [1, 2, 3, 4];        

export default function TileEditor() {
  const { tiles, editingTileId, updateTile, setEditorOpen } = useProfileStore();
  const tile = tiles.find((t) => (t._id || t.id) === editingTileId);
  const [form, setForm] = useState({});


  useEffect(() => {
    if (tile) setForm(tile);
  }, [tile]);

  if (!tile) return null;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: ['w', 'h'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    const id = tile._id || tile.id;

    if (String(id).startsWith('tmp_')) {
      const { addTile } = useProfileStore.getState();
      await addTile(form, id);
    } else {
      await updateTile(id, form);
    }
    setEditorOpen(false);
  };

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">Edit Tile</h2>
        {(tile.type === 'artist' || tile.type === 'song') && (
          <TextField
            label="Title"
            name="title"
            value={form.title || ''}
            onChange={onChange}
          />
        )}

        {tile.type === 'text' && (
          <TextareaField
            label="Content"
            name="content"
            value={form.content || ''}
            onChange={onChange}
          />
        )}

{(tile.type === 'picture' || tile.type === 'artist' || tile.type === 'song') && (
  <>
    <TextField
      label={tile.type === 'picture' ? "Image URL" : "Background Image URL (optional)"}
      name="bgImage"
      value={form.bgImage || ''}
      onChange={onChange}
      placeholder="https://example.com/image.jpg"
    />

    {form.bgImage && (
      <img
        src={form.bgImage}
        alt="preview"
        className="h-32 w-full rounded object-cover"
        onError={(e) => (e.currentTarget.style.display = 'none')}
      />
    )}
  </>
)}


        <ColorField
          label="Background colour"
          name="bgColor"
          value={form.bgColor || '#000000'}
          onChange={onChange}
        />

        <SelectField
          label="Font family"
          name="font"
          value={form.font || ''}
          onChange={onChange}
          options={fonts}
        />

        <div className="flex gap-4">
          <SelectField
            label="Width (w)"
            name="w"
            value={form.w ?? 1}
            onChange={onChange}
            options={sizes.map((s) => ({ label: s, value: s }))}
          />
          <SelectField
            label="Height (h)"
            name="h"
            value={form.h ?? 1}
            onChange={onChange}
            options={sizes.map((s) => ({ label: s, value: s }))}
          />
        </div>

        <div className="pt-4 flex justify-end gap-2">
          <button
            onClick={() => setEditorOpen(false)}
            className="rounded bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const TextField = ({ label, ...props }) => (
  <div>
    <label className="mb-1 block text-white">{label}</label>
    <input
      {...props}
      className="w-full rounded bg-zinc-800 p-2 text-white"
    />
  </div>
);

const TextareaField = ({ label, ...props }) => (
  <div>
    <label className="mb-1 block text-white">{label}</label>
    <textarea
      {...props}
      rows={4}
      className="w-full rounded bg-zinc-800 p-2 text-white"
    />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div className="w-full">
    <label className="mb-1 block text-white">{label}</label>
    <select
      {...props}
      className="w-full rounded bg-zinc-800 p-2 text-white"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const ColorField = (props) => (
  <div>
    <label className="mb-1 block text-white">{props.label}</label>
    <input
      type="color"
      {...props}
      className="h-10 w-full rounded bg-zinc-800 p-1"
    />
  </div>
);
