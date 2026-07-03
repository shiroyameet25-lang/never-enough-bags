import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Sparkles, Torus } from "@react-three/drei";
import * as THREE from "three";

/**
 * Performance notes:
 * - Only ONE hero crystal uses the (expensive) MeshTransmissionMaterial; the
 *   rest use cheap physical materials that visually read as glass/metal.
 * - Sparkle counts, dpr, and shadow work kept low to hold 60fps.
 */

function HeroCrystal({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.08;
    ref.current.rotation.y += dt * 0.12;
  });
  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={1.1}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          color="#f5e9c8"
          thickness={1.2}
          roughness={0.06}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropy={0.25}
          distortion={0.15}
          distortionScale={0.35}
          temporalDistortion={0.06}
          samples={6}
          resolution={256}
          backside={false}
        />
      </mesh>
    </Float>
  );
}

function GlassCrystal({ position, scale = 1, color = "#e8d9b0", opacity = 0.55 }: { position: [number, number, number]; scale?: number; color?: string; opacity?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.06;
    ref.current.rotation.y += dt * 0.1;
  });
  return (
    <Float speed={1.05} rotationIntensity={0.35} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.15}
          roughness={0.12}
          transmission={0.6}
          thickness={0.8}
          ior={1.35}
          transparent
          opacity={opacity}
          envMapIntensity={1.6}
        />
      </mesh>
    </Float>
  );
}

function ChromeRing({ position, rotation, radius = 1.6 }: { position: [number, number, number]; rotation: [number, number, number]; radius?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.z += dt * 0.06;
  });
  return (
    <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.55}>
      <Torus ref={ref} args={[radius, 0.028, 24, 128]} position={position} rotation={rotation}>
        <meshStandardMaterial color="#f5e9c8" metalness={1} roughness={0.18} envMapIntensity={2} />
      </Torus>
    </Float>
  );
}

function ParallaxRig() {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame(() => {
    camera.position.x += (pointer.x * 0.8 - camera.position.x) * 0.035;
    camera.position.y += (-pointer.y * 0.55 - camera.position.y) * 0.035;
    camera.lookAt(target);
  });
  return null;
}

function LightRig() {
  const ref = useRef<THREE.SpotLight>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = Math.sin(t * 0.15) * 4;
      ref.current.position.y = 3 + Math.cos(t * 0.2) * 0.8;
    }
  });
  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight ref={ref} position={[3, 4, 5]} angle={0.6} penumbra={1} intensity={80} color="#f5d488" />
      <pointLight position={[-5, -2, 3]} intensity={22} color="#8fa8ff" />
      <pointLight position={[5, -3, -2]} intensity={16} color="#c9a96e" />
    </>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050506"]} />
      <fog attach="fog" args={["#050506", 6, 22]} />
      <LightRig />
      <ParallaxRig />

      {/* One hero transmission crystal — the visual focal point */}
      <HeroCrystal position={[0, -0.1, -4.5]} scale={2} />

      {/* Cheap glass crystals fill the space without tanking perf */}
      <GlassCrystal position={[-3.2, 0.8, -1]} scale={1.1} />
      <GlassCrystal position={[3.5, -0.6, -2]} scale={1.4} color="#f0e0b5" opacity={0.6} />
      <GlassCrystal position={[1.2, 1.8, -3]} scale={0.7} color="#e6d29a" opacity={0.5} />
      <GlassCrystal position={[-2, -1.6, -2.5]} scale={0.9} color="#efe4c2" opacity={0.55} />

      {/* Chrome rings */}
      <ChromeRing position={[2.4, 0.4, -2]} rotation={[Math.PI / 3, 0, 0.3]} radius={1.4} />
      <ChromeRing position={[-2.8, -0.5, -1.5]} rotation={[Math.PI / 2.5, 0.4, 0]} radius={1.1} />
      <ChromeRing position={[0.5, 1.5, -4]} rotation={[Math.PI / 4, 0.6, 0.2]} radius={2} />

      {/* Particles — leaner counts */}
      <Sparkles count={70} scale={[14, 8, 8]} size={2.2} speed={0.22} opacity={0.65} color="#f5d488" />
      <Sparkles count={40} scale={[16, 10, 10]} size={1} speed={0.14} opacity={0.45} color="#ffffff" />

      <Environment preset="warehouse" environmentIntensity={0.35} />
    </>
  );
}

export function Hero3DScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

export default Hero3DScene;
