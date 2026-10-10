import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Sparkles, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * A stylized luxury handbag built from primitives:
 * - Rounded leather body
 * - Gold metallic clasp
 * - Arched top handle
 * - Subtle stitching implied via emissive edge sheen
 */
function LuxuryHandbag({
  position,
  rotation = [0, 0, 0],
  scale = 1,
  leather = "#2a1a12",
  accent = "#c9a96e",
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  leather?: string;
  accent?: string;
}) {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.15;
  });

  // Arched handle points
  const handleCurve = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.55, 0.55, 0),
      new THREE.Vector3(-0.5, 1.05, 0),
      new THREE.Vector3(0, 1.25, 0),
      new THREE.Vector3(0.5, 1.05, 0),
      new THREE.Vector3(0.55, 0.55, 0),
    ]);
    return curve;
  }, []);

  return (
    <Float speed={1} rotationIntensity={0.25} floatIntensity={0.9}>
      <group ref={group} position={position} rotation={rotation} scale={scale}>
        {/* Body — supple leather */}
        <RoundedBox args={[1.4, 1.05, 0.55]} radius={0.18} smoothness={6} castShadow>
          <meshPhysicalMaterial
            color={leather}
            roughness={0.55}
            metalness={0.05}
            clearcoat={0.6}
            clearcoatRoughness={0.35}
            sheen={1}
            sheenColor={accent}
            sheenRoughness={0.4}
          />
        </RoundedBox>

        {/* Front flap */}
        <RoundedBox
          args={[1.42, 0.55, 0.02]}
          radius={0.12}
          smoothness={6}
          position={[0, 0.15, 0.29]}
        >
          <meshPhysicalMaterial
            color={leather}
            roughness={0.5}
            metalness={0.05}
            clearcoat={0.7}
            clearcoatRoughness={0.3}
            sheen={1}
            sheenColor={accent}
          />
        </RoundedBox>

        {/* Gold clasp */}
        <mesh position={[0, -0.12, 0.31]}>
          <boxGeometry args={[0.22, 0.12, 0.05]} />
          <meshStandardMaterial
            color={accent}
            metalness={1}
            roughness={0.15}
            envMapIntensity={2.2}
          />
        </mesh>
        <mesh position={[0, -0.12, 0.34]}>
          <cylinderGeometry args={[0.045, 0.045, 0.05, 24]} />
          <meshStandardMaterial color="#f5d488" metalness={1} roughness={0.1} envMapIntensity={2.5} />
        </mesh>

        {/* Arched top handle */}
        <mesh>
          <tubeGeometry args={[handleCurve, 64, 0.035, 12, false]} />
          <meshPhysicalMaterial
            color={leather}
            roughness={0.45}
            metalness={0.1}
            clearcoat={0.8}
          />
        </mesh>

        {/* Handle gold anchors */}
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.55, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
            <meshStandardMaterial color={accent} metalness={1} roughness={0.15} />
          </mesh>
        ))}

        {/* Bottom gold feet */}
        {[[-0.55, -0.5, 0.2], [0.55, -0.5, 0.2], [-0.55, -0.5, -0.2], [0.55, -0.5, -0.2]].map(
          (p, i) => (
            <mesh key={i} position={p as [number, number, number]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color={accent} metalness={1} roughness={0.2} />
            </mesh>
          ),
        )}
      </group>
    </Float>
  );
}

function DisplayPedestal({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Glass display cylinder */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.1, 64]} />
        <meshStandardMaterial color="#f5e9c8" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.95, 1.1, 2.2, 64]} />
        <MeshTransmissionMaterial
          thickness={0.6}
          roughness={0.08}
          transmission={1}
          ior={1.45}
          color="#ffffff"
          backside
        />
      </mesh>
      <mesh position={[0, -2.35, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.12, 64]} />
        <meshStandardMaterial color="#1a1310" metalness={0.4} roughness={0.5} />
      </mesh>
    </group>
  );
}

function ChromeArch({
  position,
  rotation,
  radius = 1.6,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  radius?: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.z += dt * 0.04;
  });
  return (
    <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.4}>
      <mesh ref={ref} position={position} rotation={rotation}>
        <torusGeometry args={[radius, 0.025, 24, 160]} />
        <meshStandardMaterial color="#c9a96e" metalness={1} roughness={0.15} envMapIntensity={2} />
      </mesh>
    </Float>
  );
}

function ParallaxRig() {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame(() => {
    camera.position.x += (pointer.x * 0.7 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.4 - camera.position.y) * 0.04;
    camera.lookAt(target);
  });
  return null;
}

function BoutiqueLighting() {
  const spot = useRef<THREE.SpotLight>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (spot.current) {
      spot.current.position.x = Math.sin(t * 0.12) * 2.5;
    }
  });
  return (
    <>
      <ambientLight intensity={0.18} />
      {/* Key spotlight — boutique showroom */}
      <spotLight
        ref={spot}
        position={[0, 6, 4]}
        angle={0.5}
        penumbra={0.9}
        intensity={140}
        color="#f5d488"
        target-position={[0, 0, 0]}
      />
      {/* Warm fill */}
      <pointLight position={[-5, 1, 3]} intensity={22} color="#c9a96e" />
      {/* Cool rim */}
      <pointLight position={[5, -1, -2]} intensity={18} color="#8fa8ff" />
      {/* Under-lit pedestal glow */}
      <pointLight position={[0, -1.5, 1]} intensity={12} color="#f5e9c8" />
    </>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#0a0705"]} />
      <fog attach="fog" args={["#0a0705", 7, 22]} />
      <BoutiqueLighting />
      <ParallaxRig />

      {/* Hero handbag on center pedestal */}
      <group position={[0, 0.35, -1]}>
        <LuxuryHandbag position={[0, 0.9, 0]} scale={1.15} leather="#2a1a12" accent="#c9a96e" />
        <DisplayPedestal position={[0, -0.2, 0]} />
      </group>

      {/* Floating satellite handbags */}
      <LuxuryHandbag
        position={[-3.6, 1.2, -2]}
        rotation={[0.1, 0.4, -0.05]}
        scale={0.75}
        leather="#3d2418"
        accent="#e8c07a"
      />
      <LuxuryHandbag
        position={[3.6, -0.4, -2.5]}
        rotation={[-0.05, -0.5, 0.08]}
        scale={0.85}
        leather="#1a1a1a"
        accent="#f5d488"
      />
      <LuxuryHandbag
        position={[-2.8, -1.3, -3]}
        rotation={[0.08, 0.9, 0]}
        scale={0.6}
        leather="#5c2018"
        accent="#c9a96e"
      />
      <LuxuryHandbag
        position={[3.2, 1.6, -3.5]}
        rotation={[-0.1, -0.9, 0.06]}
        scale={0.55}
        leather="#e8c5a0"
        accent="#8b6f4e"
      />

      {/* Gold chrome arches — hardware motif */}
      <ChromeArch position={[0, 0.5, -4.5]} rotation={[0, 0, 0]} radius={2.6} />
      <ChromeArch position={[-1.2, 0.8, -3.5]} rotation={[Math.PI / 3, 0.3, 0.2]} radius={1.2} />
      <ChromeArch position={[1.4, -0.3, -3]} rotation={[Math.PI / 2.5, -0.4, 0]} radius={1} />

      {/* Champagne sparkles — light catching on leather */}
      <Sparkles count={120} scale={[14, 8, 8]} size={2.2} speed={0.2} opacity={0.6} color="#f5d488" />
      <Sparkles count={60} scale={[16, 10, 10]} size={1} speed={0.12} opacity={0.4} color="#ffffff" />

      <Environment preset="apartment" environmentIntensity={0.4} />
    </>
  );
}

export function Hero3DScene({ inView = true }: { inView?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={inView ? "always" : "never"}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

export default Hero3DScene;
