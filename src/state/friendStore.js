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
          const exists = state.friends.some((u) => String(u._id) === String(userDoc._id));
          return {
            friends: exists
              ? state.friends.map((u) =>
                  String(u._id) === String(userDoc._id) ? { ...u, ...userDoc } : u
                )
              : [...state.friends, userDoc],
          };
        });
      },

      followUser: async (friendId) => {
        try {
          const res = await axios.post(`${API}/api/users/${friendId}/follow`);
          if (res.status !== 201) return;

          console.log('[friendStore] followUser → follow succeeded, now refreshing list');
          await get().fetchAllFriends();
        } catch (err) {
          console.error('[friendStore] followUser error:', err);
        }
      },

      unfollowUser: async (friendId) => {
        try {
          const res = await axios.delete(`${API}/api/users/${friendId}/follow`);
          if (res.status !== 200) return;

          console.log('[friendStore] unfollowUser → unfollow succeeded, now refreshing list');
          await get().fetchAllFriends();
        } catch (err) {
          console.error('[friendStore] unfollowUser error:', err);
        }
      },

      fetchFriend: async (friendId) => {
        set({ isLoading: true });
        try {
          const res = await axios.get(`${API}/api/users/${friendId}`);
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
        if (!currentUserId) return;

        set({ isLoading: true });
        try {
          const { data: user } = await axios.get(`${API}/api/users/${currentUserId}`);

          const extractId = (entry) =>
            typeof entry === 'string' ? entry : entry?._id;

          const ids = [
            ...(user.following ?? []),
            ...(user.followers ?? []),
          ]
            .map(extractId)
            .filter(id => id && String(id) !== String(currentUserId));

          const uniqueIds = [...new Set(ids)];

          const responses = await Promise.allSettled(
            uniqueIds.map(id => axios.get(`${API}/api/users/${id}`))
          );

          const validFriends = responses
            .filter(r => r.status === 'fulfilled' && r.value.status === 200)
            .map(r => r.value.data);

          set({ friends: validFriends });

        } catch (err) {
          console.error('[friendStore] fetchAllFriends error:', err.message);
        } finally {
          set({ isLoading: false });
        }
      }

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
