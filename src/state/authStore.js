import { create } from 'zustand';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const useAuthStore = create((set, get) => {
  // Initialize from localStorage immediately
  const storedUser = (() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem('user');
      return null;
    }
  })();

  return {
    user: storedUser,
    isLoading: false,
    isInitialized: false,

    fetchUser: async () => {
      // If we already have a user from localStorage and we've already initialized, skip the API call
      if (get().user && get().isInitialized) {
        return;
      }

      set({ isLoading: true });

      try {
        const res = await fetch(`${API_BASE}/api/me`, {
          credentials: 'include',
        });

        if (!res.ok) {
          // If the server says we're not authenticated, clear local storage
          if (res.status === 401) {
            localStorage.removeItem('user');
            set({ user: null, isLoading: false, isInitialized: true });
            return;
          }
          throw new Error(`Failed to fetch user: ${res.status}`);
        }

        const userData = await res.json();
        
        // Update both localStorage and state
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, isLoading: false, isInitialized: true });
      } catch (err) {
        console.error('Error loading user session:', err);
        
        // Only clear localStorage if we get a clear authentication error
        // Keep the stored user for network errors
        if (err.message.includes('401')) {
          localStorage.removeItem('user');
          set({ user: null });
        }
        
        set({ isLoading: false, isInitialized: true });
      }
    },

    login: (userData) => {
      try {
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, isInitialized: true });
      } catch (error) {
        console.error('Error storing user data:', error);
      }
    },

    setUser: (userData) => {
      try {
        localStorage.setItem('user', JSON.stringify(userData));
        set({ user: userData, isInitialized: true });
      } catch (error) {
        console.error('Error storing user data:', error);
      }
    },

    logout: async () => {
      try {
        // Call the logout endpoint to clear server-side session
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Error logging out from server:', error);
      } finally {
        // Always clear client-side data regardless of server response
        localStorage.removeItem('user');
        set({ user: null, isInitialized: true });
      }
    },

    updateUser: (updates) => {
      const currentUser = get().user;
      if (!currentUser) return;

      const updated = { ...currentUser, ...updates };
      try {
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    },

    // Helper method to check if user is authenticated
    isAuthenticated: () => {
      return !!get().user;
    },

    // Helper method to get user ID safely
    getUserId: () => {
      return get().user?._id || get().user?.id;
    },
  };
});