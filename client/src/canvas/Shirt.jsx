import React from "react";
import * as THREE from "three";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";

import state from "../store";

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF("/Fishermen's Tea.gltf");

  // Debug: log available nodes and materials
  console.log("Available nodes:", nodes);
  console.log("Available materials:", materials);

  // Get first available mesh
  const meshNode = Object.values(nodes).find(node => node.geometry);
  const materialKey = Object.keys(materials)[0];
  
  if (!meshNode || !materialKey) {
    console.error("No mesh or material found in model");
    return null;
  }


  const fullTexture = useTexture(snap.fullDecal);
  let aspectRatio = 1;
  if (fullTexture.image) {
    aspectRatio = fullTexture.image.naturalWidth / fullTexture.image.naturalHeight;
  }

  // 🔑 convert hex → THREE.Color ONCE
  const targetColor = new THREE.Color(snap.color);

  useFrame((_, delta) => {
    if (materials[materialKey].color) {
      easing.dampC(materials[materialKey].color, targetColor, 0.25, delta);
    }
  });

  return (
    <group>
      <mesh
        castShadow
        geometry={meshNode.geometry}
        material={materials[materialKey]}
        material-roughness={0.3}
        material-metalness={0.8}
        dispose={null}
        position={[0, .0, 0]}
        scale={0.2}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {snap.isFullTexture && fullTexture && (
          <Decal
            position={[0, -0.5, 3]}
            rotation={[0, 0, 0]}
            scale={[2 * aspectRatio, 2, 1]}
            map={fullTexture}
          />
        )}
  


      </mesh>
    </group>
  );
};

export default Shirt;
