export default function DifferencesCard({ differences }) {
  const { uniqueGenres, userAName = 'User A', userBName = 'User B' } = differences;

  const genreDifferences = [
    ...uniqueGenres.userA.map((genre) => ({
      genre,
      user: userAName,
    })),
    ...uniqueGenres.userB.map((genre) => ({
      genre,
      user: userBName,
    })),
  ];

  return (
    <div className="bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-700 p-6 rounded-2xl text-white shadow-xl">
      <h2 className="text-2xl font-serif font-semibold text-white mb-4">Differences</h2>
      <ul className="space-y-2">
        {genreDifferences.map((item, idx) => (
          <li
            key={idx}
            className="flex justify-between border-b border-white/30 pb-1"
          >
            <span>{item.genre}</span>
            <span className="uppercase text-sm tracking-wide font-bold text-white/80">{item.user}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
