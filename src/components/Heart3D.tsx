import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function heartGeometry() {
  const s = new THREE.Shape();
  s.moveTo(25, 25);
  s.bezierCurveTo(25, 25, 20, 0, 0, 0);
  s.bezierCurveTo(-30, 0, -30, 35, -30, 35);
  s.bezierCurveTo(-30, 55, -10, 77, 25, 95);
  s.bezierCurveTo(60, 77, 80, 55, 80, 35);
  s.bezierCurveTo(80, 35, 80, 0, 50, 0);
  s.bezierCurveTo(35, 0, 25, 25, 25, 25);
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 22,
    bevelEnabled: true,
    bevelThickness: 8,
    bevelSize: 8,
    bevelSegments: 4,
    curveSegments: 24,
  });
  geo.center();
  geo.rotateZ(Math.PI); // apex down → upright heart
  geo.scale(0.02, 0.02, 0.02);
  geo.computeVertexNormals();
  return geo;
}

/** Stylized beating heart — lub-dub scale pulse + emissive throb. */
function HeartCore({ dark }: { dark: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshPhysicalMaterial>(null);
  const geo = useMemo(heartGeometry, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const lub = Math.pow(Math.max(0, Math.sin(t * 4.4)), 6);
    const dub = Math.pow(Math.max(0, Math.sin(t * 4.4 - 1.1)), 8);
    const beat = 1 + lub * 0.11 + dub * 0.06;
    if (mesh.current) {
      mesh.current.scale.setScalar(beat);
      mesh.current.rotation.y = Math.sin(t * 0.3) * 0.35 - 0.15;
      mesh.current.position.y = Math.sin(t * 0.9) * 0.06;
    }
    if (wire.current) {
      wire.current.scale.setScalar(beat * 1.035);
      wire.current.rotation.y = mesh.current ? mesh.current.rotation.y : 0;
      wire.current.position.y = mesh.current ? mesh.current.position.y : 0;
    }
    if (mat.current) mat.current.emissiveIntensity = (dark ? 0.55 : 0.28) + lub * (dark ? 0.85 : 0.4);
  });

  return (
    <group>
      <mesh ref={mesh} geometry={geo}>
        <meshPhysicalMaterial
          ref={mat}
          color={dark ? '#fb7185' : '#e11d48'}
          roughness={0.28}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.25}
          emissive={dark ? '#881337' : '#7f1d1d'}
          emissiveIntensity={0.55}
        />
      </mesh>
      <mesh ref={wire} geometry={geo}>
        <meshBasicMaterial color={dark ? '#fda4af' : '#9f1239'} wireframe transparent opacity={dark ? 0.35 : 0.22} />
      </mesh>
    </group>
  );
}

/** Soft pulse-echo rings radiating from the heart. */
function BeatRings({ dark }: { dark: boolean }) {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p1 = (t * 0.55) % 1;
    const p2 = (t * 0.55 + 0.5) % 1;
    if (r1.current) {
      r1.current.scale.setScalar(1.5 + p1 * 1.9);
      (r1.current.material as THREE.MeshBasicMaterial).opacity = (1 - p1) * (dark ? 0.5 : 0.35);
    }
    if (r2.current) {
      r2.current.scale.setScalar(1.5 + p2 * 1.9);
      (r2.current.material as THREE.MeshBasicMaterial).opacity = (1 - p2) * (dark ? 0.5 : 0.35);
    }
  });
  const c = dark ? '#fda4af' : '#e11d48';
  return (
    <group position={[0, 0, -0.9]}>
      <mesh ref={r1}>
        <ringGeometry args={[0.98, 1.0, 72]} />
        <meshBasicMaterial color={c} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={r2}>
        <ringGeometry args={[0.98, 1.0, 72]} />
        <meshBasicMaterial color={c} transparent opacity={0.4} side={THREE.DoubleSide} depthWrite={false} />
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

export default function Heart3D({ dark, compact = false }: { dark: boolean; compact?: boolean }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const canDrag = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  const count = compact || isMobile ? 140 : 380;
  return (
    <div className="h-full w-full" aria-hidden>
      <Canvas dpr={[1, isMobile ? 1.5 : 2]} camera={{ position: [0, 0.4, 6.4], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={dark ? 0.7 : 0.95} />
        <directionalLight position={[4, 5, 4]} intensity={dark ? 1.4 : 1.1} color={dark ? '#ffe4e6' : '#ffffff'} />
        <pointLight position={[-4, -2, 3]} intensity={dark ? 22 : 8} color={dark ? '#8b5cf6' : '#14b8a6'} />
        <pointLight position={[3, 2, -2]} intensity={dark ? 14 : 6} color={dark ? '#fb7185' : '#f43f5e'} />
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
            <HeartCore dark={dark} />
          </Float>
          <BeatRings dark={dark} />
          <Rings dark={dark} />
          <Particles count={count} dark={dark} />
          {canDrag && (
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7}
              minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.7} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
