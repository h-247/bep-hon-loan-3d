import {
  GameSimulationState,
  KitchenLevelConfig,
  GameMode,
  PlayerState,
  Station,
} from '../../types/game';
import { PRNG } from '../core/PRNG';
import { updatePlayers, PlayerInput } from './PlayerSystem';
import { updateCooking } from './CookingSystem';
import { updateOrders, spawnNewOrder } from './OrderSystem';
import { createUtensil } from './StationSystem';

export class SimulationEngine {
  public state: GameSimulationState;
  public prng: PRNG;
  private orderTimer = { value: 0 };

  constructor(
    level: KitchenLevelConfig,
    mode: GameMode,
    playerConfigs: { id: string; name: string; characterId: string; color: string; isAI?: boolean }[],
    randomSeed: number = 42
  ) {
    this.prng = new PRNG(randomSeed);

    // Deep clone stations from level
    const stationsMap: Record<string, Station> = {};
    for (const st of level.stations) {
      const cloned: Station = {
        ...st,
        washProgress: 0,
        chopProgress: 0,
        dirtyPlateCount: st.type === 'sink' ? 2 : 0,
        cleanPlateCount: st.type === 'plate_dispenser' ? 5 : 0,
        onFire: false,
        fireProgress: 0,
      };

      // Set default appliances on cooking stations
      if (st.type === 'stove') {
        // Decide if it's pot or pan based on level available recipes
        const needsPot = level.availableRecipes.some((r) =>
          ['sushi', 'pasta', 'onion_soup', 'tomato_soup'].includes(r)
        );
        cloned.applianceUtensil = createUtensil(needsPot ? 'pot' : 'pan');
      } else if (st.type === 'oven') {
        cloned.applianceUtensil = createUtensil('pan');
      } else if (st.type === 'deep_fryer') {
        cloned.applianceUtensil = createUtensil('pan');
      }

      stationsMap[`${st.x},${st.y}`] = cloned;
    }

    // Initialize players
    const playersMap: Record<string, PlayerState> = {};
    playerConfigs.forEach((cfg, idx) => {
      const spawn = level.spawnPoints[idx % level.spawnPoints.length] || { x: 2, y: 2 };
      playersMap[cfg.id] = {
        id: cfg.id,
        name: cfg.name,
        characterId: cfg.characterId,
        color: cfg.color,
        x: spawn.x + 0.5,
        y: spawn.y + 0.5,
        facing: { x: 0, y: 1 },
        vx: 0,
        vy: 0,
        isDashing: false,
        dashTimer: 0,
        dashCooldown: 0,
        isInteracting: false,
        currentAction: 'idle',
        isAI: cfg.isAI ?? false,
        scoreContribution: {
          prepared: 0,
          cooked: 0,
          assembled: 0,
          delivered: 0,
          washed: 0,
          extinguished: 0,
        },
      };
    });

    this.state = {
      level,
      mode,
      status: 'countdown',
      countdownTimer: 3.0,
      timeRemaining: level.timeLimit,
      score: 0,
      combo: 1,
      highestCombo: 1,
      completedOrdersCount: 0,
      failedOrdersCount: 0,
      totalTips: 0,
      players: playersMap,
      stations: stationsMap,
      activeOrders: [],
      orderQueue: [],
      floatingTexts: [],
      pings: [],
      chatMessages: [],
      firesCount: 0,
      randomSeed,
    };

    // Pre-spawn initial orders
    const initialOrdersCount = Math.min(2, level.maxSimultaneousOrders);
    for (let i = 0; i < initialOrdersCount; i++) {
      spawnNewOrder(this.state, this.prng);
    }
  }

  public tick(dt: number, inputs: Record<string, PlayerInput>): void {
    if (this.state.status === 'countdown') {
      this.state.countdownTimer -= dt;
      if (this.state.countdownTimer <= 0) {
        this.state.status = 'playing';
      }
      return;
    }

    if (this.state.status !== 'playing') {
      return;
    }

    // Advance match timer (unless practice mode with 0 limit)
    if (this.state.level.timeLimit > 0) {
      this.state.timeRemaining -= dt;
      if (this.state.timeRemaining <= 0) {
        this.state.timeRemaining = 0;
        this.state.status = 'completed';
        return;
      }
    }

    // 1. Update player movements and interactions
    updatePlayers(this.state, inputs, dt);

    // 2. Update cooking appliances and fire propagation
    updateCooking(this.state, dt);

    // 3. Update orders and expiration
    updateOrders(this.state, dt, this.prng, this.orderTimer);

    // 4. Decay floating texts
    for (let i = this.state.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.state.floatingTexts[i];
      ft.elapsed += dt;
      ft.y -= dt * 0.5; // Float upwards
      if (ft.elapsed >= ft.duration) {
        this.state.floatingTexts.splice(i, 1);
      }
    }

    // 5. Decay pings
    for (let i = this.state.pings.length - 1; i >= 0; i--) {
      const ping = this.state.pings[i];
      ping.elapsed += dt;
      if (ping.elapsed >= ping.duration) {
        this.state.pings.splice(i, 1);
      }
    }
  }

  public calculateStars(): number {
    const score = this.state.score;
    const [t1, t2, t3] = this.state.level.starThresholds;
    if (score >= t3) return 3;
    if (score >= t2) return 2;
    if (score >= t1) return 1;
    return 0;
  }
}
