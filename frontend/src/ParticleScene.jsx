import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const CustomGeometryParticles = (props) => {
  const { count } = props;

  // This reference gives us direct access to our points
  const points = useRef();

  // Generate our positions attributes array
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    const cols = Math.sqrt(count);
    const rows = Math.ceil(count / cols);
    const spacing = 0.2; // distance between particles
    const z = 3; // flat wall at z = 0

    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (i >= count) break;
        const x = (c - cols / 2) * spacing;
        const y = (r - rows / 2) * spacing;
        positions.set([x, y, z], i * 3);
        i++;
      }
    }

    return positions;
  }, [count]);

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="white"
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

const ParticleScene = () => {
  return (
    <div style={{ width: "100vw", height: "50vh" }}>
      <Canvas camera={{ position: [2.5, 2, 10] }}>
        <ambientLight intensity={0.5} />
        <CustomGeometryParticles count={10000} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ParticleScene;
