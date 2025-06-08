import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';
import GenreCloud from './GenreCloud';

Chart.register(BarElement, CategoryScale, LinearScale);

const API = import.meta.env.VITE_API_BASE_URL ?? '';

export default function GenreStats({ title = 'Your Genre Footprint' }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/genre-stats`, { withCredentials: true })
      .then(res => setStats(res.data))
      .catch(err => {
        console.warn('genre-stats failed', err);
        setError('Unable to fetch genre stats.');
      });
  }, []);

  if (error) {
    return (
      <section className="text-center text-red-400 py-8">
        <p>{error}</p>
      </section>
    );
  }

  if (!stats?.histogram) return null;

  const top10 = Object.entries(stats.histogram)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  // generate a soft-pastel colour per bar
  const barColours = top10.map((_, i) => `hsl(${(i * 36) % 360} 70% 55% / .85)`);

  return (
    <section className="max-w-4xl mx-auto px-6 py-10 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-white text-center mb-6">{title}</h2>

      {top10.length === 0 ? (
        <p className="text-center text-white/60">
          No genre data available yet. Try listening to more music!
        </p>
      ) : (
        <>
          <div className="w-full mx-auto h-80">
            <Bar
              data={{
                labels: top10.map(([g]) => g),
                datasets: [
                  {
                    label: 'plays',
                    data: top10.map(([, c]) => c),
                    backgroundColor: barColours,
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: { color: '#ffffff22' },
                    ticks: { color: '#bbb' },
                  },
                  y: {
                    grid: { display: false },
                    ticks: { color: '#bbb' },
                  },
                },
              }}
            />
          </div>

          {stats && (
            <GenreCloud
              histogram={stats.histogram}
              unlistened={stats.unlistened}
            />
          )}
        </>
      )}

      {stats.unlistened?.length > 0 && (
        <p className="mt-4 text-center text-sm text-white/60 italic">
        You’ve covered <strong>{(stats.coverage * 100).toFixed(1)}%</strong> of Spotify’s seed
          genres. A few you haven’t tried yet: {stats.unlistened.slice(0, 5).join(', ')}.
        </p>
      )}
    </section>
  );
}
