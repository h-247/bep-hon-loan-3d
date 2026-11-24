import { Vector2D, vecDistance } from '../core/Vector2D';
import { PlayerState } from '../../types/game';

export const CHEF_RADIUS = 0.38;
export const COUNTER_SIZE = 1.0;

export interface ObstacleMap {
  width: number;
  height: number;
  isObstacle: (x: number, y: number) => boolean;
}

export function resolvePlayerMovement(
  currentPos: Vector2D,
  targetPos: Vector2D,
  obstacles: ObstacleMap,
  radius: number = CHEF_RADIUS
): Vector2D {
  let resolvedX = targetPos.x;
  let resolvedY = targetPos.y;

  // Clamp within grid boundary with margin
  resolvedX = Math.max(radius, Math.min(obstacles.width - radius, resolvedX));
  resolvedY = Math.max(radius, Math.min(obstacles.height - radius, resolvedY));

  // Test collision in X axis first (allows wall sliding)
  const posX = { x: resolvedX, y: currentPos.y };
  if (isCircleCollidingWithObstacles(posX, radius, obstacles)) {
    resolvedX = currentPos.x;
  }

  // Test collision in Y axis
  const posY = { x: resolvedX, y: resolvedY };
  if (isCircleCollidingWithObstacles(posY, radius, obstacles)) {
    resolvedY = currentPos.y;
  }

  return { x: resolvedX, y: resolvedY };
}

export function isCircleCollidingWithObstacles(
  pos: Vector2D,
  radius: number,
  obstacles: ObstacleMap
): boolean {
  // Check integer grid cells surrounding the position
  const minX = Math.max(0, Math.floor(pos.x - radius));
  const maxX = Math.min(obstacles.width - 1, Math.floor(pos.x + radius));
  const minY = Math.max(0, Math.floor(pos.y - radius));
  const maxY = Math.min(obstacles.height - 1, Math.floor(pos.y + radius));

  for (let gx = minX; gx <= maxX; gx++) {
    for (let gy = minY; gy <= maxY; gy++) {
      if (obstacles.isObstacle(gx, gy)) {
        // AABB of grid cell [gx, gx+1] x [gy, gy+1]
        const closestX = Math.max(gx, Math.min(gx + 1, pos.x));
        const closestY = Math.max(gy, Math.min(gy + 1, pos.y));
        const dx = pos.x - closestX;
        const dy = pos.y - closestY;
        if (dx * dx + dy * dy < radius * radius) {
          return true;
        }
      }
    }
  }

  return false;
}

export function separatePlayers(players: PlayerState[], radius: number = CHEF_RADIUS): void {
  const minDistance = radius * 2;
  const list = Object.values(players);

  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const p1 = list[i];
      const p2 = list[j];
      const dist = vecDistance(p1, p2);

      if (dist < minDistance && dist > 0.0001) {
        const overlap = (minDistance - dist) * 0.5;
        const nx = (p1.x - p2.x) / dist;
        const ny = (p1.y - p2.y) / dist;

        p1.x += nx * overlap;
        p1.y += ny * overlap;
        p2.x -= nx * overlap;
        p2.y -= ny * overlap;
      }
    }
  }
}
