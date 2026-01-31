import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { OrbitControls } from '@react-three/drei'; // 1. Import OrbitControls

import state from '../store';

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    // set the initial position of the model
    let targetPosition = [-0.4, 0, 4];
    if(snap.intro) {
      if(isBreakpoint) targetPosition = [0, 0, 6];
      if(isMobile) targetPosition = [0, 0.2, 6];
    } else {
      if(isMobile) targetPosition = [0, 0, 6]
      else targetPosition = [0, 0, 4];
    }

    // 2. ONLY lock camera position if we are in 'intro' mode.
    // Otherwise, let OrbitControls handle the position.
    if (snap.intro) {
        easing.damp3(state.camera.position, targetPosition, 0.25, delta)
    }

    // 3. We disable the rotation damping (dampE) entirely here.
    // Why? Because OrbitControls handles rotation now. 
    // If we keep this, it will fight your drag.
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, -state.pointer.x / 5, 0],
      0.25,
      delta
    )
  })

  return (
    <group ref={group}>
        {children}
        
        {/* 4. Add OrbitControls. 
            enableZoom={false} prevents scrolling in/out if you don't want that. 
            makeDefault ensures it controls the main camera.
        */}
        <OrbitControls 
            makeDefault 
            enableZoom={true} 
            enablePan={true}
        /> 
    </group>
  )
}

export default CameraRig