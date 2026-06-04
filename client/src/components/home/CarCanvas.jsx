import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Stage,
  OrbitControls,
  PerspectiveCamera,
  ContactShadows,
  Environment,
  Html,
} from "@react-three/drei";
import { motion } from "framer-motion";

function Model(props) {
  const { scene } = useGLTF(
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/ferrari.glb"
  );
  const modelRef = useRef();

  // Floating animation
  useFrame((state) => {
    if (modelRef.current) {
      const t = state.clock.getElapsedTime();
      modelRef.current.position.y = Math.sin(t / 1.5) / 10;
      modelRef.current.rotation.y += 0.002; // Slow constant rotation
    }
  });

  return <primitive object={scene} ref={modelRef} {...props} />;
}

const Loader = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-yellow-400 text-sm mt-2 font-medium">Loading 3D Model...</p>
    </div>
  </Html>
);

const CarCanvas = () => {
  return (
    <div className="w-full h-[280px] sm:h-[400px] md:h-[500px] lg:h-[600px] cursor-grab active:cursor-grabbing relative">
        {/* Subtle glow effect behind the car */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-yellow-400/10 blur-[120px] rounded-full -z-10" />
      
      <Canvas shadows dpr={[1, 2]} camera={{ position: [5, 2, 5], fov: 45 }}>
        <Suspense fallback={<Loader />}>
          <Stage environment="city" intensity={0.5} contactShadow={false}>
            <Model scale={1} />
          </Stage>
          
          <ContactShadows
            position={[0, -1, 0]}
            opacity={0.4}
            scale={10}
            blur={2.5}
            far={4.5}
          />
          
          <OrbitControls 
            enableZoom={false} 
            autoRotate={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2.2}
          />
          
          <PerspectiveCamera makeDefault position={[4, 1.5, 4]} fov={35} />
          
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload(
  "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/models/gltf/ferrari.glb"
);

export default React.memo(CarCanvas);
