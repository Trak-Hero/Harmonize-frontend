import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const navigate                = useNavigate();
  const setUser                 = useAuthStore((s) => s.setUser);   // <- whatever your setter is called
  const API                     = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/auth/login`, {
        method      : 'POST',
        credentials : 'include',
        headers     : { 'Content-Type': 'application/json' },
        body        : JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error(await res.text());

      const user = await res.json();   // server returns user JSON
      setUser(user);                   // persist in Zustand / localStorage
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6">Log in to Reverberate</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-800 placeholder-gray-400"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button className="w-full py-2 rounded bg-blue-500 hover:bg-blue-600">
          Log in
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-300">
        Don’t have an account?&nbsp;
        <Link to="/register" className="text-blue-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
