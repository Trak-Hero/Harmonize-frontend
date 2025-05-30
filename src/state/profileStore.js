import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useProfileStore = create(
  persist(
    (set, get) => ({
      /* ──────────── STATE ──────────── */
      tiles: [],
      currentUserId: null,
      editorOpen: false,
      editingTileId: null,

      /* ──────────── MUTATORS ──────────── */
      setCurrentUserId: (id) => set({ currentUserId: id }),

      setEditorOpen: (open, tileId = null) =>
        set({ editorOpen: open, editingTileId: tileId }),

      /* ──────────── SERVER ACTIONS ──────────── */
      fetchTiles: async (profileUserId, viewerId) => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/users/${profileUserId}/tiles`,
            { params: { viewerId }, withCredentials: true }
          );
          set({ tiles: res.data, currentUserId: profileUserId });
        } catch (err) {
          console.error('Failed to fetch tiles:', err);
        }
      },

      addTile: async (tileData) => {
        // Prefer an explicit userId from the caller; otherwise fall back to the one cached
        const userId = tileData.userId || get().currentUserId;
        if (!userId) {
          console.error('Tile add failed: No user ID set in profileStore');
          console.log('Current state:', get());
          return;
        }
        
        try {
          console.log('Adding tile with userId:', userId, 'tileData:', tileData);
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/tiles`,
            { ...tileData, userId },
            { withCredentials: true }
          );
          set((state) => ({ tiles: [...state.tiles, res.data] }));
        } catch (err) {
          console.error('Failed to add tile:', err);
        }
      },

      updateTile: async (id, updates) => {
        try {
          const res = await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/api/tiles/${id}`,
            updates,
            { withCredentials: true }
          );
          set((state) => ({
            tiles: state.tiles.map((tile) =>
              tile._id === id ? res.data : tile
            ),
          }));
        } catch (err) {
          console.error('Failed to update tile:', err);
        }
      },

      deleteTile: async (id) => {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/tiles/${id}`,
            { withCredentials: true }
          );
          set((state) => ({
            tiles: state.tiles.filter((tile) => tile._id !== id),
          }));
        } catch (err) {
          console.error('Failed to delete tile:', err);
        }
      },

      // FIXED: Changed to match backend route - use PATCH and /bulk-layout
      updateLayout: async (layout) => {
        const updates = layout.map(({ i, x, y, w, h }) => ({
          id: i,
          x,
          y,
          w,
          h,
        }));
        try {
          await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/api/tiles/bulk-layout`,
            { updates },
            { withCredentials: true }
          );
          set((state) => ({
            tiles: state.tiles.map((tile) => {
              const match = updates.find((u) => u.id === (tile._id || tile.id));
              return match ? { ...tile, ...match } : tile;
            }),
          }));
        } catch (err) {
          console.error('Failed to update layout:', err);
        }
      },
    }),
    {
      name: 'profile-store',
      partialize: (state) => ({ currentUserId: state.currentUserId }),
    }
  )
);