import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, Sparkles, Torus } from "@react-three/drei";
import * as THREE from "three";

function Crystal({ position, scale = 1, color = "#e8d9b0" }: { position: [number, number, number]; scale?: number; color?: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.08;
    ref.current.rotation.y += dt * 0.12;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={ref} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          color={color}
          thickness={1.4}
          roughness={0.05}
          transmission={1}
          ior={1.5}
          chromaticAberration={0.08}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.4}
          temporalDistortion={0.1}
          backside
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
    <Float speed={0.7} rotationIntensity={0.2} floatIntensity={0.6}>
      <Torus ref={ref} args={[radius, 0.03, 32, 200]} position={position} rotation={rotation}>
        <meshStandardMaterial color="#f5e9c8" metalness={1} roughness={0.15} envMapIntensity={2} />
      </Torus>
    </Float>
  );
}

function GlassPanel({ position, rotation, size }: { position: [number, number, number]; rotation: [number, number, number]; size: [number, number] }) {
  return (
    <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.5}>
      <mesh position={position} rotation={rotation}>
        <planeGeometry args={size} />
        <MeshTransmissionMaterial
          thickness={0.4}
          roughness={0.1}
          transmission={1}
          ior={1.3}
          color="#ffffff"
          backside
        />
      </mesh>
    </Float>
  );
}

function ParallaxRig() {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  useFrame(() => {
    camera.position.x += (pointer.x * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(target);
  });
  return null;
}

function LightRays() {
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
      <ambientLight intensity={0.25} />
      <spotLight
        ref={ref}
        position={[3, 4, 5]}
        angle={0.6}
        penumbra={1}
        intensity={90}
        color="#f5d488"
        castShadow={false}
      />
      <pointLight position={[-5, -2, 3]} intensity={30} color="#8fa8ff" />
      <pointLight position={[5, -3, -2]} intensity={20} color="#c9a96e" />
    </>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={["#050506"]} />
      <fog attach="fog" args={["#050506", 6, 22]} />
      <LightRays />
      <ParallaxRig />

      {/* Crystals */}
      <Crystal position={[-3.2, 0.8, -1]} scale={1.1} />
      <Crystal position={[3.5, -0.6, -2]} scale={1.4} color="#f0e0b5" />
      <Crystal position={[1.2, 1.8, -3]} scale={0.7} color="#e6d29a" />
      <Crystal position={[-2, -1.6, -2.5]} scale={0.9} color="#efe4c2" />
      <Crystal position={[0, -0.2, -5]} scale={2} color="#f5e9c8" />

      {/* Chrome rings */}
      <ChromeRing position={[2.4, 0.4, -2]} rotation={[Math.PI / 3, 0, 0.3]} radius={1.4} />
      <ChromeRing position={[-2.8, -0.5, -1.5]} rotation={[Math.PI / 2.5, 0.4, 0]} radius={1.1} />
      <ChromeRing position={[0.5, 1.5, -4]} rotation={[Math.PI / 4, 0.6, 0.2]} radius={2} />

      {/* Glass panels */}
      <GlassPanel position={[-4, 1.5, -3]} rotation={[0, 0.4, 0.2]} size={[1.4, 2]} />
      <GlassPanel position={[4.2, -1.2, -3.5]} rotation={[0, -0.5, -0.15]} size={[1.2, 1.8]} />

      {/* Premium particles */}
      <Sparkles count={140} scale={[14, 8, 8]} size={2.4} speed={0.25} opacity={0.7} color="#f5d488" />
      <Sparkles count={80} scale={[16, 10, 10]} size={1.2} speed={0.15} opacity={0.5} color="#ffffff" />

      <Environment preset="warehouse" environmentIntensity={0.35} />
    </>
  );
}

export function Hero3DScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
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
