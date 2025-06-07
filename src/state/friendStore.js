// src/state/friendStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios            from 'axios';
import isValidObjectId  from '../utils/isValidObjectId';   // ← tiny helper

const API = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export const useFriendStore = create(
  persist(
    (set, get) => ({
      currentUserId : null,
      friends       : [],
      isLoading     : false,

      /*───────────────────────────
       *  GET myself + my friends
       *───────────────────────────*/
      fetchFriends : async () => {
        set({ isLoading : true });
        try {
          const { data: me } = await axios.get(`${API}/api/users/me`);
          get().addFriendToStore(me);                    // myself

          // the API already returns populated docs
          (me.following || [])
            .filter(u => u && isValidObjectId(u._id))    // defensive
            .forEach(get().addFriendToStore);            // add each friend
        } catch (err) {
          console.error('[friendStore] fetchFriends error:', err);
        } finally {
          set({ isLoading : false });
        }
      },

      /*───────────────────────────
       *  FOLLOW
       *───────────────────────────*/
      followUser : async (friendId) => {
        try {
          const res = await axios.post(`${API}/api/users/${friendId}/follow`);
          if (res.status !== 201) return;

          const { current, target } = res.data;

          // 1. store current user (with updated following list)
          get().addFriendToStore(current);
          // 2. store the friend we just followed
          get().addFriendToStore(target);
        } catch (err) {
          console.error('[friendStore] followUser error:', err);
        }
      },

      /*───────────────────────────
       *  UNFOLLOW
       *───────────────────────────*/
      unfollowUser : async (friendId) => {
        try {
          const res = await axios.delete(`${API}/api/users/${friendId}/follow`);
          if (res.status !== 200) return;

          const { current } = res.data;      // backend returns updated “me”
          get().addFriendToStore(current);
        } catch (err) {
          console.error('[friendStore] unfollowUser error:', err);
        }
      },

      /*───────────────────────────
       *  UTIL
       *───────────────────────────*/
      addFriendToStore : (userDoc) => {
        if (!userDoc || !userDoc._id) return;
        set(state => {
          const exists = state.friends.some(u => String(u._id) === String(userDoc._id));
          return {
            friends : exists
              ? state.friends.map(u =>
                  String(u._id) === String(userDoc._id) ? { ...u, ...userDoc } : u)
              : [...state.friends, userDoc],
          };
        });
      },

      setCurrentUserId : id => set({ currentUserId : id }),
    }),
    {
      name       : 'friend-store',
      partialize : s => ({ currentUserId : s.currentUserId, friends : s.friends }),
    }
  )
);

export default useFriendStore;
