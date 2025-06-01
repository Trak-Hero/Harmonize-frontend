import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useProfileStore = create((set, get) => ({
  tiles: [],
  currentUserId: null,
  editorOpen: false,
  editingTileId: null,

  setCurrentUserId: (id) => set({ currentUserId: id }),

  setEditorOpen: (isOpen, id = null) =>
    set({ editorOpen: isOpen, editingTileId: id }),

  fetchTiles: async (userId, ownerId) => {
    try {
      const res = await fetch(`${API_BASE}/api/tiles?userId=${userId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      set({ tiles: data.tiles || [] });
    } catch (err) {
      console.error('[fetchTiles] failed:', err);
    }
  },

  addTempTile: (tileData) => {
    const tempId = `tmp_${Date.now()}`;
    set((s) => ({
      tiles: [
        ...s.tiles,
        {
          ...tileData,
          id: tempId,
        },
      ],
    }));
    return tempId;
  },

  addTile: async (tileData, tempId) => {
    try {
      const res = await fetch(`${API_BASE}/api/tiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(tileData),
      });
      const saved = await res.json();
      set((s) => ({
        tiles: s.tiles.map((t) =>
          t.id === tempId ? saved : t
        ),
      }));
    } catch (err) {
      console.error('[addTile] failed:', err);
    }
  },

  updateTile: async (id, tileData) => {
    try {
      const res = await fetch(`${API_BASE}/api/tiles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(tileData),
      });
      const updated = await res.json();
      set((s) => ({
        tiles: s.tiles.map((t) =>
          (t._id || t.id) === id ? updated : t
        ),
      }));
    } catch (err) {
      console.error('[updateTile] failed:', err);
    }
  },

  updateLayout: (layout) => {
    const updated = get().tiles.map((tile) => {
      const item = layout.find((l) => l.i === (tile._id || tile.id));
      return item ? { ...tile, ...item } : tile;
    });
    set({ tiles: updated });
  },

  deleteTile: async (id) => {
    try {
      await fetch(`${API_BASE}/api/tiles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
    } catch (err) {
      console.error('[deleteTile] failed:', err);
    }
    set((s) => ({
      tiles: s.tiles.filter((t) => (t._id || t.id) !== id),
    }));
  },
}));
