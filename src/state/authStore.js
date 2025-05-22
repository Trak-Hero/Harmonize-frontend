import { create } from 'zustand';

const mockUser = {
  id: '12345',
  name: 'Lena VC',
  email: 'lena@example.com',
};

export const useAuthStore = create((set) => {
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const initialUser = storedUser || mockUser; // ✅ fallback to mock if nothing is in localStorage

  // Optional: persist mock if none exists
  if (!storedUser) {
    localStorage.setItem('user', JSON.stringify(mockUser));
  }

  return {
    user: initialUser,

    login: (userData) => {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData });
    },

    logout: () => {
      localStorage.removeItem('user');
      set({ user: null });
    },

    updateUser: (updates) =>
      set((state) => {
        const updated = { ...state.user, ...updates };
        localStorage.setItem('user', JSON.stringify(updated));
        return { user: updated };
      }),
  };
});
