import { MultiplayerRoomInfo, MultiplayerMemberInfo, ClientInputPacket, ServerStateSnapshot, GameNetworkEvent } from '../../types/multiplayer';
import { SimulationEngine } from '../../game/simulation/SimulationEngine';
import { LEVELS } from '../../game/levels/LevelCatalog';
import { PLAYER_COLORS } from '../../game/characters/CharacterCatalog';

export interface ActiveRoom {
  info: MultiplayerRoomInfo;
  password?: string;
  engine?: SimulationEngine;
  inputs: Record<string, ClientInputPacket>;
  reconnectTokens: Record<string, string>; // guestId -> token
  events: GameNetworkEvent[];
  lastTick: number;
}

class RoomManager {
  private rooms: Map<string, ActiveRoom> = new Map();

  constructor() {
    // Background interval to tick active matches
    setInterval(() => {
      this.tickRooms();
    }, 50); // 20 ticks per second
  }

  public createRoom(params: {
    roomName: string;
    hostName: string;
    hostId: string;
    visibility: 'public' | 'private';
    password?: string;
    maximumPlayers: number;
    selectedLevelId: string;
    difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
    characterId?: string;
  }): MultiplayerRoomInfo {
    const roomCode = this.generateRoomCode();
    const id = `room_${Date.now()}_${roomCode}`;

    const hostMember: MultiplayerMemberInfo = {
      id: params.hostId,
      guestId: params.hostId,
      displayName: params.hostName,
      characterId: params.characterId || 'chef_cat',
      playerType: 'human',
      isHost: true,
      isReady: true,
      connectionStatus: 'connected',
      color: PLAYER_COLORS[0],
      slotIndex: 0,
    };

    const roomInfo: MultiplayerRoomInfo = {
      id,
      roomCode,
      roomName: params.roomName,
      hostIdentityId: params.hostId,
      hostName: params.hostName,
      visibility: params.visibility,
      hasPassword: !!params.password,
      maximumPlayers: Math.max(2, Math.min(8, params.maximumPlayers)),
      currentPlayers: 1,
      selectedLevelId: params.selectedLevelId,
      difficulty: params.difficulty,
      status: 'waiting',
      members: [hostMember],
      createdAt: Date.now(),
    };

    const activeRoom: ActiveRoom = {
      info: roomInfo,
      password: params.password,
      inputs: {},
      reconnectTokens: { [params.hostId]: `tok_${Math.random().toString(36).substring(2)}` },
      events: [],
      lastTick: Date.now(),
    };

    this.rooms.set(roomCode, activeRoom);
    return roomInfo;
  }

  public getPublicRooms(): MultiplayerRoomInfo[] {
    return Array.from(this.rooms.values())
      .filter((r) => r.info.visibility === 'public' && r.info.status === 'waiting')
      .map((r) => r.info);
  }

  public getRoom(roomCode: string): ActiveRoom | null {
    return this.rooms.get(roomCode.toUpperCase()) || null;
  }

  public joinRoom(
    roomCode: string,
    player: { id: string; name: string; characterId?: string; password?: string }
  ): { success: boolean; room?: MultiplayerRoomInfo; error?: string; reconnectToken?: string } {
    const room = this.getRoom(roomCode);
    if (!room) {
      return { success: false, error: 'Không tìm thấy phòng chơi.' };
    }

    if (room.info.status !== 'waiting') {
      return { success: false, error: 'Trận đấu đang diễn ra hoặc đã kết thúc.' };
    }

    if (room.info.currentPlayers >= room.info.maximumPlayers) {
      return { success: false, error: 'Phòng đã đầy người chơi.' };
    }

    if (room.password && room.password !== player.password) {
      return { success: false, error: 'Mật khẩu phòng không chính xác.' };
    }

    // Check if player already exists
    const existing = room.info.members.find((m) => m.id === player.id);
    if (existing) {
      existing.connectionStatus = 'connected';
      return {
        success: true,
        room: room.info,
        reconnectToken: room.reconnectTokens[player.id],
      };
    }

    const slotIndex = room.info.members.length;
    const newMember: MultiplayerMemberInfo = {
      id: player.id,
      guestId: player.id,
      displayName: player.name,
      characterId: player.characterId || 'chef_tuan',
      playerType: 'human',
      isHost: false,
      isReady: false,
      connectionStatus: 'connected',
      color: PLAYER_COLORS[slotIndex % PLAYER_COLORS.length],
      slotIndex,
    };

    room.info.members.push(newMember);
    room.info.currentPlayers = room.info.members.length;

    const token = `tok_${Math.random().toString(36).substring(2)}`;
    room.reconnectTokens[player.id] = token;

    room.events.push({
      type: 'player_joined',
      member: newMember,
    });

    return { success: true, room: room.info, reconnectToken: token };
  }

  public toggleReady(roomCode: string, playerId: string): boolean {
    const room = this.getRoom(roomCode);
    if (!room) return false;
    const member = room.info.members.find((m) => m.id === playerId);
    if (!member) return false;
    member.isReady = !member.isReady;
    return true;
  }

  public addAIChef(roomCode: string, hostId: string): boolean {
    const room = this.getRoom(roomCode);
    if (!room || room.info.hostIdentityId !== hostId) return false;
    if (room.info.currentPlayers >= room.info.maximumPlayers) return false;

    const slotIndex = room.info.members.length;
    const aiMember: MultiplayerMemberInfo = {
      id: `ai_${Date.now()}_${slotIndex}`,
      displayName: `AI Chef ${slotIndex + 1}`,
      characterId: 'chef_panda',
      playerType: 'ai',
      isHost: false,
      isReady: true,
      connectionStatus: 'connected',
      color: PLAYER_COLORS[slotIndex % PLAYER_COLORS.length],
      slotIndex,
    };

    room.info.members.push(aiMember);
    room.info.currentPlayers = room.info.members.length;
    return true;
  }

  public startGame(roomCode: string, hostId: string): boolean {
    const room = this.getRoom(roomCode);
    if (!room || room.info.hostIdentityId !== hostId) return false;
    if (room.info.members.length < 2) return false;

    const level = LEVELS.find((l) => l.id === room.info.selectedLevelId) || LEVELS[0];
    const playerConfigs = room.info.members.map((m) => ({
      id: m.id,
      name: m.displayName,
      characterId: m.characterId,
      color: m.color,
      isAI: m.playerType === 'ai',
    }));

    room.engine = new SimulationEngine(level, 'online', playerConfigs);
    room.info.status = 'in_game';
    return true;
  }

  public processInput(roomCode: string, input: ClientInputPacket): void {
    const room = this.getRoom(roomCode);
    if (!room || !room.engine) return;
    room.inputs[input.playerId] = input;
  }

  public getStateSnapshot(roomCode: string): ServerStateSnapshot | null {
    const room = this.getRoom(roomCode);
    if (!room || !room.engine) return null;

    const state = room.engine.state;
    const playersSummary: Record<string, any> = {};

    for (const [id, p] of Object.entries(state.players)) {
      playersSummary[id] = {
        x: p.x,
        y: p.y,
        vx: p.vx,
        vy: p.vy,
        facing: p.facing,
        currentAction: p.currentAction,
        isDashing: p.isDashing,
        heldItemSummary: p.heldItem ? p.heldItem.kind : undefined,
      };
    }

    const stationsSummary: Record<string, any> = {};
    for (const [id, s] of Object.entries(state.stations)) {
      stationsSummary[id] = {
        chopProgress: s.chopProgress,
        washProgress: s.washProgress,
        cookProgress: s.applianceUtensil?.cookProgress,
        onFire: s.onFire,
        itemSummary: s.item ? s.item.kind : undefined,
      };
    }

    const snapshot: ServerStateSnapshot = {
      sequenceNumber: Date.now(),
      serverTimestamp: Date.now(),
      timeRemaining: state.timeRemaining,
      score: state.score,
      combo: state.combo,
      players: playersSummary,
      stations: stationsSummary,
      orders: state.activeOrders.map((o) => ({
        id: o.id,
        recipeId: o.recipeId,
        remainingTime: o.remainingTime,
      })),
      activePings: state.pings,
      events: [...room.events],
    };

    room.events = []; // Flush events after sending snapshot
    return snapshot;
  }

  private tickRooms(): void {
    const now = Date.now();
    for (const room of this.rooms.values()) {
      if (room.info.status === 'in_game' && room.engine) {
        const dt = (now - room.lastTick) / 1000;
        room.lastTick = now;

        const inputsMap: Record<string, any> = {};
        for (const [pId, inp] of Object.entries(room.inputs)) {
          inputsMap[pId] = {
            moveX: inp.moveX,
            moveY: inp.moveY,
            isDashing: inp.isDashing,
            actionPickDrop: inp.actionPickDrop,
            actionInteract: inp.actionInteract,
            actionThrow: inp.actionThrow,
          };
          // Reset pulse actions
          inp.actionPickDrop = false;
          inp.actionThrow = false;
        }

        room.engine.tick(dt, inputsMap);

        if (room.engine.state.status === 'completed') {
          room.info.status = 'completed';
        }
      } else {
        room.lastTick = now;
      }
    }
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

export const roomManager = new RoomManager();
