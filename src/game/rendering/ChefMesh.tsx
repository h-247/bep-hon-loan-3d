'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlayerState, ChefAction } from '../../types/game';
import { CHARACTERS } from '../characters/CharacterCatalog';
import { Item3DMesh } from './ItemMeshes';

interface ChefMeshProps {
  player: PlayerState;
  isLocalPlayer?: boolean;
}

export const ChefMesh: React.FC<ChefMeshProps> = ({ player, isLocalPlayer }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  const charDef = CHARACTERS.find((c) => c.id === player.characterId) || CHARACTERS[0];
  const playerColor = player.color || '#ef4444';

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smoothly position group at player world coordinates
    // In our 2D grid, x is horizontal, y is vertical grid axis which maps to Z in Three.js!
    groupRef.current.position.x = player.x;
    groupRef.current.position.z = player.y;

    // Smoothly rotate chef towards facing direction
    if (player.facing) {
      const angle = Math.atan2(player.facing.x, player.facing.y);
      groupRef.current.rotation.y = angle;
    }

    const t = state.clock.getElapsedTime();
    const action: ChefAction = player.currentAction || 'idle';

    // 1. Idle animation: gentle squash-and-stretch breathing
    if (action === 'idle') {
      const bob = Math.sin(t * 4) * 0.04;
      if (bodyRef.current) {
        bodyRef.current.position.y = 0.35 + bob;
        bodyRef.current.scale.set(1 + bob * 0.5, 1 - bob * 0.5, 1 + bob * 0.5);
      }
      if (headRef.current) headRef.current.position.y = 0.58 + bob * 0.8;
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(t * 3) * 0.08;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(t * 3) * 0.08;
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
    }

    // 2. Walk / Run / Dash animation: bouncy steps and swinging arms
    if (action === 'run' || action === 'walk' || action === 'dash') {
      const freq = action === 'dash' ? 18 : 12;
      const step = Math.sin(t * freq);
      const bob = Math.abs(Math.sin(t * freq)) * 0.08;

      if (bodyRef.current) {
        bodyRef.current.position.y = 0.35 + bob;
        bodyRef.current.rotation.z = Math.sin(t * (freq / 2)) * 0.05; // Gentle waddle
        bodyRef.current.rotation.x = action === 'dash' ? 0.35 : 0.15; // Lean forward
      }
      if (leftLegRef.current) leftLegRef.current.rotation.x = step * 0.65;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -step * 0.65;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -step * 0.6;
      if (rightArmRef.current) rightArmRef.current.rotation.x = step * 0.6;
    }

    // 3. Chop animation: rapid rhythmic arm chopping
    if (action === 'chop') {
      const chopMotion = Math.sin(t * 18);
      if (bodyRef.current) {
        bodyRef.current.position.y = 0.35 + Math.abs(chopMotion) * 0.03;
        bodyRef.current.rotation.x = 0.15;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.8 + chopMotion * 0.7; // Chop knife down
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = -0.5; // Steadying board
      }
    }

    // 4. Wash animation: back-and-forth scrubbing
    if (action === 'wash') {
      const scrub = Math.sin(t * 14);
      if (leftArmRef.current) leftArmRef.current.rotation.z = 0.3 + scrub * 0.4;
      if (rightArmRef.current) rightArmRef.current.rotation.z = -0.3 - scrub * 0.4;
    }

    // 5. Extinguish animation: holding extinguisher nozzle forward
    if (action === 'extinguish') {
      if (rightArmRef.current) rightArmRef.current.rotation.x = -1.2;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -1.0;
    }

    // 6. Cheer animation: victory jump!
    if (action === 'cheer') {
      const jump = Math.abs(Math.sin(t * 8)) * 0.25;
      if (bodyRef.current) bodyRef.current.position.y = 0.35 + jump;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -2.6;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -2.6;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Selection / Local Player Indicator Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.35, isLocalPlayer ? 0.46 : 0.40, 24]} />
        <meshBasicMaterial
          color={isLocalPlayer ? '#ffffff' : playerColor}
          opacity={isLocalPlayer ? 0.9 : 0.6}
          transparent
        />
      </mesh>

      {/* Main Body Hierarchy */}
      <group ref={bodyRef} position={[0, 0.35, 0]}>
        {/* Torso & Apron */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.32, 16]} />
          <meshStandardMaterial color={charDef.primaryColor} roughness={0.4} />
        </mesh>

        {/* Player Color Apron / Bib */}
        <mesh position={[0, 0, 0.13]}>
          <boxGeometry args={[0.24, 0.26, 0.04]} />
          <meshStandardMaterial color={playerColor} roughness={0.3} />
        </mesh>

        {/* Neckerchief / Bowtie */}
        <mesh position={[0, 0.16, 0.14]}>
          <boxGeometry args={[0.12, 0.06, 0.05]} />
          <meshStandardMaterial color={charDef.accentColor} roughness={0.3} />
        </mesh>

        {/* Big Cartoon Head */}
        <group ref={headRef} position={[0, 0.28, 0]}>
          {/* Head Sphere */}
          <mesh castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.28, 20, 20]} />
            <meshStandardMaterial color={charDef.skinColor} roughness={0.4} />
          </mesh>

          {/* Ears */}
          {charDef.hasEars && charDef.earType === 'cat' && (
            <>
              <mesh position={[-0.18, 0.22, 0]} rotation={[0, 0, 0.4]}>
                <coneGeometry args={[0.1, 0.16, 12]} />
                <meshStandardMaterial color={charDef.primaryColor} />
              </mesh>
              <mesh position={[0.18, 0.22, 0]} rotation={[0, 0, -0.4]}>
                <coneGeometry args={[0.1, 0.16, 12]} />
                <meshStandardMaterial color={charDef.primaryColor} />
              </mesh>
            </>
          )}

          {charDef.hasEars && charDef.earType === 'bear' && (
            <>
              <mesh position={[-0.22, 0.2, 0]}>
                <sphereGeometry args={[0.09, 12, 12]} />
                <meshStandardMaterial color={charDef.primaryColor} />
              </mesh>
              <mesh position={[0.22, 0.2, 0]}>
                <sphereGeometry args={[0.09, 12, 12]} />
                <meshStandardMaterial color={charDef.primaryColor} />
              </mesh>
            </>
          )}

          {charDef.hasEars && charDef.earType === 'bunny' && (
            <>
              <mesh position={[-0.12, 0.36, -0.05]} rotation={[-0.2, 0, -0.1]}>
                <cylinderGeometry args={[0.05, 0.06, 0.32, 12]} />
                <meshStandardMaterial color={charDef.primaryColor} />
              </mesh>
              <mesh position={[0.12, 0.36, -0.05]} rotation={[-0.2, 0, 0.1]}>
                <cylinderGeometry args={[0.05, 0.06, 0.32, 12]} />
                <meshStandardMaterial color={charDef.primaryColor} />
              </mesh>
            </>
          )}

          {/* Eyes */}
          <mesh position={[-0.1, 0.04, 0.25]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.1, 0.04, 0.25]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color="#1e293b" />
          </mesh>

          {/* Eye Sparkles */}
          <mesh position={[-0.09, 0.06, 0.28]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.11, 0.06, 0.28]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Rosy Cheeks */}
          <mesh position={[-0.16, -0.02, 0.22]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshBasicMaterial color="#fb7185" opacity={0.7} transparent />
          </mesh>
          <mesh position={[0.16, -0.02, 0.22]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshBasicMaterial color="#fb7185" opacity={0.7} transparent />
          </mesh>

          {/* Cute Chef Hat */}
          {charDef.hatType === 'tall_toque' && (
            <group position={[0, 0.25, 0]}>
              {/* Hat Base Band */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.22, 0.08, 16]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.3} />
              </mesh>
              {/* Hat Puffed Crown */}
              <mesh position={[0, 0.16, 0]}>
                <cylinderGeometry args={[0.26, 0.2, 0.24, 16]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
              </mesh>
              <mesh position={[0, 0.28, 0]}>
                <sphereGeometry args={[0.24, 16, 12]} />
                <meshStandardMaterial color="#ffffff" roughness={0.2} />
              </mesh>
            </group>
          )}

          {charDef.hatType === 'beret' && (
            <group position={[0.04, 0.26, 0]} rotation={[0, 0, -0.3]}>
              <mesh>
                <cylinderGeometry args={[0.26, 0.18, 0.08, 16]} />
                <meshStandardMaterial color="#ef4444" roughness={0.4} />
              </mesh>
            </group>
          )}

          {charDef.hatType === 'bandana' && (
            <group position={[0, 0.14, 0]}>
              <mesh>
                <torusGeometry args={[0.27, 0.04, 8, 20]} />
                <meshStandardMaterial color={charDef.accentColor} />
              </mesh>
            </group>
          )}

          {charDef.hatType === 'mini_toque' && (
            <group position={[0.08, 0.26, 0]} rotation={[0, 0, -0.2]}>
              <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[0.14, 0.12, 0.16, 14]} />
                <meshStandardMaterial color="#ffffff" />
              </mesh>
            </group>
          )}

          {charDef.hatType === 'baker_cap' && (
            <group position={[0, 0.22, 0]}>
              <mesh>
                <sphereGeometry args={[0.24, 16, 12]} />
                <meshStandardMaterial color="#fef08a" />
              </mesh>
            </group>
          )}
        </group>

        {/* Arms */}
        <group ref={leftArmRef} position={[-0.26, 0.06, 0]}>
          <mesh castShadow position={[0, -0.1, 0.06]}>
            <capsuleGeometry args={[0.06, 0.16, 8, 8]} />
            <meshStandardMaterial color={charDef.primaryColor} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.2, 0.08]}>
            <sphereGeometry args={[0.065, 10, 10]} />
            <meshStandardMaterial color={charDef.skinColor} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.26, 0.06, 0]}>
          <mesh castShadow position={[0, -0.1, 0.06]}>
            <capsuleGeometry args={[0.06, 0.16, 8, 8]} />
            <meshStandardMaterial color={charDef.primaryColor} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.2, 0.08]}>
            <sphereGeometry args={[0.065, 10, 10]} />
            <meshStandardMaterial color={charDef.skinColor} />
          </mesh>
        </group>

        {/* Legs */}
        <group ref={leftLegRef} position={[-0.12, -0.2, 0]}>
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.16, 10]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Shoes */}
          <mesh position={[0, -0.16, 0.04]}>
            <boxGeometry args={[0.09, 0.07, 0.14]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        <group ref={rightLegRef} position={[0.12, -0.2, 0]}>
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.16, 10]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* Shoes */}
          <mesh position={[0, -0.16, 0.04]}>
            <boxGeometry args={[0.09, 0.07, 0.14]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* Held Item Rendered in Front of Chef */}
        {player.heldItem && (
          <group position={[0, 0.05, 0.42]}>
            <Item3DMesh heldItem={player.heldItem} />
          </group>
        )}
      </group>
    </group>
  );
};
