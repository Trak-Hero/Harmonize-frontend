// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Grab the `login` action from the store
  const login = useAuthStore((s) => s.login);

  // API base URL (make sure VITE_API_BASE_URL is set in your .env)
  const API = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        credentials: 'include', // so that cookies are sent back from the server
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }

      const userData = await res.json();
      // 1) Persist in localStorage + store
      login(userData);
      // 2) Redirect
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 p-6 bg-gray-800 rounded-md text-white">
      <h2 className="text-2xl font-semibold mb-4">Log in</h2>

      {error && (
        <div className="bg-red-600 p-2 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Username or Email</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
          />
        </div>

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
