import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useAuthStore = create((set, get) => {
  // Load user from localStorage on store creation
  const storedUser = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error('Error parsing stored user:', err);
      localStorage.removeItem('user');
      return null;
    }
  })();

  return {
    user: storedUser,
    isLoading: false,
    isInitialized: false,

    fetchUser: async () => {
      // Avoid duplicate calls
      if (get().isLoading) return;
      
      set({ isLoading: true });
      
      try {
        const res = await fetch(`${API_BASE}/api/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            // Session expired or invalid
            localStorage.removeItem('user');
            set({ user: null, isLoading: false, isInitialized: true });
            return;
          }
          throw new Error(`Failed to fetch user: ${res.status}`);
        }

        const userData = await res.json();
        
        // Store in localStorage and update state
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, isLoading: false, isInitialized: true });
        
      } catch (err) {
        console.error('Error loading user session:', err);
        localStorage.removeItem('user');
        set({ user: null, isLoading: false, isInitialized: true });
      }
    },

    login: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
    },

    setUser: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
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
        console.error('Error during logout:', err);
      } finally {
        // Always clear local storage and state
        localStorage.removeItem('user');
        set({ user: null });
      }
    },

    updateUser: (updates) =>
      set((state) => {
        const updated = { ...state.user, ...updates };
        localStorage.setItem('user', JSON.stringify(updated));
        return { user: updated };
      }),
  };
});