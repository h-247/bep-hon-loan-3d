'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Station } from '../../types/game';

export const KitchenParticleEffects: React.FC<{ stations: Record<string, Station> }> = ({ stations }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle animated bobbing for particle groups
    groupRef.current.position.y = Math.sin(t * 3) * 0.02;
  });

  return (
    <group ref={groupRef}>
      {Object.values(stations).map((st) => {
        const isCooking = st.applianceUtensil?.isCooking;
        const isWashing = (st.washProgress ?? 0) > 0;
        const isChopping = (st.chopProgress ?? 0) > 0;

        return (
          <group key={st.id} position={[st.x + 0.5, 0.9, st.y + 0.5]}>
            {/* Steam when cooking */}
            {isCooking && (
              <mesh position={[0, 0.3, 0]}>
                <sphereGeometry args={[0.12, 8, 8]} scale={[1, 1.8, 1]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
              </mesh>
            )}

            {/* Soap bubbles when washing */}
            {isWashing && (
              <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
              </mesh>
            )}

            {/* Sparks / wood chips when chopping */}
            {isChopping && (
              <mesh position={[0, 0.05, 0]}>
                <dodecahedronGeometry args={[0.05]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};
