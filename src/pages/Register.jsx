import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../state/authStore';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'user'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const API = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('API URL:', API);
      console.log('Attempting registration with:', { 
        ...formData, 
        password: '***', 
        confirmPassword: '***' 
      });

      // Register the user
      const registerRes = await fetch(`${API}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          accountType: formData.accountType
        }),
      });

      console.log('Registration response status:', registerRes.status);

      if (!registerRes.ok) {
        const errorData = await registerRes.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }

      const registerResult = await registerRes.json();
      console.log('Registration successful:', registerResult);

      // Auto-login after successful registration
      const loginRes = await fetch(`${API}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          usernameOrEmail: formData.username, 
          password: formData.password 
        }),
      });

      if (!loginRes.ok) {
        // Registration succeeded but login failed - redirect to login page
        console.log('Auto-login failed, redirecting to login');
        navigate('/login');
        return;
      }

      const user = await loginRes.json();
      console.log('Auto-login successful:', user);
      login(user);
      navigate('/profile');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6">Join Harmonize</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <select
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="user">Music Lover</option>
          <option value="artist">Artist</option>
        </select>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-300">
        Already have an account?&nbsp;
        <Link to="/login" className="text-green-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}