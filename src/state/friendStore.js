// src/state/friendStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;
console.log('🌐 API base URL:', API);

/* ───────── helpers ───────── */
const pickId = (x) =>
  typeof x === 'string'
    ? x
    : x && typeof x === 'object'
    ? x._id || x.id || ''
    : '';

const uniqIds = (arr = []) => [...new Set(arr.map(pickId).filter(Boolean))];

export const useFriendStore = create(
  persist(
    (set, get) => ({
      /* ────────────── STATE ────────────── */
      currentUserId: null,
      friends: [],            // always includes current user
      isLoading: false,

      /* ─────────── MUTATORS ─────────── */
      setCurrentUserId: (id) => set({ currentUserId: id }),

      addFriendToStore: (userDoc) => {
        if (!userDoc || !userDoc._id) return;

        // normalise arrays before we touch the store
        const doc = {
          ...userDoc,
          following: uniqIds(userDoc.following),
          followers: uniqIds(userDoc.followers),
        };

        set((state) => {
          const exists = state.friends.some(
            (u) => String(u._id) === String(doc._id)
          );

          if (!exists) return { friends: [...state.friends, doc] };

          return {
            friends: state.friends.map((u) =>
              String(u._id) === String(doc._id)
                ? {
                    ...u,                // keep richer local fields first
                    ...doc,              // then newer scalar props
                    following: uniqIds([...u.following, ...doc.following]),
                    followers: uniqIds([...u.followers, ...doc.followers]),
                  }
                : u
            ),
          };
        });
      },

      /* ─────────── READERS ─────────── */

      /** Logged‑in user + their following list (merge‑safe). */
      fetchFriends: async () => {
        set({ isLoading: true });
        try {
          const { status, data: me } = await axios.get(`${API}/api/users/me`);
          if (status !== 200) throw new Error('failed /me');

          // merge local copy with server copy
          get().addFriendToStore(me);
          const followIds = uniqIds(me.following);

          // fetch only those we don't already have
          const missing = followIds.filter(
            (id) => !get().friends.some((f) => String(f._id) === String(id))
          );

          if (missing.length) {
            const res = await Promise.allSettled(
              missing.map((id) => axios.get(`${API}/api/users/${id}`))
            );

            res.forEach((r) => {
              if (r.status === 'fulfilled' && r.value.status === 200) {
                get().addFriendToStore(r.value.data);
              }
            });
          }
        } catch (err) {
          console.error('[friendStore] fetchFriends error:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      followUser: async (friendId) => {
        try {
          const { status } = await axios.post(
            `${API}/api/users/${friendId}/follow`
          );
          if (status !== 201) return;

          /* update me locally */
          set((state) => {
            const me = state.friends.find(
              (u) => String(u._id) === String(state.currentUserId)
            );
            if (!me) return state;

            const updated = {
              ...me,
              following: uniqIds([...me.following, friendId]),
            };

            return {
              friends: state.friends.map((u) =>
                String(u._id) === String(me._id) ? updated : u
              ),
            };
          });

          /* cache the followed user */
          const { data } = await axios.get(`${API}/api/users/${friendId}`);
          get().addFriendToStore(data);
        } catch (err) {
          console.error('[friendStore] followUser error:', err);
        }
      },

      unfollowUser: async (friendId) => {
        try {
          const { status } = await axios.delete(
            `${API}/api/users/${friendId}/follow`
          );
          if (status !== 200) return;

          set((state) => {
            const me = state.friends.find(
              (u) => String(u._id) === String(state.currentUserId)
            );
            if (!me) return state;

            const updated = {
              ...me,
              following: me.following.filter(
                (id) => String(id) !== String(friendId)
              ),
            };

            return {
              friends: state.friends.map((u) =>
                String(u._id) === String(me._id) ? updated : u
              ),
            };
          });
        } catch (err) {
          console.error('[friendStore] unfollowUser error:', err);
        }
      },

      fetchFriend: async (friendId) => {
        set({ isLoading: true });
        try {
          const res = await axios.get(`${API}/api/users/${friendId}`);
          if (res.status === 200) get().addFriendToStore(res.data);
        } catch (err) {
          console.error('[friendStore] fetchFriend error:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      /** followers + following (mutuals) */
      fetchAllFriends: async () => {
        const uid = get().currentUserId;
        if (!uid) return;

        set({ isLoading: true });
        try {
          const { data: me } = await axios.get(`${API}/api/users/${uid}`);

          const ids = uniqIds([
            ...me.following,
            ...me.followers,
          ]).filter((id) => String(id) !== String(uid));

          const res = await Promise.allSettled(
            ids.map((id) => axios.get(`${API}/api/users/${id}`))
          );

          const others = res
            .filter((r) => r.status === 'fulfilled' && r.value.status === 200)
            .map((r) => r.value.data);

          set({ friends: [me, ...others] });
        } catch (err) {
          console.error('[friendStore] fetchAllFriends error:', err);
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
