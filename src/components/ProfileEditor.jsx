import { useState, useEffect } from 'react';
import { useAuthStore } from '../state/authStore';
import axios from 'axios';

export default function ProfileEditor({ onClose }) {
  const API   = import.meta.env.VITE_API_BASE_URL;
  const user  = useAuthStore((s) => s.user);
  const setMe = useAuthStore((s) => s.setUser || (() => {})); // fallback

  const [form, setForm] = useState({ displayName: '', bio: '', avatar: '' });

  useEffect(() => {
    if (user) setForm({
      displayName: user.displayName || '',
      bio:         user.bio         || '',
      avatar:      user.avatar      || '',
    });
  }, [user]);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async () => {
    const res = await axios.patch(`${API}/api/me`, form, { withCredentials: true });
    setMe(res.data);          // keep local store in sync
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-zinc-900 rounded-xl p-6 space-y-5">
        <h2 className="text-2xl font-bold text-white">Edit profile</h2>

        <div>
          <label className="block text-white mb-1">Display name</label>
          <input name="displayName" value={form.displayName}
                 onChange={onChange}
                 className="w-full rounded bg-zinc-800 p-2 text-white" />
        </div>

        <div>
          <label className="block text-white mb-1">Bio</label>
          <textarea rows={3} name="bio" value={form.bio}
                    onChange={onChange}
                    className="w-full rounded bg-zinc-800 p-2 text-white" />
        </div>

        <div>
          <label className="block text-white mb-1">Avatar URL</label>
          <input name="avatar" value={form.avatar}
                 onChange={onChange}
                 className="w-full rounded bg-zinc-800 p-2 text-white" />
          {form.avatar && (
            <img src={form.avatar} alt="preview"
                 className="mt-2 h-24 w-24 rounded-full object-cover" />
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose}
                  className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded text-white">
            Cancel
          </button>
          <button onClick={save}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
