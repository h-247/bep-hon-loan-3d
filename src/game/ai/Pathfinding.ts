import { Vector2D, vecDistance } from '../core/Vector2D';

interface GridNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent?: GridNode;
}

export function findPathAStar(
  startX: number,
  startY: number,
  targetX: number,
  targetY: number,
  isWalkable: (x: number, y: number) => boolean,
  maxWidth: number,
  maxHeight: number
): Vector2D[] {
  const sx = Math.floor(startX);
  const sy = Math.floor(startY);
  const tx = Math.floor(targetX);
  const ty = Math.floor(targetY);

  if (sx === tx && sy === ty) return [{ x: targetX, y: targetY }];

  const openList: GridNode[] = [];
  const closedSet = new Set<string>();

  const startNode: GridNode = {
    x: sx,
    y: sy,
    g: 0,
    h: Math.abs(tx - sx) + Math.abs(ty - sy),
    f: Math.abs(tx - sx) + Math.abs(ty - sy),
  };
  openList.push(startNode);

  const neighbors = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];

  let iterations = 0;
  while (openList.length > 0 && iterations < 300) {
    iterations++;
    // Get lowest f node
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift()!;
    const key = `${current.x},${current.y}`;

    if (current.x === tx && current.y === ty) {
      // Reconstruct path
      const path: Vector2D[] = [];
      let curr: GridNode | undefined = current;
      while (curr) {
        path.unshift({ x: curr.x + 0.5, y: curr.y + 0.5 });
        curr = curr.parent;
      }
      return path;
    }

    closedSet.add(key);

    for (const offset of neighbors) {
      const nx = current.x + offset.x;
      const ny = current.y + offset.y;

      if (nx < 0 || nx >= maxWidth || ny < 0 || ny >= maxHeight) continue;
      const nKey = `${nx},${ny}`;
      if (closedSet.has(nKey)) continue;

      // Destination tile doesn't need to be walkable if we are interacting with counter
      const isTarget = nx === tx && ny === ty;
      if (!isWalkable(nx, ny) && !isTarget) continue;

      const g = current.g + 1;
      const h = Math.abs(tx - nx) + Math.abs(ty - ny);
      const f = g + h;

      const existing = openList.find((node) => node.x === nx && node.y === ny);
      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.f = f;
          existing.parent = current;
        }
      } else {
        openList.push({ x: nx, y: ny, g, h, f, parent: current });
      }
    }
  }

  // Fallback direct movement
  return [{ x: targetX, y: targetY }];
}
