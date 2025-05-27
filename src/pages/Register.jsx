// pages/Register.jsx
import { useState } from 'react';

export default function Register() {
    const [form, setForm] = useState({
            name: '', username: '', email: '', password: '', accountType: 'user',
          });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      const contentType = res.headers.get('content-type');
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} – ${errorText}`);
      }
  
      if (contentType?.includes('application/json')) {
        const data = await res.json();
        alert('Registered! Now connect Spotify.');
        window.location.href = '/connect';
      } else {
        throw new Error('Unexpected non-JSON response');
      }
    } catch (err) {
      alert('Registration failed: ' + err.message);
      console.error(err);
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold">Create Account</h2>
      <input name="name" placeholder="Name" required onChange={handleChange} className="w-full p-2 border" />
      <input name="username" placeholder="Username" required onChange={handleChange} className="w-full p-2 border" />
      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        onChange={handleChange}
        className="w-full p-2 border"
        />
        <input
        name="email"
        placeholder="E‑mail"
        required
        onChange={handleChange}
        className="w-full p-2 border"
        />
        <select
        name="accountType"
        onChange={handleChange}
        className="w-full p-2 border"
        >
        <option value="user">User</option>
        <option value="artist">Artist</option>
        </select>

      <button type="submit" className="w-full p-2 bg-blue-600 text-white">Register & Connect Spotify</button>
    </form>
  );
}
