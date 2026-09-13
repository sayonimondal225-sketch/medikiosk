import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/** Window grid anchors for tower + wing fronts. */
function useWindowPoints() {
  return useMemo(() => {
    const pts: { pos: [number, number, number]; lit: boolean }[] = [];
    [-1.35, -0.95, -0.55, -0.15].forEach((x, c) =>
      [0.95, 1.5, 2.05, 2.6, 3.05].forEach((y, r) =>
        pts.push({ pos: [x, y, 0.47], lit: (r * 7 + c * 3) % 4 !== 0 })
      )
    );
    [0.7, 1.075, 1.45, 1.825, 2.2].forEach((x, c) =>
      [0.65, 1.2].forEach((y, r) =>
        pts.push({ pos: [x, y, 1.02], lit: (r * 5 + c * 2) % 3 !== 0 })
      )
    );
    return pts;
  }, []);
}

function Hospital({ dark }: { dark: boolean }) {
  const group = useRef<THREE.Group>(null);
  const windows = useRef<THREE.InstancedMesh>(null);
  const crossMat = useRef<THREE.MeshStandardMaterial>(null);
  const crossLight = useRef<THREE.PointLight>(null);
  const barRed = useRef<THREE.MeshStandardMaterial>(null);
  const barBlue = useRef<THREE.MeshStandardMaterial>(null);
  const pts = useWindowPoints();

  const litColor = useMemo(() => new THREE.Color(dark ? '#ffd166' : '#0ea5e9'), [dark]);
  const unlitColor = useMemo(() => new THREE.Color(dark ? '#0f172a' : '#e2e8f0'), [dark]);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    pts.forEach((w, i) => {
      dummy.position.set(...w.pos);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      windows.current?.setMatrixAt(i, dummy.matrix);
      windows.current?.setColorAt(i, w.lit ? litColor : unlitColor);
    });
    if (windows.current) {
      windows.current.instanceMatrix.needsUpdate = true;
      if (windows.current.instanceColor) windows.current.instanceColor.needsUpdate = true;
    }
  }, [pts, litColor, unlitColor]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) group.current.rotation.y = t * 0.12;
    const blink = Math.sin(t * 4);
    if (crossMat.current) crossMat.current.emissiveIntensity = 1.6 + blink * 1.0;
    if (crossLight.current) crossLight.current.intensity = (dark ? 10 : 4) + blink * (dark ? 5 : 2);
    const phase = Math.sin(t * 6) > 0;
    if (barRed.current) barRed.current.emissiveIntensity = phase ? 2.4 : 0.25;
    if (barBlue.current) barBlue.current.emissiveIntensity = phase ? 0.25 : 2.4;
  });

  const towerBody = dark ? '#1e293b' : '#f1f5f9';
  const slab = dark ? '#0b1220' : '#ffffff';
  const glass = dark ? '#0e7490' : '#164e63';
  const wingBody = dark ? '#334155' : '#e8eef4';

  return (
    <group ref={group}>
      {/* platform */}
      <mesh position={[0, -0.13, 0]}>
        <cylinderGeometry args={[3.7, 3.85, 0.26, 48]} />
        <meshStandardMaterial color={dark ? '#0b1220' : '#dbe4ec'} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.7, 0.028, 10, 96]} />
        <meshBasicMaterial color={dark ? '#2dd4bf' : '#0d9488'} transparent opacity={0.8} />
      </mesh>

      {/* main tower: lobby + glass shaft + floor slabs */}
      <mesh position={[-0.7, 0.28, -0.4]}>
        <boxGeometry args={[1.9, 0.56, 1.9]} />
        <meshStandardMaterial color={slab} roughness={0.7} />
      </mesh>
      <mesh position={[-0.7, 2.0, -0.4]}>
        <boxGeometry args={[1.7, 3.0, 1.7]} />
        <meshStandardMaterial color={glass} roughness={0.25} metalness={0.55} emissive={dark ? '#083344' : '#000000'} emissiveIntensity={dark ? 0.7 : 0} />
      </mesh>
      {[0.62, 1.17, 1.72, 2.27, 2.82, 3.37].map((y) => (
        <mesh key={y} position={[-0.7, y, -0.4]}>
          <boxGeometry args={[1.88, 0.07, 1.88]} />
          <meshStandardMaterial color={towerBody} roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[-0.7, 3.56, -0.4]}>
        <boxGeometry args={[2.0, 0.12, 2.0]} />
        <meshStandardMaterial color={slab} roughness={0.7} />
      </mesh>

      {/* glowing red cross on the roof */}
      <group position={[-0.7, 4.05, -0.4]}>
        <mesh>
          <boxGeometry args={[0.2, 0.72, 0.2]} />
          <meshStandardMaterial ref={crossMat} color="#ef4444" emissive="#dc2626" emissiveIntensity={1.6} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.56, 0.2, 0.2]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={1.6} />
        </mesh>
        <pointLight ref={crossLight} color="#ef4444" intensity={10} distance={7} />
      </group>

      {/* lit windows */}
      <instancedMesh ref={windows} args={[undefined, undefined, pts.length]}>
        <boxGeometry args={[0.24, 0.3, 0.03]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* side wing */}
      <mesh position={[1.45, 0.8, 0.25]}>
        <boxGeometry args={[2.1, 1.6, 1.5]} />
        <meshStandardMaterial color={wingBody} roughness={0.8} />
      </mesh>
      <mesh position={[1.45, 1.63, 0.25]}>
        <boxGeometry args={[2.16, 0.07, 1.56]} />
        <meshStandardMaterial color={slab} roughness={0.8} />
      </mesh>

      {/* helipad */}
      <mesh position={[1.45, 1.7, 0.25]}>
        <cylinderGeometry args={[0.55, 0.55, 0.05, 32]} />
        <meshStandardMaterial color={dark ? '#020617' : '#475569'} roughness={0.9} />
      </mesh>
      <mesh position={[1.45, 1.73, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.025, 8, 48]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>

      {/* entrance canopy + pillars + door + steps */}
      <mesh position={[-0.7, 0.78, 0.85]}>
        <boxGeometry args={[1.5, 0.09, 0.75]} />
        <meshStandardMaterial color={slab} roughness={0.7} />
      </mesh>
      {[[-1.32], [-0.08]].map(([x]) => (
        <mesh key={x} position={[x, 0.38, 1.12]}>
          <cylinderGeometry args={[0.05, 0.05, 0.76, 12]} />
          <meshStandardMaterial color={dark ? '#64748b' : '#94a3b8'} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[-0.7, 0.36, 0.46]}>
        <boxGeometry args={[0.72, 0.6, 0.04]} />
        <meshStandardMaterial color={dark ? '#020617' : '#0f172a'} roughness={0.4} />
      </mesh>
      <mesh position={[-0.7, 0.05, 0.75]}>
        <boxGeometry args={[1.3, 0.1, 0.5]} />
        <meshStandardMaterial color={dark ? '#1e293b' : '#cbd5e1'} roughness={0.9} />
      </mesh>

      {/* ambulance */}
      <group position={[-2.35, 0, 1.7]} rotation={[0, 0.55, 0]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.2, 0.55, 0.55]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        <mesh position={[0.78, 0.47, 0]}>
          <boxGeometry args={[0.36, 0.4, 0.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        <mesh position={[0.8, 0.5, 0.0]}>
          <boxGeometry args={[0.3, 0.2, 0.52]} />
          <meshStandardMaterial color={dark ? '#0ea5e9' : '#0c4a6e'} roughness={0.2} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[1.22, 0.12, 0.57]} />
          <meshStandardMaterial color="#dc2626" emissive="#7f1d1d" emissiveIntensity={dark ? 0.8 : 0.2} />
        </mesh>
        {[[-0.4, 0.29], [0.4, 0.29], [-0.4, -0.29], [0.4, -0.29]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.16, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[-0.15, 0.95, 0]}>
          <boxGeometry args={[0.16, 0.09, 0.16]} />
          <meshStandardMaterial ref={barRed} color="#ef4444" emissive="#ef4444" emissiveIntensity={2} />
        </mesh>
        <mesh position={[0.12, 0.95, 0]}>
          <boxGeometry args={[0.16, 0.09, 0.16]} />
          <meshStandardMaterial ref={barBlue} color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.25} />
        </mesh>
      </group>

      {/* trees */}
      {[[2.75, -1.3], [-2.6, -1.6], [3.0, 1.3]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.06, 0.09, 0.5, 8]} />
            <meshStandardMaterial color="#92400e" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.72, 0]}>
            <icosahedronGeometry args={[0.36, 0]} />
            <meshStandardMaterial color={dark ? '#059669' : '#16a34a'} roughness={0.8} flatShading />
          </mesh>
        </group>
      ))}

      {/* lamp posts */}
      {[[-2.1, 0.1], [2.5, -0.5]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.4, 8]} />
            <meshStandardMaterial color={dark ? '#64748b' : '#475569'} roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.45, 0]}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color="#fef3c7" emissive="#f59e0b" emissiveIntensity={dark ? 2.2 : 0.6} />
          </mesh>
        </group>
      ))}
      <pointLight position={[-0.7, 1.6, 1.6]} color="#ffd166" intensity={dark ? 6 : 2} distance={7} />
    </group>
  );
}

function Particles({ count, dark }: { count: number; dark: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3.2 + Math.random() * 3.4;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.7 + 0.4;
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    return arr;
  }, [count]);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.025;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={dark ? '#5eead4' : '#0d9488'} transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function Hospital3D({ dark, compact = false }: { dark: boolean; compact?: boolean }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const canDrag = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  const count = compact || isMobile ? 120 : 300;
  return (
    <div className="h-full w-full" aria-hidden>
      <Canvas dpr={[1, isMobile ? 1.5 : 2]} camera={{ position: [5.4, 3.6, 7.0], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={dark ? 0.65 : 1.0} />
        <directionalLight position={[4, 6, 3]} intensity={dark ? 1.1 : 1.4} color="#ffffff" />
        <pointLight position={[-5, 2, -3]} intensity={dark ? 18 : 6} color={dark ? '#8b5cf6' : '#14b8a6'} />
        <Suspense fallback={null}>
          <Hospital dark={dark} />
          <Particles count={count} dark={dark} />
          {canDrag && (
            <OrbitControls enableZoom={false} enablePan={false} target={[0, 1.5, 0]}
              minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.15} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
