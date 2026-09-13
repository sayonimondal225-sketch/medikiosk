import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function BrainCore({ dark }: { dark: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1.25, 3), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.22;
      mesh.current.rotation.x = Math.sin(t * 0.25) * 0.18;
      mesh.current.position.y = Math.sin(t * 0.8) * 0.08;
    }
    if (wire.current) {
      wire.current.rotation.y = -t * 0.12;
      wire.current.rotation.z = t * 0.08;
    }
  });
  return (
    <group>
      <mesh ref={mesh} geometry={geo}>
        <meshPhysicalMaterial
          color={dark ? '#0ea5e9' : '#0d9488'}
          roughness={0.25}
          metalness={0.15}
          transmission={0.55}
          thickness={1.4}
          clearcoat={1}
          clearcoatRoughness={0.25}
          emissive={dark ? '#0c4a6e' : '#ccfbf1'}
          emissiveIntensity={dark ? 0.55 : 0.25}
        />
      </mesh>
      <mesh ref={wire} geometry={geo} scale={1.035}>
        <meshBasicMaterial color={dark ? '#2dd4bf' : '#0f766e'} wireframe transparent opacity={dark ? 0.5 : 0.32} />
      </mesh>
    </group>
  );
}

function Rings({ dark }: { dark: boolean }) {
  const g1 = useRef<THREE.Mesh>(null);
  const g2 = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (g1.current) { g1.current.rotation.x = Math.PI / 2.4 + Math.sin(t * 0.3) * 0.12; g1.current.rotation.z = t * 0.18; }
    if (g2.current) { g2.current.rotation.x = Math.PI / 1.8; g2.current.rotation.y = -t * 0.14; }
  });
  const c = dark ? '#a78bfa' : '#8b5cf6';
  return (
    <group>
      <mesh ref={g1}>
        <torusGeometry args={[2.05, 0.016, 12, 120]} />
        <meshBasicMaterial color={c} transparent opacity={0.75} />
      </mesh>
      <mesh ref={g2}>
        <torusGeometry args={[2.5, 0.01, 12, 120]} />
        <meshBasicMaterial color={dark ? '#38bdf8' : '#0ea5e9'} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Particles({ count, dark }: { count: number; dark: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 3.2;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      arr[i * 3 + 2] = r * Math.cos(ph);
    }
    return arr;
  }, [count]);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.03;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color={dark ? '#5eead4' : '#0d9488'} transparent opacity={0.85} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function HeartPulse({ dark }: { dark: boolean }) {
  const m = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const beat = 1 + Math.max(0, Math.sin(t * 3.2)) * 0.12 + Math.max(0, Math.sin(t * 3.2 - 0.6)) * 0.05;
    if (m.current) {
      m.current.scale.setScalar(0.34 * beat);
      m.current.position.set(2.1, -1.15, 0.4);
      m.current.rotation.y = t * 0.5;
    }
  });
  return (
    <mesh ref={m}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={dark ? '#f472b6' : '#e11d48'} emissive={dark ? '#831843' : '#fecdd3'} emissiveIntensity={dark ? 0.9 : 0.35} roughness={0.3} metalness={0.4} />
    </mesh>
  );
}

export default function Brain3D({ dark, compact = false }: { dark: boolean; compact?: boolean }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const count = compact || isMobile ? 140 : 380;
  return (
    <div className="h-full w-full" aria-hidden>
      <Canvas dpr={[1, isMobile ? 1.5 : 2]} camera={{ position: [0, 0.4, 6.4], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={dark ? 0.7 : 0.95} />
        <directionalLight position={[4, 5, 4]} intensity={dark ? 1.4 : 1.1} color={dark ? '#a5f3fc' : '#ffffff'} />
        <pointLight position={[-4, -2, 3]} intensity={dark ? 22 : 8} color={dark ? '#8b5cf6' : '#14b8a6'} />
        <pointLight position={[3, 2, -2]} intensity={dark ? 14 : 6} color={dark ? '#22d3ee' : '#38bdf8'} />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
            <BrainCore dark={dark} />
          </Float>
          <Rings dark={dark} />
          <Particles count={count} dark={dark} />
          {!isMobile && <HeartPulse dark={dark} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
