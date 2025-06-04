export default function DifferencesCard({ differences }) {
  const {
    uniqueGenres = { userA: [], userB: [] },
    userAName = 'User A',
    userBName = 'User B',
  } = differences;

  const genreDifferences = [
    ...uniqueGenres.userA.map((genre) => ({
      genre,
      user: userAName,
      color: 'bg-pink-500',
    })),
    ...uniqueGenres.userB.map((genre) => ({
      genre,
      user: userBName,
      color: 'bg-indigo-500',
    })),
  ];

  return (
    <div className="bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-700 p-6 rounded-2xl text-white shadow-xl">
      <h2 className="text-2xl font-serif font-semibold mb-4">Differences</h2>
      <ul className="space-y-2">
        {genreDifferences.map((item, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center border-b border-white/20 pb-2"
          >
            <span className="capitalize tracking-wide">{item.genre}</span>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${item.color} bg-opacity-80`}
            >
              {item.user}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
