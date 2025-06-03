import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';


const API = import.meta.env.VITE_API_BASE_URL ?? "";


// one-time registration
Chart.register(BarElement, CategoryScale, LinearScale);

export default function GenreStats({ title = 'Your genre footprint' }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/genre-stats`, { withCredentials: true })
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.warn('genre-stats failed', err);
        setError("Unable to fetch genre stats.");
      });
  }, []);

  if (error) {
    return (
      <section className="text-center text-red-400 py-8">
        <p>{error}</p>
      </section>
    );
  }

  if (!stats || !stats.histogram) return null;

  const top10 = Object.entries(stats.histogram ?? {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>

      {top10.length === 0 ? (
        <p className="text-center text-white/60">No genre data available yet. Try listening to more music!</p>
      ) : (
        <Bar
          data={{
            labels: top10.map(([g]) => g),
            datasets: [{ label: 'plays', data: top10.map(([, c]) => c) }],
          }}
          options={{
            indexAxis: 'y',
            plugins: { legend: { display: false } },
            responsive: true,
            maintainAspectRatio: false,
          }}
          height={400}
        />
      )}

      {stats.unlistened?.length > 0 && (
        <p className="mt-6 text-center text-sm text-white/70">
          You’ve covered <strong>{(stats.coverage * 100).toFixed(1)}%</strong> of Spotify’s seed
          genres. A few you haven’t tried yet: {stats.unlistened.slice(0, 5).join(', ')}.
        </p>
      )}
    </section>
  );
}
