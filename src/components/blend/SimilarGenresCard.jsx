export default function SimilarGenresCard({ genres }) {
  return (
    <div className="bg-gradient-to-br from-green-700 via-lime-400 to-rose-200 p-6 rounded-2xl text-white shadow-xl space-y-2">
      <h2 className="text-2xl font-serif font-semibold text-white mb-4">Similar Genres</h2>
      <ul className="space-y-1">
        {genres.map((g, i) => (
          <li key={i} className="flex justify-between border-b border-white/30 pb-1 text-white">
            <span
              className={`${
                g.color
                  ? g.color
                  : "text-white"
              } font-medium`}
            >
              {g.genre}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
