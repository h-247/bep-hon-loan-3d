import { describe, it, expect } from 'vitest';
import { roomManager } from '../../src/server/multiplayer/RoomManager';
import { LEVELS } from '../../src/game/levels/LevelCatalog';
import { CHARACTERS } from '../../src/game/characters/CharacterCatalog';
import { AIChefController } from '../../src/game/ai/AIChefController';
import { SimulationEngine } from '../../src/game/simulation/SimulationEngine';

describe('Level and Character Catalog', () => {
  it('has 30 playable levels across 6 worlds', () => {
    expect(LEVELS.length).toBe(30);
    for (let w = 1; w <= 6; w++) {
      const worldLevels = LEVELS.filter((l) => l.worldId === w);
      expect(worldLevels.length).toBe(5);
    }
  });

  it('has at least 12 distinct characters', () => {
    expect(CHARACTERS.length).toBeGreaterThanOrEqual(12);
    const ids = new Set(CHARACTERS.map((c) => c.id));
    expect(ids.size).toBe(CHARACTERS.length);
  });
});

describe('Multiplayer Room Management', () => {
  it('creates room and allows players to join up to maximum capacity', () => {
    const room = roomManager.createRoom({
      roomName: 'Phòng kiểm tra',
      hostName: 'Chủ phòng',
      hostId: 'host_test_1',
      visibility: 'public',
      maximumPlayers: 4,
      selectedLevelId: 'level_1_1',
      difficulty: 'normal',
    });

    expect(room.roomCode).toBeDefined();
    expect(room.currentPlayers).toBe(1);

    // Join second player
    const res2 = roomManager.joinRoom(room.roomCode, {
      id: 'player_2',
      name: 'Người chơi 2',
    });
    expect(res2.success).toBe(true);
    expect(res2.room?.currentPlayers).toBe(2);

    // Join AI chef
    const aiAdded = roomManager.addAIChef(room.roomCode, 'host_test_1');
    expect(aiAdded).toBe(true);

    // Start game
    const started = roomManager.startGame(room.roomCode, 'host_test_1');
    expect(started).toBe(true);
  });
});

describe('AI Chef Controller', () => {
  it('selects active tasks and generates inputs', () => {
    const level = LEVELS[0];
    const engine = new SimulationEngine(level, 'ai', [
      { id: 'player_1', name: 'Người chơi', characterId: 'chef_cat', color: '#ff0000' },
      { id: 'ai_1', name: 'AI Chef', characterId: 'chef_panda', color: '#00ff00', isAI: true },
    ]);
    const aiController = new AIChefController();
    const aiPlayer = engine.state.players['ai_1'];

    const input = aiController.update(aiPlayer, engine.state, 0.05);
    expect(input).toBeDefined();
    expect(typeof input.moveX).toBe('number');
    expect(typeof input.moveY).toBe('number');
  });
});
