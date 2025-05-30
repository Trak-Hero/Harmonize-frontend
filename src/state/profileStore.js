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
        tiles: data.map(tile => ({ ...tile, id: tile._id })),
        currentUserId,
        isOwner: userId === currentUserId,
      });
    } catch (err) {
      console.error('Failed to load tiles:', err);
    }
  },

  addTile: async (tile) => {
    try {
      const userId = get().currentUserId;
      if (!userId) throw new Error('No user ID set in profileStore');

      const defaultTile = {
        userId,
        type: tile?.type || 'text',
        content: '',
        bgColor: '#1e1e1e',
        font: 'sans-serif',
        x: 0,
        y: Infinity,
        w: 2,
        h: 2,
        ...tile,
      };

      const res = await fetch(`${API_BASE}/tiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(defaultTile),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to add tile: ${res.status} ${text}`);
      }

      const savedTile = await res.json();
      const normalizedTile = { ...savedTile, id: savedTile._id };

      set((state) => ({
        tiles: [...state.tiles, normalizedTile],
        editorOpen: true,
        editingTileId: normalizedTile.id,
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
      const normalizedTile = { ...updatedTile, id: updatedTile._id };

      set((state) => ({
        tiles: state.tiles.map(tile =>
          tile.id === id ? normalizedTile : tile
        ),
      }));
    } catch (err) {
      console.error('Tile update failed:', err);
    }
  },

  updateLayout: async (layout) => {
    const updates = layout.map(({ i, x, y, w, h }) =>
      get().updateTile(i, { x, y, w, h })
    );
    await Promise.all(updates);
  },

  removeTile: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tiles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);

      set((state) => ({
        tiles: state.tiles.filter(tile => tile.id !== id),
      }));
    } catch (err) {
      console.error('Tile delete failed:', err);
    }
  },
}));
