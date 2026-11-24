import {
  PlayerState,
  GameSimulationState,
  ChefAction,
} from '../../types/game';
import { resolvePlayerMovement, separatePlayers, ObstacleMap } from './CollisionSystem';
import { vecLength, vecNormalize } from '../core/Vector2D';
import { getStationFacing, handlePickDrop, handleInteract } from './StationSystem';

export const PLAYER_WALK_SPEED = 4.5;
export const PLAYER_DASH_SPEED = 11.0;
export const DASH_DURATION = 0.22;
export const DASH_COOLDOWN = 0.85;

export interface PlayerInput {
  moveX: number;
  moveY: number;
  isDashing: boolean;
  actionPickDrop: boolean;
  actionInteract: boolean;
  actionThrow: boolean;
}

export function updatePlayers(
  state: GameSimulationState,
  inputs: Record<string, PlayerInput>,
  dt: number
): void {
  const obstacleMap: ObstacleMap = {
    width: state.level.width,
    height: state.level.height,
    isObstacle: (gx, gy) => {
      // Out of bounds
      if (gx < 0 || gx >= state.level.width || gy < 0 || gy >= state.level.height) return true;
      // Grid tile is obstacle if != 0
      const row = state.level.tiles[gy];
      if (!row) return true;
      return row[gx] !== 0;
    },
  };

  for (const [playerId, player] of Object.entries(state.players)) {
    const input = inputs[playerId] || {
      moveX: 0,
      moveY: 0,
      isDashing: false,
      actionPickDrop: false,
      actionInteract: false,
      actionThrow: false,
    };

    // 1. Dash cooldown & active timer
    if (player.dashCooldown > 0) {
      player.dashCooldown = Math.max(0, player.dashCooldown - dt);
    }

    if (input.isDashing && player.dashCooldown === 0 && !player.isDashing) {
      player.isDashing = true;
      player.dashTimer = DASH_DURATION;
      player.dashCooldown = DASH_COOLDOWN;
    }

    if (player.isDashing) {
      player.dashTimer -= dt;
      if (player.dashTimer <= 0) {
        player.isDashing = false;
      }
    }

    // 2. Compute movement
    const inputVec = { x: input.moveX, y: input.moveY };
    const inputLen = vecLength(inputVec);

    let speed = PLAYER_WALK_SPEED;
    if (player.isDashing) {
      speed = PLAYER_DASH_SPEED;
    }

    if (inputLen > 0.1) {
      const normalized = vecNormalize(inputVec);
      player.facing = { x: normalized.x, y: normalized.y };
      player.vx = normalized.x * speed;
      player.vy = normalized.y * speed;

      const targetPos = {
        x: player.x + player.vx * dt,
        y: player.y + player.vy * dt,
      };

      const resolved = resolvePlayerMovement(player, targetPos, obstacleMap);
      player.x = resolved.x;
      player.y = resolved.y;

      player.currentAction = player.isDashing ? 'dash' : 'run';
    } else {
      player.vx = 0;
      player.vy = 0;
      if (player.currentAction !== 'chop' && player.currentAction !== 'wash' && player.currentAction !== 'extinguish') {
        player.currentAction = 'idle';
      }
    }

    // 3. Handle interaction and pick/drop
    const facingStation = getStationFacing(player, state.stations);

    if (input.actionPickDrop) {
      handlePickDrop(player, facingStation, state);
    }

    if (input.actionInteract) {
      handleInteract(player, facingStation, dt, state);
    } else {
      // If player stops pressing interact, cancel chopping / washing action
      if (player.currentAction === 'chop' || player.currentAction === 'wash' || player.currentAction === 'extinguish') {
        player.currentAction = 'idle';
      }
    }

    // 4. Handle Throw
    if (input.actionThrow && player.heldItem?.kind === 'ingredient') {
      handleThrow(player, state);
    }
  }

  // Separate overlapping players smoothly
  separatePlayers(Object.values(state.players));
}

function handleThrow(player: PlayerState, state: GameSimulationState): void {
  if (!player.heldItem || player.heldItem.kind !== 'ingredient') return;

  const item = player.heldItem;
  player.heldItem = undefined;

  // Find destination up to 2.5 units in facing direction
  for (let dist = 2.5; dist >= 1.0; dist -= 0.5) {
    const targetX = Math.floor(player.x + player.facing.x * dist);
    const targetY = Math.floor(player.y + player.facing.y * dist);

    const key = `${targetX},${targetY}`;
    const station = state.stations[key];

    // Land on empty counter or cutting board
    if (station && (station.type === 'counter' || station.type === 'cutting_board') && !station.item) {
      station.item = item;
      return;
    }
  }

  // If no counter found, player holds it back to prevent losing ingredient into void
  player.heldItem = item;
}
