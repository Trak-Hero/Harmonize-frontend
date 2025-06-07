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

      // ADD THIS MISSING FUNCTION
      fetchFriends: async () => {
        set({ isLoading: true });
        try {
          const res = await axios.get(`${API}/api/users/me`);
          if (res.status === 200) {
            const currentUser = res.data;
            get().addFriendToStore(currentUser);
            
            // Fetch following users
            if (currentUser.following?.length > 0) {
              const followingPromises = currentUser.following.map(id => 
                axios.get(`${API}/api/users/${id}`)
              );
              
              const responses = await Promise.allSettled(followingPromises);
              responses.forEach(response => {
                if (response.status === 'fulfilled' && response.value.status === 200) {
                  get().addFriendToStore(response.value.data);
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

          // Update current user's following list
          set((state) => {
            const currentUser = state.friends.find(f => String(f._id) === String(state.currentUserId));
            if (currentUser) {
              const updatedUser = {
                ...currentUser,
                following: [...(currentUser.following || []), friendId]
              };
              return {
                friends: state.friends.map(f => 
                  String(f._id) === String(currentUser._id) ? updatedUser : f
                )
              };
            }
            return state;
          });

          // Fetch the followed user's data
          const { data: followedUser } = await axios.get(`${API}/api/users/${friendId}`);
          get().addFriendToStore(followedUser);

          console.log('[friendStore] followUser → updated store');
        } catch (err) {
          console.error('[friendStore] followUser error:', err);
        }
      },

      unfollowUser: async (friendId) => {
        try {
          const res = await axios.delete(`${API}/api/users/${friendId}/follow`);
          if (res.status !== 200) return;

          // Update current user's following list
          set((state) => {
            const currentUser = state.friends.find(f => String(f._id) === String(state.currentUserId));
            if (currentUser) {
              const updatedUser = {
                ...currentUser,
                following: (currentUser.following || []).filter(id => String(id) !== String(friendId))
              };
              return {
                friends: state.friends.map(f => 
                  String(f._id) === String(currentUser._id) ? updatedUser : f
                )
              };
            }
            return state;
          });

          console.log('[friendStore] unfollowUser → updated store');
        } catch (err) {
          console.error('[friendStore] unfollowUser error:', err);
        }
      },

      // Keep existing functions...
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
