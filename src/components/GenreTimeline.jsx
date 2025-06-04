import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Legend);

const API = import.meta.env.VITE_API_BASE_URL ?? '';

export default function GenreTimeline() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/api/genre-timeline`, { withCredentials: true })
      .then(res => setData(res.data))
      .catch(err => console.error('genre-timeline error', err));
  }, []);

  if (!data) return null;

  const ranges = ['short_term', 'medium_term', 'long_term'];

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
    labels: ['Recent', 'Medium', 'Long-term'],
    datasets: topGenres.map((genre, i) => ({
      label: genre,
      data: ranges.map(r => data[r][genre] ?? 0),
      borderColor: `hsl(${i * 45}, 80%, 60%)`,
      backgroundColor: `hsl(${i * 45}, 80%, 60%)`,
      fill: false,
      tension: 0.4,
    })),
  };

  return (
    <section className="max-w-4xl mx-auto mt-16 px-4">
      <h2 className="text-2xl font-bold text-white text-center mb-4">
        Genre Progression Over Time
      </h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              labels: { color: '#ccc' },
            },
          },
          scales: {
            x: {
              ticks: { color: '#aaa' },
              grid: { color: '#333' },
            },
            y: {
              ticks: { color: '#aaa' },
              grid: { color: '#333' },
            },
          },
        }}
      />
    </section>
  );
}
