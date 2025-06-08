import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

console.log('Auth Store - API_BASE:', API_BASE);
console.log('Environment variables:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      hasCheckedSession: false,

      fetchUser: async () => {
        const currentState = get();
        
        if (currentState.isLoading) return;
        
        set({ isLoading: true });

        try {
          const res = await fetch(`${API_BASE}/api/me`, {
            credentials: 'include',
          });
          
          if (!res.ok) {
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
          await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch (err) {
          console.error('Logout request failed:', err);
        } finally {
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
      partialize: (state) => ({ 
        user: state.user,
        hasCheckedSession: state.hasCheckedSession 
      }),
    }
  )
);
