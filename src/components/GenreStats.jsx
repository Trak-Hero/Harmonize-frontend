import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';

// one-time registration
Chart.register(BarElement, CategoryScale, LinearScale);

export default function GenreStats({ title = 'Your genre footprint' }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('/api/genre-stats', { withCredentials: true })
         .then(res => setStats(res.data))
         .catch(err => console.warn('genre-stats failed', err));
  }, []);

  if (!stats) return null;

  const top10 = Object.entries(stats.histogram)
                      .sort(([,a],[,b]) => b - a)
                      .slice(0, 10);

  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>

      <Bar
        data={{
          labels: top10.map(([g]) => g),
          datasets: [{ label: 'plays', data: top10.map(([,c]) => c) }]
        }}
        options={{
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          responsive: true,
          maintainAspectRatio: false,
        }}
        height={400}
      />

      <p className="mt-6 text-center text-sm text-white/70">
        You’ve covered <strong>{stats.coverage * 100}%</strong> of Spotify’s seed
        genres. A few you haven’t tried yet: {stats.unlistened.slice(0,5).join(', ')}.
      </p>
    </section>
  );
}
