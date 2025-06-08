import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Legend);

const API = import.meta.env.VITE_API_BASE_URL ?? '';

export default function GenreTimeline() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/genre-timeline`, { withCredentials: true })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('genre-timeline error', err);
        setError('Failed to load chart data.');
        setLoading(false);
      });
  }, []);

  if (!data) return null;

  if (loading) {
    return <p className="text-center text-white text-lg">Loading chart...</p>;
  }
  
  if (error) {
    return <p className="text-center text-red-400">{error}</p>;
  }

  const ranges = ['long_term', 'medium_term', 'short_term']; // correct order

  // Collect all genre names used in any range
  const allGenres = [
    ...new Set(
      Object.values(data)
        .flatMap(range => Object.keys(range))
    ),
  ];

  // Pick top 5–7 genres overall
  const genreTotals = {};
  for (const range of ranges) {
    for (const [genre, count] of Object.entries(data[range])) {
      genreTotals[genre] = (genreTotals[genre] || 0) + count;
    }
  }

  const topGenres = Object.entries(genreTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7)
    .map(([g]) => g);

  const chartData = {
    labels: ['Long-term', 'Medium', 'Recent'],     
    datasets: topGenres.map((genre, i) => ({
    label: genre,
    data: ranges.map(r => data[r][genre] ?? 0),
    borderColor: `hsl(${i * 45}, 80%, 60%)`,
    backgroundColor: `hsl(${i * 45}, 80%, 60%)`,
    fill: false,
    tension: 0.4,
    pointRadius: 5,
    pointHoverRadius: 7,
    })),
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-12 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-white text-center mb-6">
        Genre Progression Over Time
      </h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          padding: {
            top: 10,
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#ddd',
                font: { size: 14, family: 'Afacad' },
                padding: 12,
              },
            },
          },
          scales: {
            x: {
              ticks: { color: '#aaa', font: { size: 14, family: 'Afacad' } },
              grid: { color: '#333' },
            },
            y: {
              title: {
                display: true,
                text: 'Artist Count',
                color: '#aaa',
                font: { size: 14, family: 'Afacad' },
              },
              ticks: { color: '#aaa', font: { size: 14, family: 'Afacad' } },
              grid: { color: '#333' },
            },
          },
        }}
      />
    </section>
  );
}
