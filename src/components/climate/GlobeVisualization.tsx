import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const [heatmapTexture] = useTexture(["/src/assets/heatmap-overlay.jpg"]);

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={earthRef} args={[2, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial
        map={heatmapTexture}
        transparent
        opacity={0.9}
        emissive={new THREE.Color(0x112244)}
        emissiveIntensity={0.1}
      />
    </Sphere>
  );
};

const Atmosphere = () => {
  return (
    <Sphere args={[2.1, 64, 64]} position={[0, 0, 0]}>
      <meshBasicMaterial
        color="#4A90E2"
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </Sphere>
  );
};

interface GlobeVisualizationProps {
  className?: string;
}

const GlobeVisualization = ({ className }: GlobeVisualizationProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={className}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="animate-pulse-glow rounded-full bg-primary/20 p-8">
            <div className="w-16 h-16 rounded-full bg-gradient-climate animate-globe-spin" />
          </div>
        </div>
      )}
      
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        onCreated={() => setIsLoading(false)}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff4444" />
        
        <Earth />
        <Atmosphere />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default GlobeVisualization;