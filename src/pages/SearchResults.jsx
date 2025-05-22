import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function SearchResults() {
  const [params] = useSearchParams();
  const query = params.get('q') ?? '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    fetch(`${baseURL}/spotify/search?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setResults(data);
        else setResults([]);
      })
      .catch((err) => {
        console.error('Search failed:', err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [query]);

  if (!query) return <p className="p-6 text-white">Enter an artist name…</p>;
  if (loading) return <p className="p-6 text-white">Searching…</p>;
  if (!results.length) return <p className="p-6 text-white">No matches.</p>;

  return (
    <div className="p-6 text-white grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-6">
      {results.map((a) => (
        <Link key={a.id} to={`/artist/${a.id}`} className="text-center hover:opacity-80">
          <img
            src={a.image || 'https://placehold.co/160?text=Artist'}
            className="w-40 h-40 object-cover rounded-xl shadow"
            alt={a.name}
          />
          <div className="mt-2">{a.name}</div>
        </Link>
      ))}
    </div>
  );
}
