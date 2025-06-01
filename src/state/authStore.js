import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      hasCheckedSession: false,

      fetchUser: async () => {
        const currentState = get();
        
        // If we're already loading or have checked session, don't fetch again
        if (currentState.isLoading) return;
        
        set({ isLoading: true });

        try {
          const res = await fetch(`${API_BASE}/api/me`, {
            credentials: 'include',
          });
          
          if (!res.ok) {
            // If session is invalid, clear stored user but don't throw
            if (res.status === 401) {
              set({ user: null, isLoading: false, hasCheckedSession: true });
              return;
            }
            throw new Error(`Failed to fetch user: ${res.status}`);
          }

          const userData = await res.json();
          set({ user: userData, isLoading: false, hasCheckedSession: true });
        } catch (err) {
          console.error('Error loading user session:', err);
          // Don't clear user on network errors - keep the persisted user
          // Only clear on explicit auth failures (401)
          set({ isLoading: false, hasCheckedSession: true });
        }
      },

      login: (userData) => {
        set({ user: userData, hasCheckedSession: true });
      },

      setUser: (userData) => {
        set({ user: userData });
      },

      logout: async () => {
        try {
          // Call logout endpoint to clear server session
          await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch (err) {
          console.error('Logout request failed:', err);
        } finally {
          // Always clear local state regardless of server response
          set({ user: null, hasCheckedSession: true });
        }
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
      // Only persist the user data, not loading states
      partialize: (state) => ({ 
        user: state.user,
        hasCheckedSession: state.hasCheckedSession 
      }),
    }
  )
);
