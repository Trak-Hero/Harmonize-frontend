// src/state/profileStore.js
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
      /**
       * Fetch all tiles that belong to `profileUserId`.
       * `viewerId` is passed so the backend can decide what is public.
       */
      addTempTile: (tileData) => {
              const tempId = `tmp_${Date.now()}`;       // simple unique id
              const newTile = { id: tempId, ...tileData };
              set((state) => ({ tiles: [...state.tiles, newTile] }));
              return tempId;                            // return so caller can open editor
            },
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

      /**
       * Create a new tile that belongs to the *current* profile.
       * Falls back to the cached currentUserId if caller does not pass one.
       */
      addTile: async (tileData, tempId = null) => {
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
          set((state) => ({
                      tiles: tempId
                        ? state.tiles.map((t) => (t.id === tempId ? res.data : t)) // replace placeholder
                        : [...state.tiles, res.data],                              // normal create
                    }));
        } catch (err) {
          console.error('Failed to add tile:', err);
        }
      },

      /** Update a single tile */
      updateTile: async (id, updates) => {
        try {
          const res = await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/api/tiles/${id}`,
            updates,
            { withCredentials: true }
          );
          set((state) => ({
            tiles: state.tiles.map((tile) => (tile._id === id ? res.data : tile)),
          }));
        } catch (err) {
          console.error('Failed to update tile:', err);
        }
      },

      /** Delete a tile */
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

      /**
       * Persist new x/y/w/h for a *bunch* of tiles after a layout drag.
       * We only send valid ObjectIds to the backend.
       */
      updateLayout: async (layout) => {
        const state = get();
        const updates = layout
          .map(({ i, x, y, w, h }) => {
            const tile = state.tiles.find((t) => (t._id || t.id) === i);
            if (!tile) {
              console.warn(`Tile not found for layout item: ${i}`);
              return null;
            }
            return { _id: tile._id, x, y, w, h }; 
          })
          .filter(Boolean);

        if (updates.length === 0) {
          console.warn('No valid tiles found for layout update');
          return;
        }

        try {
          await axios.patch(
            `${import.meta.env.VITE_API_BASE_URL}/api/tiles/bulk-layout`,
            { updates },
            { withCredentials: true }
          );
          set((state) => ({
            tiles: state.tiles.map((tile) => {
              const match = updates.find((u) => u.id === (tile._id || tile.id));
              return match
                ? { ...tile, x: match.x, y: match.y, w: match.w, h: match.h }
                : tile;
            }),
          }));
        } catch (err) {
          console.error('Failed to update layout:', err);
        }
      },
    }),
    {
      name: 'profile-store',
      // Only persist the user the profile page is currently showing, nothing more
      partialize: (state) => ({ currentUserId: state.currentUserId }),
    }
  )
);
