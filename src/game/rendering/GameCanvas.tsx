'use client';

import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { GameSimulationState } from '../../types/game';
import { KitchenScene } from './KitchenScene';

interface GameCanvasProps {
  simulationState: GameSimulationState;
  localPlayerId?: string;
  graphicsQuality?: 'low' | 'medium' | 'high';
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  simulationState,
  localPlayerId,
  graphicsQuality = 'medium',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#212121] text-[#a3a3a3]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-sm font-medium">Đang tải không gian 3D...</span>
        </div>
      </div>
    );
  }

  const dpr = graphicsQuality === 'low' ? 1.0 : graphicsQuality === 'medium' ? 1.5 : 2.0;

  return (
    <div className="w-full h-full relative select-none touch-none overflow-hidden bg-[#18181b]">
      <Canvas
        orthographic
        camera={{
          position: [0, 15, 12],
          zoom: 40,
          near: 0.1,
          far: 100,
        }}
        dpr={dpr}
        shadows={graphicsQuality !== 'low'}
        gl={{
          antialias: graphicsQuality !== 'low',
          powerPreference: 'high-performance',
          alpha: false,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <color attach="background" args={['#18181b']} />
        <KitchenScene
          simulationState={simulationState}
          localPlayerId={localPlayerId}
          graphicsQuality={graphicsQuality}
        />
      </Canvas>
    </div>
  );
};
