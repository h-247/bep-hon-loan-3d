'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { GameCanvas } from '@/src/game/rendering/GameCanvas';
import { GameHUD } from '@/src/components/game/GameHUD';
import { TouchControls } from '@/src/components/game/TouchControls';
import { SimulationEngine } from '@/src/game/simulation/SimulationEngine';
import { LEVELS } from '@/src/game/levels/LevelCatalog';
import { AIChefController } from '@/src/game/ai/AIChefController';
import { soundManager } from '@/src/game/audio/SoundManager';
import { PlayerInput } from '@/src/game/simulation/PlayerSystem';
import { GameMode, GameSimulationState } from '@/src/types/game';

export default function PlayPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const levelId = searchParams.get('level') || 'level_1_1';
  const mode = (searchParams.get('mode') as GameMode) || 'single';
  const roomCode = searchParams.get('room') || '';

  const [isPaused, setIsPaused] = useState(false);
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [activeChefIndex, setActiveChefIndex] = useState(0);

  // References to keep game loop running smoothly without stale React state closures
  const engineRef = useRef<SimulationEngine | null>(null);
  const aiControllersRef = useRef<Record<string, AIChefController>>({});
  const inputsRef = useRef<Record<string, PlayerInput>>({});
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // UI state for reactive HUD rendering
  const [gameState, setGameState] = useState<GameSimulationState | null>(null);

  // Initialize Level & Engine
  useEffect(() => {
    const level = LEVELS.find((l) => l.id === levelId) || LEVELS[0];

    // Determine player roster based on game mode
    const playerConfigs = [];
    if (mode === 'single') {
      playerConfigs.push({
        id: 'player_1',
        name: 'Đầu bếp Bạn',
        characterId: 'chef_cat',
        color: '#ef4444',
        isAI: false,
      });
    } else if (mode === 'ai') {
      playerConfigs.push({
        id: 'player_1',
        name: 'Đầu bếp Bạn',
        characterId: 'chef_cat',
        color: '#ef4444',
        isAI: false,
      });
      playerConfigs.push({
        id: 'player_ai_1',
        name: 'AI Chef Gấu Trúc',
        characterId: 'chef_panda',
        color: '#3b82f6',
        isAI: true,
      });
      aiControllersRef.current['player_ai_1'] = new AIChefController();
    } else if (mode === 'local') {
      // 2 players on same keyboard
      playerConfigs.push({
        id: 'player_1',
        name: 'Người chơi 1',
        characterId: 'chef_cat',
        color: '#ef4444',
        isAI: false,
      });
      playerConfigs.push({
        id: 'player_2',
        name: 'Người chơi 2',
        characterId: 'chef_fox',
        color: '#3b82f6',
        isAI: false,
      });
    } else {
      // Practice / Online mode default
      playerConfigs.push({
        id: 'player_1',
        name: 'Đầu bếp Bạn',
        characterId: 'chef_cat',
        color: '#ef4444',
        isAI: false,
      });
    }

    const engine = new SimulationEngine(level, mode, playerConfigs);
    engineRef.current = engine;
    setGameState({ ...engine.state });

    // Start background arcade music
    soundManager.startMusic();

    return () => {
      soundManager.stopMusic();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [levelId, mode]);

  // Keyboard Event Listeners for Desktop (Player 1 WASD, Player 2 Arrows)
  useEffect(() => {
    const activeKeys = new Set<string>();

    const updateKeyboardInputs = () => {
      // Player 1: W A S D, E, F, Space, G
      const p1: PlayerInput = {
        moveX: (activeKeys.has('KeyD') ? 1 : 0) - (activeKeys.has('KeyA') ? 1 : 0),
        moveY: (activeKeys.has('KeyS') ? 1 : 0) - (activeKeys.has('KeyW') ? 1 : 0),
        isDashing: activeKeys.has('Space'),
        actionPickDrop: activeKeys.has('KeyE'),
        actionInteract: activeKeys.has('KeyF'),
        actionThrow: activeKeys.has('KeyG'),
      };
      inputsRef.current['player_1'] = p1;

      // Player 2 (Local Co-op): Arrow keys, Enter, Right Shift, Right Ctrl, Right Alt
      if (mode === 'local') {
        const p2: PlayerInput = {
          moveX: (activeKeys.has('ArrowRight') ? 1 : 0) - (activeKeys.has('ArrowLeft') ? 1 : 0),
          moveY: (activeKeys.has('ArrowDown') ? 1 : 0) - (activeKeys.has('ArrowUp') ? 1 : 0),
          isDashing: activeKeys.has('ControlRight'),
          actionPickDrop: activeKeys.has('Enter'),
          actionInteract: activeKeys.has('ShiftRight'),
          actionThrow: activeKeys.has('AltRight'),
        };
        inputsRef.current['player_2'] = p2;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        setIsPaused((prev) => !prev);
        return;
      }

      // Play audio on actions
      if (e.code === 'KeyE') soundManager.playPick();
      if (e.code === 'KeyF') soundManager.playChop();
      if (e.code === 'Space') soundManager.playDash();

      activeKeys.add(e.code);
      updateKeyboardInputs();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeys.delete(e.code);
      updateKeyboardInputs();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [mode]);

  // Main 60 FPS Game Loop
  useEffect(() => {
    let lastRenderSync = 0;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      // Limit dt to prevent huge jumps on tab switch
      const dt = Math.min(0.1, elapsed);

      const engine = engineRef.current;
      if (engine && !isPaused) {
        // Run AI Controller for any AI chefs
        for (const [aiId, controller] of Object.entries(aiControllersRef.current)) {
          const aiPlayer = engine.state.players[aiId];
          if (aiPlayer) {
            inputsRef.current[aiId] = controller.update(aiPlayer, engine.state, dt);
          }
        }

        // Advance simulation
        engine.tick(dt, inputsRef.current);

        // Reset single-frame pulse inputs
        if (inputsRef.current['player_1']) {
          inputsRef.current['player_1'].actionPickDrop = false;
          inputsRef.current['player_1'].actionThrow = false;
        }

        // Sync React HUD state ~15 times a second to keep UI snappy without re-rendering every frame
        if (timestamp - lastRenderSync > 66) {
          lastRenderSync = timestamp;
          setGameState({ ...engine.state });
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused]);

  // Touch controls input handler
  const handleTouchInput = useCallback((input: Partial<PlayerInput>) => {
    const current = inputsRef.current['player_1'] || {
      moveX: 0,
      moveY: 0,
      isDashing: false,
      actionPickDrop: false,
      actionInteract: false,
      actionThrow: false,
    };

    inputsRef.current['player_1'] = {
      ...current,
      ...input,
    };

    if (input.actionPickDrop) soundManager.playPick();
    if (input.actionInteract) soundManager.playChop();
    if (input.isDashing) soundManager.playDash();
  }, []);

  const handleRestart = () => {
    setIsPaused(false);
    const level = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    const engine = new SimulationEngine(level, mode, [
      { id: 'player_1', name: 'Đầu bếp Bạn', characterId: 'chef_cat', color: '#ef4444' },
    ]);
    engineRef.current = engine;
    setGameState({ ...engine.state });
  };

  const handleNextLevel = () => {
    const currentIndex = LEVELS.findIndex((l) => l.id === levelId);
    const nextLevel = LEVELS[(currentIndex + 1) % LEVELS.length];
    router.push(`/play?level=${nextLevel.id}&mode=${mode}`);
  };

  if (!gameState) {
    return (
      <div className="w-full h-dvh flex items-center justify-center bg-[#212121] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="font-semibold text-sm">Đang tải gian bếp...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full h-dvh relative overflow-hidden bg-[#18181b] select-none touch-none">
      {/* 3D WebGL Canvas Scene */}
      <GameCanvas
        simulationState={gameState}
        localPlayerId="player_1"
        graphicsQuality={graphicsQuality}
      />

      {/* Heads-Up Display (Orders, Timer, Score, Dialogs) */}
      <GameHUD
        simulationState={gameState}
        isPaused={isPaused}
        onResumeClick={() => setIsPaused(false)}
        onRestartClick={handleRestart}
        onNextLevelClick={handleNextLevel}
        onExitClick={() => router.push('/')}
        onQuickChatSelect={(msg) => {
          gameState.floatingTexts.push({
            id: `chat_${Date.now()}`,
            text: msg,
            x: gameState.players['player_1']?.x || 3,
            y: gameState.players['player_1']?.y || 3,
            color: '#38bdf8',
            duration: 2.5,
            elapsed: 0,
          });
        }}
      />

      {/* Mobile Touch Controls Layer */}
      <TouchControls
        onInputChange={handleTouchInput}
        onPauseClick={() => setIsPaused((prev) => !prev)}
        onPingClick={() => {
          const p = gameState.players['player_1'];
          if (p) {
            gameState.pings.push({
              id: `ping_${Date.now()}`,
              playerId: p.id,
              playerName: p.name,
              x: p.x + p.facing.x * 1.5,
              y: p.y + p.facing.y * 1.5,
              duration: 3.0,
              elapsed: 0,
              type: 'general',
            });
            soundManager.playClick();
          }
        }}
      />
    </main>
  );
}
