export default function FriendFeed({ activity }) {
  return (
    <div className="bg-zinc-900 p-4 rounded-lg text-white space-y-3 max-w-sm">
      <h3 className="text-lg font-semibold">Friend Activity</h3>
      {activity.length === 0 && (
        <p className="text-sm text-zinc-400">No one is playing right now.</p>
      )}
      {activity.map((entry) => (
        <div key={entry.userId} className="flex gap-3 items-center">
          <img
            src={entry.track.image}
            className="w-12 h-12 rounded object-cover"
            alt="album cover"
          />
          <div className="text-sm">
            <div className="font-medium">{entry.name}</div>
            <div className="text-zinc-400">{entry.track.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
