'use client';

import React from 'react';
import { Station, StationType } from '../../types/game';
import { Item3DMesh, IngredientMesh, UtensilMesh } from './ItemMeshes';

interface StationMeshProps {
  station: Station;
  isHighlighted?: boolean;
}

export const StationMesh: React.FC<StationMeshProps> = ({ station, isHighlighted }) => {
  const x = station.x;
  const z = station.y;

  return (
    <group position={[x + 0.5, 0, z + 0.5]}>
      {/* Station Base Geometry */}
      {renderStationBase(station.type, station)}

      {/* Item Placed on Station */}
      {station.item && (
        <group position={[0, 0.85, 0]}>
          <Item3DMesh heldItem={station.item} />
        </group>
      )}

      {/* Appliance Utensil on Cooking Station (Pan / Pot on Stove) */}
      {station.applianceUtensil && (
        <group position={[0, 0.84, 0]}>
          <UtensilMesh utensil={station.applianceUtensil} />
        </group>
      )}

      {/* Progress Bars (Chopping, Cooking, Washing) */}
      <StationProgressBar station={station} />

      {/* Fire Visual Effects */}
      {station.onFire && <FireParticleMesh />}

      {/* Highlight Outline when Player Approaches */}
      {isHighlighted && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.04, 1.04]} />
          <meshBasicMaterial color="#facc15" wireframe transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

function renderStationBase(type: StationType, station: Station) {
  switch (type) {
    case 'counter':
      return (
        <group>
          {/* Cabinet Base */}
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.96, 0.8, 0.96]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
          </mesh>
          {/* Wooden / Steel Countertop */}
          <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
            <boxGeometry args={[1.0, 0.08, 1.0]} />
            <meshStandardMaterial color="#b45309" roughness={0.4} />
          </mesh>
        </group>
      );

    case 'crate':
      return (
        <group>
          {/* Wooden Crate Box */}
          <mesh castShadow receiveShadow position={[0, 0.36, 0]}>
            <boxGeometry args={[0.92, 0.72, 0.92]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {/* Rim slats */}
          <mesh position={[0, 0.74, 0]}>
            <boxGeometry args={[0.96, 0.08, 0.96]} />
            <meshStandardMaterial color="#92400e" roughness={0.7} />
          </mesh>
          {/* Displayed Produce inside crate */}
          {station.crateIngredient && (
            <group position={[0, 0.82, 0]}>
              <IngredientMesh
                ingredient={{
                  id: 'preview',
                  type: station.crateIngredient,
                  state: 'raw',
                  chopProgress: 0,
                  cookProgress: 0,
                }}
                scale={0.9}
              />
            </group>
          )}
        </group>
      );

    case 'cutting_board':
      return (
        <group>
          {/* Counter base */}
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.96, 0.8, 0.96]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.5} />
          </mesh>
          {/* Butcher Block Cutting Board */}
          <mesh castShadow receiveShadow position={[0, 0.82, 0]}>
            <boxGeometry args={[0.8, 0.05, 0.75]} />
            <meshStandardMaterial color="#d97706" roughness={0.6} />
          </mesh>
          {/* Chef Knife Prop */}
          <mesh position={[0.34, 0.85, 0]} rotation={[0, 0.2, 0]}>
            <boxGeometry args={[0.06, 0.02, 0.28]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
        </group>
      );

    case 'stove':
      return (
        <group>
          {/* Stainless Steel Stove Body */}
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.96, 0.8, 0.96]} />
            <meshStandardMaterial color="#334155" roughness={0.3} metalness={0.7} />
          </mesh>
          {/* Heating Burner Ring */}
          <mesh position={[0, 0.81, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.16, 0.32, 20]} />
            <meshStandardMaterial
              color={station.applianceUtensil?.isCooking ? '#ef4444' : '#1e293b'}
              emissive={station.applianceUtensil?.isCooking ? '#f87171' : '#000000'}
              emissiveIntensity={station.applianceUtensil?.isCooking ? 0.6 : 0}
            />
          </mesh>
          {/* Dials */}
          <mesh position={[0, 0.68, 0.49]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 10]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      );

    case 'oven':
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
            <boxGeometry args={[0.96, 0.9, 0.96]} />
            <meshStandardMaterial color="#475569" roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Glass Door Window with interior glow */}
          <mesh position={[0, 0.45, 0.49]}>
            <planeGeometry args={[0.68, 0.5]} />
            <meshStandardMaterial
              color="#ea580c"
              emissive="#f97316"
              emissiveIntensity={station.applianceUtensil?.isCooking ? 0.8 : 0.1}
            />
          </mesh>
        </group>
      );

    case 'deep_fryer':
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.96, 0.8, 0.96]} />
            <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Oil Vat */}
          <mesh position={[0, 0.81, 0]}>
            <boxGeometry args={[0.65, 0.02, 0.65]} />
            <meshStandardMaterial color="#ca8a04" roughness={0.2} />
          </mesh>
        </group>
      );

    case 'sink':
      return (
        <group>
          {/* Cabinet Base */}
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.96, 0.8, 0.96]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} />
          </mesh>
          {/* Basin Cavity */}
          <mesh position={[0, 0.78, 0]}>
            <boxGeometry args={[0.7, 0.14, 0.7]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.2} transparent opacity={0.7} />
          </mesh>
          {/* Chrome Gooseneck Faucet */}
          <group position={[0, 0.82, -0.32]}>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.3, 10]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.28, 0.08]} rotation={[0.8, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.16, 10]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
          {/* Dirty Plates Stack */}
          {(station.dirtyPlateCount ?? 0) > 0 && (
            <group position={[-0.15, 0.85, 0.1]}>
              <mesh>
                <cylinderGeometry args={[0.22, 0.2, 0.08, 14]} />
                <meshStandardMaterial color="#a8a29e" />
              </mesh>
            </group>
          )}
          {/* Clean Plates Stack */}
          {(station.cleanPlateCount ?? 0) > 0 && (
            <group position={[0.18, 0.85, 0.1]}>
              <mesh>
                <cylinderGeometry args={[0.22, 0.2, 0.08, 14]} />
                <meshStandardMaterial color="#f8fafc" />
              </mesh>
            </group>
          )}
        </group>
      );

    case 'plate_dispenser':
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.96, 0.8, 0.96]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
          </mesh>
          {/* Circular Plate Well */}
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.04, 20]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
          {/* Plate Stack */}
          <group position={[0, 0.88, 0]}>
            <mesh>
              <cylinderGeometry args={[0.26, 0.24, 0.12, 18]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.2} />
            </mesh>
          </group>
        </group>
      );

    case 'serving_window':
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.96, 0.8, 0.96]} />
            <meshStandardMaterial color="#0284c7" roughness={0.3} />
          </mesh>
          {/* Counter Runner */}
          <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[0.98, 0.06, 0.98]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          {/* Service Bell */}
          <mesh position={[0.32, 0.88, 0.25]}>
            <sphereGeometry args={[0.07, 12, 8]} scale={[1, 0.7, 1]} />
            <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      );

    case 'trash':
      return (
        <group>
          {/* Trash Can Body */}
          <mesh castShadow receiveShadow position={[0, 0.36, 0]}>
            <cylinderGeometry args={[0.34, 0.28, 0.72, 16]} />
            <meshStandardMaterial color="#166534" roughness={0.6} />
          </mesh>
          {/* Foot Pedal */}
          <mesh position={[0, 0.06, 0.32]}>
            <boxGeometry args={[0.12, 0.04, 0.12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.6} />
          </mesh>
        </group>
      );

    case 'extinguisher_stand':
      return (
        <group>
          <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
            <boxGeometry args={[0.96, 0.8, 0.96]} />
            <meshStandardMaterial color="#dc2626" roughness={0.4} />
          </mesh>
          {/* White Cross / Flame Symbol */}
          <mesh position={[0, 0.4, 0.49]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      );

    default:
      return null;
  }
}

function StationProgressBar({ station }: { station: Station }) {
  // Check if station has chopping, cooking, or washing progress
  let progress = 0;
  let barColor = '#3b82f6';

  if ((station.chopProgress ?? 0) > 0 && station.chopProgress! < 1.0) {
    progress = station.chopProgress!;
    barColor = '#eab308';
  } else if ((station.washProgress ?? 0) > 0 && station.washProgress! < 1.0) {
    progress = station.washProgress!;
    barColor = '#38bdf8';
  } else if (station.applianceUtensil && station.applianceUtensil.isCooking) {
    progress = Math.min(1.0, station.applianceUtensil.cookProgress);
    if (station.applianceUtensil.cookProgress >= 1.0) {
      barColor = '#22c55e'; // Cooked ready!
    } else {
      barColor = '#f97316'; // Cooking
    }
    if (station.applianceUtensil.cookProgress > 1.5) {
      barColor = '#ef4444'; // Burning alarm!
    }
  }

  if (progress <= 0) return null;

  return (
    <group position={[0, 1.25, 0]}>
      {/* Background Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.62, 0.1, 0.04]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>
      {/* Filled Progress Bar */}
      <mesh position={[(progress - 1) * 0.28, 0, 0.01]}>
        <boxGeometry args={[0.58 * progress, 0.07, 0.04]} />
        <meshBasicMaterial color={barColor} />
      </mesh>
    </group>
  );
}

function FireParticleMesh() {
  return (
    <group position={[0, 0.95, 0]}>
      {/* Flame Core */}
      <mesh>
        <coneGeometry args={[0.26, 0.6, 10]} />
        <meshBasicMaterial color="#ef4444" />
      </mesh>
      {/* Flame Inner Glow */}
      <mesh position={[0, 0.06, 0]}>
        <coneGeometry args={[0.16, 0.45, 10]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>
    </group>
  );
}
