import { GameSimulationState, PlayerState, Station } from '../../types/game';
import { PlayerInput } from '../simulation/PlayerSystem';
import { findPathAStar } from './Pathfinding';
import { vecDistance } from '../core/Vector2D';

export class AIChefController {
  private targetStationId: string | null = null;
  private path: { x: number; y: number }[] = [];
  private interactionCooldown = 0;

  public update(
    aiPlayer: PlayerState,
    state: GameSimulationState,
    dt: number
  ): PlayerInput {
    if (this.interactionCooldown > 0) {
      this.interactionCooldown -= dt;
    }

    const command = aiPlayer.aiCommand || 'Tự động hỗ trợ';
    if (command === 'Đứng yên') {
      return {
        moveX: 0,
        moveY: 0,
        isDashing: false,
        actionPickDrop: false,
        actionInteract: false,
        actionThrow: false,
      };
    }

    // 1. Choose Target Station based on priorities
    const targetStation = this.chooseTargetStation(aiPlayer, state, command);
    if (!targetStation) {
      return {
        moveX: 0,
        moveY: 0,
        isDashing: false,
        actionPickDrop: false,
        actionInteract: false,
        actionThrow: false,
      };
    }

    // Target interaction position is the adjacent walkable tile
    const interactPos = this.findAdjacentWalkablePos(targetStation, state);

    const dist = vecDistance(
      { x: aiPlayer.x, y: aiPlayer.y },
      { x: interactPos.x, y: interactPos.y }
    );

    // If close enough to target station, face it and execute action
    if (dist <= 0.65) {
      const dx = targetStation.x + 0.5 - aiPlayer.x;
      const dy = targetStation.y + 0.5 - aiPlayer.y;

      let actionPickDrop = false;
      let actionInteract = false;

      // Handle interactions:
      if (targetStation.onFire && aiPlayer.heldItem?.kind === 'utensil' && aiPlayer.heldItem.item.type === 'fire_extinguisher') {
        actionInteract = true;
      } else if (targetStation.type === 'cutting_board' && targetStation.item?.kind === 'ingredient') {
        actionInteract = true; // Chop
      } else if (targetStation.type === 'sink' && (targetStation.dirtyPlateCount ?? 0) > 0) {
        actionInteract = true; // Wash
      } else if (this.interactionCooldown <= 0) {
        actionPickDrop = true;
        this.interactionCooldown = 0.5;
      }

      return {
        moveX: 0,
        moveY: 0,
        isDashing: false,
        actionPickDrop,
        actionInteract,
        actionThrow: false,
      };
    }

    // 2. Navigate towards target position
    const isWalkable = (gx: number, gy: number) => {
      if (gx < 0 || gx >= state.level.width || gy < 0 || gy >= state.level.height) return false;
      const row = state.level.tiles[gy];
      return row ? row[gx] === 0 : false;
    };

    if (this.path.length === 0 || this.targetStationId !== targetStation.id) {
      this.targetStationId = targetStation.id;
      this.path = findPathAStar(
        aiPlayer.x,
        aiPlayer.y,
        interactPos.x,
        interactPos.y,
        isWalkable,
        state.level.width,
        state.level.height
      );
    }

    // Move to next waypoint
    if (this.path.length > 0) {
      const nextWaypoint = this.path[0];
      const wpDist = vecDistance(
        { x: aiPlayer.x, y: aiPlayer.y },
        { x: nextWaypoint.x, y: nextWaypoint.y }
      );

      if (wpDist < 0.35) {
        this.path.shift(); // Reached waypoint
      }

      const dirX = nextWaypoint.x - aiPlayer.x;
      const dirY = nextWaypoint.y - aiPlayer.y;
      const len = Math.sqrt(dirX * dirX + dirY * dirY) || 1;

      return {
        moveX: dirX / len,
        moveY: dirY / len,
        isDashing: wpDist > 2.0, // Dash if far away
        actionPickDrop: false,
        actionInteract: false,
        actionThrow: false,
      };
    }

    return {
      moveX: 0,
      moveY: 0,
      isDashing: false,
      actionPickDrop: false,
      actionInteract: false,
      actionThrow: false,
    };
  }

  private chooseTargetStation(
    player: PlayerState,
    state: GameSimulationState,
    command: string
  ): Station | null {
    const stations = Object.values(state.stations);

    // Priority 1: FIRE emergency!
    const burningStation = stations.find((s) => s.onFire);
    if (burningStation) {
      if (player.heldItem?.kind === 'utensil' && player.heldItem.item.type === 'fire_extinguisher') {
        return burningStation;
      }
      const extinguisherStand = stations.find((s) => s.type === 'extinguisher_stand' || (s.item?.kind === 'utensil' && s.item.item.type === 'fire_extinguisher'));
      if (extinguisherStand) return extinguisherStand;
    }

    // Priority 2: Deliver completed food if holding plate with food
    if (player.heldItem?.kind === 'plate' && player.heldItem.item.ingredients.length > 0 && !player.heldItem.item.isDirty) {
      const servingWindow = stations.find((s) => s.type === 'serving_window');
      if (servingWindow) return servingWindow;
    }

    // Priority 3: Chopping at cutting board
    const cuttingBoardWithFood = stations.find(
      (s) => s.type === 'cutting_board' && s.item?.kind === 'ingredient' && s.item.item.state === 'raw'
    );
    if (cuttingBoardWithFood && !player.heldItem) {
      return cuttingBoardWithFood;
    }

    // Priority 4: Wash dirty plates
    const sinkWithDirtyPlates = stations.find(
      (s) => s.type === 'sink' && (s.dirtyPlateCount ?? 0) > 0
    );
    if (sinkWithDirtyPlates && !player.heldItem) {
      return sinkWithDirtyPlates;
    }

    // Priority 5: Pick up raw ingredient needed for active orders
    if (!player.heldItem && state.activeOrders.length > 0) {
      const activeOrder = state.activeOrders[0];
      const neededIng = activeOrder.requiredIngredients[0];
      if (neededIng) {
        const crate = stations.find(
          (s) => s.type === 'crate' && s.crateIngredient === neededIng.type
        );
        if (crate) return crate;
      }
    }

    // Priority 6: Place held raw ingredient on cutting board
    if (player.heldItem?.kind === 'ingredient' && player.heldItem.item.state === 'raw') {
      const emptyBoard = stations.find((s) => s.type === 'cutting_board' && !s.item);
      if (emptyBoard) return emptyBoard;
      const emptyCounter = stations.find((s) => s.type === 'counter' && !s.item);
      if (emptyCounter) return emptyCounter;
    }

    return null;
  }

  private findAdjacentWalkablePos(
    station: Station,
    state: GameSimulationState
  ): { x: number; y: number } {
    const candidates = [
      { x: station.x + 0.5, y: station.y + 1.3 },
      { x: station.x + 0.5, y: station.y - 0.3 },
      { x: station.x + 1.3, y: station.y + 0.5 },
      { x: station.x - 0.3, y: station.y + 0.5 },
    ];

    for (const c of candidates) {
      const gx = Math.floor(c.x);
      const gy = Math.floor(c.y);
      if (gx >= 0 && gx < state.level.width && gy >= 0 && gy < state.level.height) {
        const row = state.level.tiles[gy];
        if (row && row[gx] === 0) {
          return c;
        }
      }
    }

    return { x: station.x + 0.5, y: station.y + 0.5 };
  }
}
