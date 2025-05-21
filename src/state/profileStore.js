import { create } from 'zustand';

export const useProfileStore = create((set, get) => ({
  tiles: [],
  editorOpen: false,
  editingTileId: null,

  // Auth-aware
  currentUserId: null,
  isOwner: false,

  setEditorOpen: (isOpen, tileId = null) => {
    set({ editorOpen: isOpen, editingTileId: tileId });
  },

  // 🔄 Fetch tiles from backend
  fetchTiles: async (userId, currentUserId) => {
    try {
      const res = await fetch(`/tiles/${userId}`);
      const data = await res.json();
      set({
        tiles: data,
        currentUserId,
        isOwner: userId === currentUserId,
      });
    } catch (err) {
      console.error('Failed to load tiles', err);
    }
  },

  // ➕ Add new tile
  addTile: async (tile) => {
    try {
      const newTile = {
        userId: get().currentUserId,
        type: tile.type || 'text',
        bgColor: '#1e1e1e',
        font: 'sans-serif',
        x: 0,
        y: Infinity,
        w: 1,
        h: 1,
        ...tile,
      };
      const res = await fetch('/tiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTile),
      });
      const savedTile = await res.json();
      set({ tiles: [...get().tiles, savedTile] });
    } catch (err) {
      console.error('Tile add failed', err);
    }
  },

  // ✏️ Update tile (e.g., from editor or resize)
  updateTile: async (id, updates) => {
    try {
      const res = await fetch(`/tiles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      const tiles = get().tiles.map((t) => (t._id === id ? updated : t));
      set({ tiles });
    } catch (err) {
      console.error('Tile update failed', err);
    }
  },

  // 🔁 Update layout (drag or resize)
  updateLayout: async (layout) => {
    const updates = layout.map(({ i, x, y, w, h }) =>
      get().updateTile(i, { x, y, w, h })
    );
    await Promise.all(updates);
  },

  // ❌ Delete tile
  removeTile: async (id) => {
    try {
      await fetch(`/tiles/${id}`, { method: 'DELETE' });
      const tiles = get().tiles.filter((t) => t._id !== id);
      set({ tiles });
    } catch (err) {
      console.error('Tile delete failed', err);
    }
  },
}));
