import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  
  // Use consistent API base URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log('Login attempt:', {
        API_BASE,
        usernameOrEmail,
        endpoint: `${API_BASE}/auth/login`
      });
      
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || `Login failed with status: ${res.status}`);
      }
      const user = await res.json();
      console.log('Login successful:', user);
      console.log("Access token:", user.accessToken);

      if (user.spotifyAccessToken) {
        localStorage.setItem('accessToken', user.spotifyAccessToken);
      }


      login(user);
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific CORS errors
      if (err.message.includes('CORS') || err.name === 'TypeError') {
        setError('Connection error. Please check if the server is running and accessible.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6">Log in to Harmonize</h1>

      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <div className="mb-4 p-2 bg-gray-800 rounded text-xs text-gray-300">
          <div>API Base: {API_BASE}</div>
          <div>Mode: {import.meta.env.MODE}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Username or Email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-300">
        Don't have an account?&nbsp;
        <Link to="/register" className="text-blue-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}