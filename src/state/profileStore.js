import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export const useProfileStore = create((set, get) => ({
  tiles: [],
  editorOpen: false,
  editingTileId: null,

  currentUserId: null,
  isOwner: false,

  setEditorOpen: (isOpen, tileId = null) => {
    set({ editorOpen: isOpen, editingTileId: tileId });
  },

  fetchTiles: async (userId, currentUserId) => {
    try {
      const res = await fetch(`${API_BASE}/tiles/${userId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to fetch tiles: ${res.status}`);
      const data = await res.json();
      set({
        tiles: data.map((tile) => ({ ...tile, id: tile._id })),
        currentUserId,
        isOwner: userId === currentUserId,
      });
    } catch (err) {
      console.error('Failed to load tiles:', err);
    }
  },

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

      const res = await fetch(`${API_BASE}/tiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newTile),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(`Tile add failed: ${res.status} – ${error}`);
      }

      const savedTile = await res.json();
      set((state) => ({
        tiles: [...state.tiles, { ...savedTile, id: savedTile._id }],
      }));
    } catch (err) {
      console.error('Tile add failed:', err);
    }
  },

  updateTile: async (id, updates) => {
    try {
      const res = await fetch(`${API_BASE}/tiles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error(`Tile update failed: ${res.status}`);

      const updatedTile = await res.json();
      set((state) => ({
        tiles: state.tiles.map((tile) =>
          tile.id === id ? { ...updatedTile, id: updatedTile._id } : tile
        ),
      }));
    } catch (err) {
      console.error('Tile update failed:', err);
    }
  },

  updateLayout: async (layout) => {
    try {
      const updates = layout.map(({ i, x, y, w, h }) =>
        get().updateTile(i, { x, y, w, h })
      );
      await Promise.all(updates);
    } catch (err) {
      console.error('Layout update failed:', err);
    }
  },

  removeTile: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tiles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      set((state) => ({
        tiles: state.tiles.filter((tile) => tile.id !== id),
      }));
    } catch (err) {
      console.error('Tile delete failed:', err);
    }
  },
}));
