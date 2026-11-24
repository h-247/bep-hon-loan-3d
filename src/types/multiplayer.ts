import { GameSimulationState, PlayerState, QuickChatMessage, KitchenPing } from './game';

export interface MultiplayerRoomInfo {
  id: string;
  roomCode: string;
  roomName: string;
  hostIdentityId: string;
  hostName: string;
  visibility: 'public' | 'private';
  hasPassword: boolean;
  maximumPlayers: number;
  currentPlayers: number;
  selectedLevelId: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
  status: 'waiting' | 'in_game' | 'completed' | 'closed';
  members: MultiplayerMemberInfo[];
  createdAt: number;
}

export interface MultiplayerMemberInfo {
  id: string;
  userId?: string;
  guestId?: string;
  displayName: string;
  characterId: string;
  playerType: 'human' | 'ai';
  isHost: boolean;
  isReady: boolean;
  connectionStatus: 'connected' | 'disconnected';
  color: string;
  slotIndex: number;
}

export interface ClientInputPacket {
  sequenceNumber: number;
  playerId: string;
  moveX: number;
  moveY: number;
  isDashing: boolean;
  actionPickDrop: boolean;
  actionInteract: boolean;
  actionThrow: boolean;
  timestamp: number;
}

export interface ServerStateSnapshot {
  sequenceNumber: number;
  serverTimestamp: number;
  timeRemaining: number;
  score: number;
  combo: number;
  players: Record<string, {
    x: number;
    y: number;
    vx: number;
    vy: number;
    facing: { x: number; y: number };
    currentAction: string;
    isDashing: boolean;
    heldItemSummary?: string;
  }>;
  stations: Record<string, {
    chopProgress?: number;
    washProgress?: number;
    cookProgress?: number;
    onFire?: boolean;
    itemSummary?: string;
  }>;
  orders: {
    id: string;
    recipeId: string;
    remainingTime: number;
  }[];
  activePings: KitchenPing[];
  events: GameNetworkEvent[];
}

export type GameNetworkEvent =
  | { type: 'order_completed'; recipeId: string; score: number; tip: number; playerId: string }
  | { type: 'order_failed'; recipeId: string }
  | { type: 'fire_started'; stationId: string; x: number; y: number }
  | { type: 'fire_extinguished'; stationId: string; playerId: string }
  | { type: 'dish_assembled'; recipeId: string; playerId: string }
  | { type: 'quick_chat'; message: QuickChatMessage }
  | { type: 'ping'; ping: KitchenPing }
  | { type: 'player_joined'; member: MultiplayerMemberInfo }
  | { type: 'player_left'; playerId: string }
  | { type: 'host_transferred'; newHostId: string };
