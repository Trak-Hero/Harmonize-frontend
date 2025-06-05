import { useState, useEffect } from 'react'; // Add useEffect here
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

export default function ConnectSpotify() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL;

  // Check for error parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      const errorMessages = {
        invalid_state: 'Session expired during Spotify connection. Please try again.',
        state_mismatch: 'Security verification failed. Please try again.',
        no_state: 'Session error. Please try again.',
        no_code: 'Spotify authorization was cancelled.',
        spotify_failed: 'Failed to connect to Spotify. Please try again.'
      };
      
      setError(errorMessages[errorParam] || 'Connection failed. Please try again.');
      
      // Clear the error from URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleSpotifyConnect = () => {
    setLoading(true);
    setError(null);
    
    try {
      // Redirect to the backend Spotify login endpoint
      window.location.href = `${API}/auth/spotify/login`;
    } catch (err) {
      console.error('Spotify connection error:', err);
      setError('Failed to connect to Spotify');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-8">
      <div className="max-w-md text-center space-y-6">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.6 0-.359.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Connect Your Spotify</h1>
          <p className="text-gray-300 text-lg">
            Connect your Spotify account to unlock personalized music recommendations, 
            see your top tracks and artists, and discover new music based on your taste.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 text-left">
            <h3 className="font-semibold mb-2">What you'll get:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• View your top tracks and artists</li>
              <li>• Get personalized music recommendations</li>
              <li>• See your recently played songs</li>
              <li>• Connect with friends who have similar taste</li>
              <li>• Discover local music events based on your preferences</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <button
            onClick={handleSpotifyConnect}
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.6 0-.359.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span>Connect with Spotify</span>
              </>
            )}
          </button>

          <div className="text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white underline text-sm"
            >
              Skip for now
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-6">
          <p>
            By connecting your Spotify account, you agree to Spotify's Terms of Use and Privacy Policy.
            We only access the data necessary to provide our services.
          </p>
        </div>
      </div>
    </div>
  );
}