import { create } from 'zustand';

const useLocationStore = create((set) => ({
  userLocation: null,
  locationError: null,

  setUserLocation: ({ latitude, longitude }) => {
    set({ userLocation: { latitude, longitude } });
  },

  fetchUserLocation: () => {
    if (!navigator.geolocation) {
      set({ locationError: 'Geolocation not supported' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        set({ userLocation: { latitude, longitude } });
      },
      (err) => {
        set({ locationError: err.message });
        console.error('Geolocation error:', err);
      }
    );
  },
}));

export default useLocationStore;
