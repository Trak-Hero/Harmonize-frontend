import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL ?? '';

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
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 20 + Math.random() * 30;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const size = 0.6 + Math.sqrt(count) * 0.4;
        const color = `hsl(${(idx * 35) % 360}, 80%, 60%)`;

        return (
          <group key={genre} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[size, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
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
