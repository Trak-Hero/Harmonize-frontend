import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

axios.defaults.withCredentials = true;

export const useProfileStore = create(
  persist(
    (set, get) => ({
      tiles: [],
      currentUserId: null,
      editorOpen: false,
      editingTileId: null,
      isLoading: false,

      setCurrentUserId: (id) => {
        console.log('[profileStore] Setting current user ID:', id);
        set({ currentUserId: id });
      },

      setEditorOpen: (open, tileId = null) => {
        console.log('[profileStore] Setting editor open:', open, 'tileId:', tileId);
        set({ editorOpen: open, editingTileId: tileId });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      addTempTile: (tileData) => {
        const tempId = `tmp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTile = { 
          id: tempId, 
          ...tileData,
          x: tileData.x || 0,
          y: tileData.y || Infinity, 
          w: tileData.w || 1,
          h: tileData.h || 1,
        };
        
        console.log('[profileStore] Adding temp tile:', newTile);
        set((state) => ({ tiles: [...state.tiles, newTile] }));
        return tempId;
      },

      fetchTiles: async (profileUserId, viewerId) => {
        if (!profileUserId) {
          console.warn('[profileStore] fetchTiles called without profileUserId');
          return;
        }
      
        set({ isLoading: true });
      
        try {
          console.log('[profileStore] Fetching tiles (using /api/tiles/:userId) for user:', profileUserId);
      
          const res = await axios.get(`${API_BASE}/api/tiles/${profileUserId}`, {
            timeout: 10000,
          });
      
          console.log('[profileStore] Fetched tiles:', res.data);
          set({ 
            tiles: res.data || [], 
            currentUserId: profileUserId,
            isLoading: false 
          });
        } catch (err) {
          console.error('[profileStore] Failed to fetch tiles (only attempted valid endpoint):', err);
          set({ tiles: [], isLoading: false });
        }
      },
      


      addTile: async (tileData, tempId = null) => {
        console.log('[profileStore] addTile called with:', { tileData, tempId });
        
        const userId = tileData.userId || get().currentUserId;
        
        if (!userId) {
          console.error('[profileStore] Tile add failed: No user ID available');
          console.log('[profileStore] Current state:', get());
          throw new Error('No user ID available for tile creation');
        }
      
        try {
          console.log('[profileStore] Adding tile with userId:', userId, 'tileData:', tileData);
          console.log('[profileStore] Temp ID to replace:', tempId);
          
          const payload = {
            ...tileData,
            userId,
            x: Number(tileData.x) || 0,
            y: Number(tileData.y) || 0,
            w: Number(tileData.w) || 1,
            h: Number(tileData.h) || 1,
          };
          
          console.log('[profileStore] Final payload being sent to server:', payload);
          
          const res = await axios.post(`${API_BASE}/api/tiles`, payload);
          console.log('[profileStore] Server response:', res.data);
          
          set((state) => ({
            tiles: tempId
              ? state.tiles.map((t) => (t.id === tempId ? res.data : t))
              : [...state.tiles, res.data], 
          }));
          
          return res.data;
        } catch (err) {
          console.error('[profileStore] Failed to add tile:', err);
          console.error('[profileStore] Error response:', err.response?.data);
          
          if (tempId) {
            set((state) => ({
              tiles: state.tiles.filter((t) => t.id !== tempId)
            }));
          }
          
          throw err;
        }
      },

      updateTile: async (id, updates) => {
        try {
          console.log('[profileStore] Updating tile:', id, 'with:', updates);
          
          const res = await axios.patch(`${API_BASE}/api/tiles/${id}`, updates);
          console.log('[profileStore] Updated tile response:', res.data);
          
          set((state) => ({
            tiles: state.tiles.map((tile) => 
              (tile._id === id || tile.id === id) ? res.data : tile
            ),
          }));
          
          return res.data;
        } catch (err) {
          console.error('[profileStore] Failed to update tile:', err);
          throw err;
        }
      },

      deleteTile: async (id) => {
        try {
          console.log('[profileStore] Deleting tile:', id);
          
          if (String(id).startsWith('tmp_')) {
            set((state) => ({
              tiles: state.tiles.filter((tile) => tile.id !== id)
            }));
            return;
          }
          
          await axios.delete(`${API_BASE}/api/tiles/${id}`);
          console.log('[profileStore] Deleted tile:', id);
          
          set((state) => ({
            tiles: state.tiles.filter((tile) => tile._id !== id && tile.id !== id),
          }));
        } catch (err) {
          console.error('[profileStore] Failed to delete tile:', err);
          throw err;
        }
      },


      updateLayout: async (layout) => {
        const state = get();
        console.log('[profileStore] Updating layout:', layout);
        
        const updates = layout
          .map(({ i, x, y, w, h }) => {
            const tile = state.tiles.find((t) => (t._id || t.id) === i);
            if (!tile) {
              console.warn(`[profileStore] Tile not found for layout item: ${i}`);
              return null;
            }
            
            if (String(tile.id || tile._id).startsWith('tmp_')) {
              console.log('[profileStore] Skipping temp tile in layout update:', i);
              return null;
            }
            
            return { 
              _id: tile._id, 
              id: tile._id, 
              x: Number(x), 
              y: Number(y), 
              w: Number(w), 
              h: Number(h) 
            }; 
          })
          .filter(Boolean);

        if (updates.length === 0) {
          console.log('[profileStore] No valid tiles found for layout update');
          return;
        }

        try {
          console.log('[profileStore] Sending layout updates:', updates);
          
          const response = await axios.patch(`${API_BASE}/api/tiles/bulk-layout`, { updates });
          console.log('[profileStore] Layout update response:', response.data);
          
          set((state) => ({
            tiles: state.tiles.map((tile) => {
              const match = updates.find((u) => u._id === (tile._id || tile.id));
              return match
                ? { ...tile, x: match.x, y: match.y, w: match.w, h: match.h }
                : tile;
            }),
          }));
        } catch (err) {
          console.error('[profileStore] Failed to update layout:', err);
          throw err;
        }
      },

      clearTiles: () => {
        console.log('[profileStore] Clearing all tiles');
        set({ tiles: [] });
      },

      refreshTiles: async () => {
        const { currentUserId, fetchTiles } = get();
        if (currentUserId) {
          console.log('[profileStore] Refreshing tiles for user:', currentUserId);
          await fetchTiles(currentUserId, currentUserId);
        }
      },
    }),
    {
      name: 'profile-store',
      partialize: (state) => ({ 
        currentUserId: state.currentUserId,
      }),
    }
  )
);