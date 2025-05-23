import { useAuthStore } from '../state/authStore';

const ProfileHeader = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-4">
      <h2 className="text-sm text-gray-400 tracking-wide">My profile</h2>
      <h1 className="text-5xl font-extrabold">{user?.name || 'Unnamed User'}</h1>
      <p className="text-sm text-gray-400">0 Followers &nbsp;&bull;&nbsp; — Following</p>

      <div className="flex gap-3 mt-4">
        <button className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition">
          Add
        </button>
        <button className="bg-gradient-to-r from-neutral-600 to-neutral-800 text-white px-4 py-2 rounded-lg transition">
          Edit
        </button>
        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg transition">
          Share
        </button>
      </div>

      <hr className="border-neutral-700 mt-6" />
    </div>
  );
};

export default ProfileHeader;
