export default function FriendActivity() {
  return (
    <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-xl p-4 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-md font-semibold mb-2">Friend Activity</h3>
        <p className="text-sm text-gray-400 mb-4">See what your friends are listening to.</p>
        <ul className="space-y-3">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700" />
              <div className="flex-1 h-4 bg-gray-600 rounded" />
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex justify-between">
        <button className="text-sm px-3 py-1 bg-white text-black rounded-full">See all</button>
        <button className="text-sm px-3 py-1 bg-gradient-to-r from-neutral-500 to-neutral-700 text-white rounded-full">Locations</button>
      </div>
    </div>
  );
}
