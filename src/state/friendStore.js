// src/state/friendStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;
console.log('🌐 API base URL:', API);

// Helper to combine two arrays of IDs without duplicates
const union = (a = [], b = []) => [...new Set([...a.map(String), ...b.map(String)])];

export const useFriendStore = create(
  persist(
    (set, get) => ({
      /* ───────────────────  STATE  ─────────────────── */
      currentUserId: null,
      friends: [],               // always contains *at least* the logged‑in user
      isLoading: false,

      /* ───────────────────  MUTATORS  ─────────────────── */
      setCurrentUserId: (id) => {
        console.log('[friendStore] setCurrentUserId →', id);
        set({ currentUserId: id });
      },

      addFriendToStore: (userDoc) => {
        if (!userDoc || !userDoc._id) return;

        set((state) => {
          const exists = state.friends.some(
            (u) => String(u._id) === String(userDoc._id)
          );

          return {
            friends: exists
              ? state.friends.map((u) =>
                  String(u._id) === String(userDoc._id)
                    ? {
                        ...u,
                        ...userDoc,
                        following: union(u.following, userDoc.following),
                        followers: union(u.followers, userDoc.followers),
                      }
                    : u
                )
              : [...state.friends, userDoc],
          };
        });
      },

      /* ───────────────────  READERS  ─────────────────── */

      /** Fetch the logged‑in user *and* their following list,
       * keeping the current‑user record in state.friends. */
      fetchFriends: async () => {
        set({ isLoading: true });
        try {
          const meRes = await axios.get(`${API}/api/users/me`);
          if (meRes.status === 200) {
            const currentUser = meRes.data;
            get().addFriendToStore(currentUser);   // guarantees ‘me’ is in the array

            // Pull every user the current user follows
            const followIds = currentUser.following ?? [];
            if (followIds.length) {
              const reqs = followIds.map((id) =>
                axios.get(`${API}/api/users/${id}`)
              );
              const results = await Promise.allSettled(reqs);

              results.forEach((r) => {
                if (r.status === 'fulfilled' && r.value.status === 200) {
                  get().addFriendToStore(r.value.data);
                }
              });
            }
          }
        } catch (err) {
          console.error('[friendStore] fetchFriends error:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      followUser: async (friendId) => {
        try {
          const res = await axios.post(`${API}/api/users/${friendId}/follow`);
          if (res.status !== 201) return;

          /* update my own following list locally */
          set((state) => {
            const me = state.friends.find(
              (u) => String(u._id) === String(state.currentUserId)
            );
            if (!me) return state;

            const updatedMe = {
              ...me,
              following: union(me.following, [friendId]),
            };

            return {
              friends: state.friends.map((u) =>
                String(u._id) === String(me._id) ? updatedMe : u
              ),
            };
          });

          /* fetch the friend’s public record and cache it */
          const { data: friendDoc } = await axios.get(
            `${API}/api/users/${friendId}`
          );
          get().addFriendToStore(friendDoc);

          console.log('[friendStore] followUser → updated store');
        } catch (err) {
          console.error('[friendStore] followUser error:', err);
        }
      },

      unfollowUser: async (friendId) => {
        try {
          const res = await axios.delete(`${API}/api/users/${friendId}/follow`);
          if (res.status !== 200) return;

          set((state) => {
            const me = state.friends.find(
              (u) => String(u._id) === String(state.currentUserId)
            );
            if (!me) return state;

            const updatedMe = {
              ...me,
              following: (me.following || []).filter(
                (id) => String(id) !== String(friendId)
              ),
            };

            return {
              friends: state.friends.map((u) =>
                String(u._id) === String(me._id) ? updatedMe : u
              ),
            };
          });

          console.log('[friendStore] unfollowUser → updated store');
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

      /** Pull *all* mutual friends (followers + following) and
       * keep the current user in the list. */
      fetchAllFriends: async () => {
        const uid = get().currentUserId;
        if (!uid) return;

        set({ isLoading: true });
        try {
          const { data: me } = await axios.get(`${API}/api/users/${uid}`);

          const pickId = (x) => (typeof x === 'string' ? x : x?._id);
          const otherIds = [
            ...(me.following ?? []),
            ...(me.followers ?? []),
          ]
            .map(pickId)
            .filter((id) => id && String(id) !== String(uid));

          const uniq = [...new Set(otherIds)];

          const rs = await Promise.allSettled(
            uniq.map((id) => axios.get(`${API}/api/users/${id}`))
          );

          const others = rs
            .filter((r) => r.status === 'fulfilled' && r.value.status === 200)
            .map((r) => r.value.data);

          // ➊ keep me up front, ➋ append everyone else
          set({ friends: [me, ...others] });
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
