import { useEffect, useState, useMemo } from 'react';
import useFriendStore from '../state/friendStore';
import FriendCard from '../components/FriendsPage/FriendCard';

export default function Friends() {
  const { friends, userSlice, followUser, unfollowUser } = useFriendStore((s) => s);
  const currentUserId = userSlice.currentUserId;

  /* ---------- search ---------- */
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query.trim()) return friends;
    return friends.filter((f) =>
      f.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, friends]);

  /* ---------- load guard ---------- */
  useEffect(() => {
    /* if you later fetch users from backend put it here */
  }, []);

  return (
    <div className="px-10 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-center">Friends</h1>

      {/* search bar */}
      <div className="flex justify-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users…"
          className="w-full max-w-md px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white focus:outline-none"
        />
      </div>

      {/* results */}
      {filtered.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filtered.map((friend) => {
            const isMe        = friend.id === currentUserId;
            const iFollowThem = friends
              .find((f) => f.id === currentUserId)
              ?.following.includes(friend.id);

            return (
              <div key={friend.id} className="space-y-2">
                <FriendCard friend={friend} />

                {/* follow / unfollow right below each card (optional) */}
                {!isMe && (
                  <button
                    onClick={() =>
                      iFollowThem ? unfollowUser(friend.id) : followUser(friend.id)
                    }
                    className={`w-full py-1.5 rounded ${
                      iFollowThem
                        ? 'bg-gray-400 hover:bg-gray-500'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white text-sm`}
                  >
                    {iFollowThem ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400">No users match “{query}”.</p>
      )}
    </div>
  );
}
