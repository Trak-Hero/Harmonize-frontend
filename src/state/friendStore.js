// src/state/friendStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;
console.log('🌐 API base URL:', API);

export const useFriendStore = create(
  persist(
    (set, get) => ({
      currentUserId: null,
      friends: [],
      isLoading: false,

      setCurrentUserId: (id) => {
        console.log('[friendStore] setCurrentUserId →', id);
        set({ currentUserId: id });
      },

      addFriendToStore: (userDoc) => {
        if (!userDoc || !userDoc._id) return;

        set((state) => {
          const updated = state.friends.some((u) => String(u._id) === String(userDoc._id));
          return {
            friends: updated
              ? state.friends.map((u) =>
                  String(u._id) === String(userDoc._id) ? { ...u, ...userDoc } : u
                )
              : [...state.friends, userDoc],
          };
        });
      },

      followUser: async (friendId) => {
        try {
          const res = await axios.post(`${API}/api/users/${friendId}/follow`, {
            withCredentials: true,
          });
          if (res.status !== 201) return;

          const { current, target } = res.data;
          console.log('[friendStore] followUser →', { current, target });

          set((state) => ({
            friends: [
              ...state.friends.filter(
                (u) => String(u._id) !== String(current._id) && String(u._id) !== String(target._id)
              ),
              current,
              target,
            ],
          }));
        } catch (err) {
          console.error('[friendStore] followUser error:', err);
        }
      },

      unfollowUser: async (friendId) => {
        try {
          const res = await axios.delete(`${API}/api/users/${friendId}/follow`, {
            withCredentials: true,
          });
          if (res.status !== 200) return;

          const { current, target } = res.data;
          console.log('[friendStore] unfollowUser →', { current, target });

          set((state) => ({
            friends: [
              ...state.friends.filter(
                (u) => String(u._id) !== String(current._id) && String(u._id) !== String(target._id)
              ),
              current,
              target,
            ],
          }));
        } catch (err) {
          console.error('[friendStore] unfollowUser error:', err);
        }
      },

      fetchFriend: async (friendId) => {
        set({ isLoading: true });
        try {
          const res = await axios.get(`${API}/api/users/${friendId}`, {
            timeout: 10000,
            withCredentials: true,
          });
          if (res.status === 200) {
            get().addFriendToStore(res.data);
          }
        } catch (err) {
          console.error('[friendStore] fetchFriend error:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchAllFriends: async () => {
        const currentUserId = get().currentUserId;
        if (!currentUserId) {
          console.warn('[friendStore] fetchAllFriends skipped: no current user');
          return;
        }

        set({ isLoading: true });

        try {
          // Get current user data
          const res = await axios.get(`${API}/api/users/${currentUserId}`, {
            timeout: 10000,
            withCredentials: true,
          });

          const user = res.data;
          const followedIds = user.following || [];

          console.log('[friendStore] Fetching friends:', followedIds);

          for (const friendId of followedIds) {
            try {
              const friendRes = await axios.get(`${API}/api/users/${friendId}`, {
                timeout: 10000,
                withCredentials: true,
              });
              get().addFriendToStore(friendRes.data);
            } catch (innerErr) {
              console.warn(`[friendStore] Failed to fetch friend ${friendId}:`, innerErr.message);
            }
          }
        } catch (err) {
          console.error('[friendStore] fetchAllFriends error:', err.message);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'friend-store',
      partialize: (s) => ({
        currentUserId: s.currentUserId,
        friends: s.friends,
      }),
    }
  )
);

export default useFriendStore;
