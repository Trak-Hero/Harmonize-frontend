import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL ?? '';

export default function Galaxy() {
  const dataRef = useRef([]);

  /* fetch genre stats once */
  useEffect(() => {
    axios.get(`${API}/api/genre-stats`, { withCredentials: true })
      .then(res => {
        const { histogram } = res.data;
        dataRef.current = Object.entries(histogram);
      });
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 75], fov: 60 }}>
      <color attach="background" args={['#01010b']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[30, 30, 30]} intensity={1} />
      <GenreStars data={dataRef} />
      <Stars radius={300} depth={60} count={5000} factor={4} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}

/* ───────── genre → star field ───────── */
function GenreStars({ data }) {
  const group = useRef();

  /* animate gentle rotation */
  useFrame((_state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={group}>
      {data.current.map(([genre, count], idx) => {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 20 + Math.random() * 30;           // cluster radius
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        const size = 0.6 + Math.sqrt(count) * 0.4;        // larger = popular
        const color = `hsl(${(idx * 35) % 360} 80% 60%)`;
        return (
          <mesh key={genre} position={[x, y, z]}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
}
