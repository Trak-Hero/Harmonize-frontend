/* src/state/friendStore.js
   -------------------------------------------------------------- */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
axios.defaults.withCredentials = true;

export const useFriendStore = create(
  persist(
    (set, get) => ({
      /* ──────────── STATE ──────────── */
      currentUserId: null,   // whose profile page you’re on
      friends: [],           // cached user docs (me + everyone we touch)
      isLoading: false,

      /* ──────────── MUTATORS ──────────── */
      setCurrentUserId: (id) => {
        console.log('[friendStore] setCurrentUserId →', id);
        set({ currentUserId: id });
      },

      /** Push or replace a user doc in the cache */
      addFriendToStore: (userDoc) => {
        if (!userDoc || !userDoc._id) return;

        set((state) => {
          const exists = state.friends.some(
            (u) => String(u._id) === String(userDoc._id)
          );
          return {
            friends: exists
              ? state.friends.map((u) =>
                  String(u._id) === String(userDoc._id) ? userDoc : u
                )
              : [...state.friends, userDoc],
          };
        });
      },

      /* ──────────── FOLLOW / UNFOLLOW ──────────── */
      followUser: async (friendId) => {
        try {
          const res = await axios.post(
            `${API_BASE}/api/friends/follow/${friendId}`
          );
          if (res.status !== 201) return;

          const { current, target } = res.data;
          console.log('[friendStore] followUser → server returned', {
            current,
            target,
          });

          // merge both updated user docs into cache
          set((state) => ({
            friends: state.friends.map((u) => {
              if (String(u._id) === String(current._id)) return current;
              if (String(u._id) === String(target._id))  return target;
              return u;
            }),
          }));
        } catch (err) {
          console.error('[friendStore] followUser error:', err);
        }
      },

      unfollowUser: async (friendId) => {
        try {
          const res = await axios.delete(
            `${API_BASE}/api/friends/follow/${friendId}`
          );
          if (res.status !== 200) return;

          const { current, target } = res.data;
          console.log('[friendStore] unfollowUser → server returned', {
            current,
            target,
          });

          set((state) => ({
            friends: state.friends.map((u) => {
              if (String(u._id) === String(current._id)) return current;
              if (String(u._id) === String(target._id))  return target;
              return u;
            }),
          }));
        } catch (err) {
          console.error('[friendStore] unfollowUser error:', err);
        }
      },

      /* ──────────── FETCH SINGLE FRIEND (utility) ──────────── */
      fetchFriend: async (friendId) => {
        set({ isLoading: true });
        try {
          const res = await axios.get(`${API_BASE}/api/users/${friendId}`, {
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
    }),
    {
      name: 'friend-store',
      partialize: (s) => ({
        currentUserId: s.currentUserId,
      }),
    }
  )
);

export default useFriendStore;