'use client';

import React from 'react';
import { GameSimulationState } from '../../types/game';
import { ChefMesh } from './ChefMesh';
import { StationMesh } from './StationMeshes';
import { KitchenParticleEffects } from './ParticleEffects';
import { CameraController } from './CameraController';

interface KitchenSceneProps {
  simulationState: GameSimulationState;
  localPlayerId?: string;
  graphicsQuality?: 'low' | 'medium' | 'high';
}

export const KitchenScene: React.FC<KitchenSceneProps> = ({
  simulationState,
  localPlayerId,
  graphicsQuality = 'medium',
}) => {
  const { level, players, stations, pings } = simulationState;
  const shadowEnabled = graphicsQuality !== 'low';

  // Find which station the local player is currently facing to display highlight
  const localPlayer = localPlayerId ? players[localPlayerId] : undefined;
  let highlightedStationKey: string | null = null;
  if (localPlayer) {
    const fx = Math.floor(localPlayer.x + localPlayer.facing.x * 0.85);
    const fy = Math.floor(localPlayer.y + localPlayer.facing.y * 0.85);
    highlightedStationKey = `${fx},${fy}`;
  }

  const themeColors = getThemeColors(level.environmentTheme);

  return (
    <>
      {/* Dynamic Camera Framing */}
      <CameraController width={level.width} height={level.height} />

      {/* Warm Ambient & Directional Lighting */}
      <ambientLight intensity={0.75} color="#fff7ed" />
      <directionalLight
        position={[level.width / 2 + 5, 18, level.height / 2 + 8]}
        intensity={1.2}
        castShadow={shadowEnabled}
        shadow-mapSize-width={graphicsQuality === 'high' ? 2048 : 1024}
        shadow-mapSize-height={graphicsQuality === 'high' ? 2048 : 1024}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-camera-left={-level.width}
        shadow-camera-right={level.width}
        shadow-camera-top={level.height}
        shadow-camera-bottom={-level.height}
      />
      <pointLight
        position={[level.width / 2, 8, level.height / 2]}
        intensity={0.6}
        color="#fed7aa"
      />

      {/* Kitchen Floor Grid */}
      <KitchenFloor
        width={level.width}
        height={level.height}
        tiles={level.tiles}
        colors={themeColors}
      />

      {/* Kitchen Stations */}
      {Object.values(stations).map((station) => (
        <StationMesh
          key={station.id}
          station={station}
          isHighlighted={station.id === stations[highlightedStationKey!]?.id}
        />
      ))}

      {/* Chefs */}
      {Object.values(players).map((player) => (
        <ChefMesh
          key={player.id}
          player={player}
          isLocalPlayer={player.id === localPlayerId}
        />
      ))}

      {/* Particle Systems */}
      <KitchenParticleEffects stations={stations} />

      {/* Multiplayer Pings */}
      {pings.map((ping) => (
        <group key={ping.id} position={[ping.x, 0.2, ping.y]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.45, 16]} />
            <meshBasicMaterial
              color={ping.type === 'fire' ? '#ef4444' : ping.type === 'urgent' ? '#eab308' : '#38bdf8'}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}
    </>
  );
};

function KitchenFloor({
  width,
  height,
  tiles,
  colors,
}: {
  width: number;
  height: number;
  tiles: number[][];
  colors: { tile1: string; tile2: string; wall: string };
}) {
  const elements = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const isObstacle = tiles[y] ? tiles[y][x] !== 0 : true;
      const isAlt = (x + y) % 2 === 0;

      if (!isObstacle) {
        elements.push(
          <mesh
            key={`floor_${x}_${y}`}
            position={[x + 0.5, 0, y + 0.5]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[0.98, 0.98]} />
            <meshStandardMaterial
              color={isAlt ? colors.tile1 : colors.tile2}
              roughness={0.5}
            />
          </mesh>
        );
      }
    }
  }

  return (
    <group>
      {/* Floor Foundation Slab */}
      <mesh position={[width / 2, -0.15, height / 2]} receiveShadow>
        <boxGeometry args={[width + 0.4, 0.3, height + 0.4]} />
        <meshStandardMaterial color={colors.wall} roughness={0.7} />
      </mesh>
      {elements}
    </group>
  );
}

function getThemeColors(theme: string) {
  switch (theme) {
    case 'fast_food':
      return { tile1: '#fee2e2', tile2: '#fecaca', wall: '#991b1b' };
    case 'italian':
      return { tile1: '#ffedd5', tile2: '#fed7aa', wall: '#7c2d12' };
    case 'asian':
      return { tile1: '#fef3c7', tile2: '#fde68a', wall: '#451a03' };
    case 'moving':
      return { tile1: '#e2e8f0', tile2: '#cbd5e1', wall: '#334155' };
    case 'chaotic':
      return { tile1: '#450a0a', tile2: '#7f1d1d', wall: '#1c1917' };
    case 'basic':
    default:
      return { tile1: '#f8fafc', tile2: '#f1f5f9', wall: '#1e293b' };
  }
}
