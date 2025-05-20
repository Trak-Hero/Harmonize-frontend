export default function RecentlyPlayed() {
  const tracks = ['Random Access Memories', 'Glow On', 'Dopethrone', 'The Narcotic Story'];
  return (
    <section className="rounded-xl bg-gradient-to-br from-sky-100/10 to-zinc-200/10 p-4">
      <h3 className="text-lg font-semibold mb-2">Recently Played</h3>
      <ul className="space-y-2 text-sm">
        {tracks.map((t, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="text-gray-400">{`0${i}`}</span>
            <button className="bg-white text-black w-6 h-6 rounded-full flex items-center justify-center text-xs">▶</button>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}