import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL ?? '';

// Define genre clusters and positions
const genreClusters = {
  Pop: ['pop', 'thai pop', 't-pop', 'k-pop', 'j-pop', 'mandopop', 'c-pop', 'electropop', 'synthpop', 'french pop'],
  Rock: ['rock', 'thai rock', 'indie rock', 'alternative rock', 'punk', 'hard rock', 'classic rock', 'garage rock'],
  Classical: ['classical', 'italian opera', 'indian classical', 'baroque', 'romantic era', 'chamber music'],
  Jazz: ['jazz', 'jazz fusion', 'bossa nova', 'bebop', 'cool jazz', 'smooth jazz'],
  HipHop: ['hip hop', 'rap', 'trap', 'boom bap', 'lo-fi hip hop'],
  Electronic: ['edm', 'house', 'techno', 'trance', 'dubstep', 'ambient', 'drum and bass', 'electro'],
  World: ['arab pop', 'afrobeat', 'reggaeton', 'latin pop', 'dancehall', 'k-ballad'],
  Soundtrack: ['anime', 'city pop', 'film score', 'video game music'],
  Experimental: ['experimental', 'noise', 'avant-garde'],
  Folk: ['folk', 'country', 'bluegrass', 'americana'],
  Soul: ['soul', 'r&b', 'neo soul', 'motown'],
  Metal: ['metal', 'heavy metal', 'death metal', 'black metal'],
  Other: ['spoken word', 'acapella', 'children’s music']
};

const clusterPositions = {
  Pop: [40, 0, 0],
  Rock: [-40, 0, 0],
  Classical: [0, 40, 0],
  Jazz: [0, -40, 0],
  HipHop: [0, 0, 40],
  Electronic: [0, 0, -40],
  World: [30, 30, 30],
  Soundtrack: [-30, 30, 30],
  Experimental: [30, -30, 30],
  Folk: [-30, -30, -30],
  Soul: [30, -30, -30],
  Metal: [-30, 30, -30],
  Other: [0, 0, 0]
};

export default function Galaxy() {
  const [genreData, setGenreData] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/genre-stats`, { withCredentials: true })
      .then(res => {
        const { histogram } = res.data;
        setGenreData(Object.entries(histogram));
      })
      .catch(err => console.error('Failed to load genre stats:', err));
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 75], fov: 60 }}>
      <color attach="background" args={['#01010b']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[30, 30, 30]} intensity={1.2} />
      <GenreStars data={genreData} />
      <Stars radius={300} depth={60} count={5000} factor={4} fade />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}

function GenreStars({ data }) {
  const group = useRef();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={group}>
      {data.map(([genre, count], idx) => {
        const lowerGenre = genre.toLowerCase();
        const cluster = Object.entries(genreClusters).find(([, genres]) => genres.includes(lowerGenre))?.[0] || 'Other';
        const base = clusterPositions[cluster] || [0, 0, 0];

        const spread = 10;
        const offsetX = base[0] + (Math.random() - 0.5) * spread;
        const offsetY = base[1] + (Math.random() - 0.5) * spread;
        const offsetZ = base[2] + (Math.random() - 0.5) * spread;

        const size = 0.6 + Math.sqrt(count) * 0.4;
        const color = `hsl(${(idx * 35) % 360}, 80%, 60%)`;

        return (
          <group key={genre} position={[offsetX, offsetY, offsetZ]}>
            <mesh>
              <sphereGeometry args={[size, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} />
            </mesh>
            <Text
              position={[0, size + 0.5, 0]}
              fontSize={1}
              color="#ffffffcc"
              anchorX="center"
              anchorY="middle"
            >
              {genre}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
