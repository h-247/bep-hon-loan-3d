import { GameSimulationState, Station, UtensilItem, Ingredient } from '../../types/game';

export const COOK_RATE_PER_SEC = 0.125; // Reaches 1.0 in ~8 seconds
export const OVERCOOK_BURNING_THRESHOLD = 2.0; // Overcook burning starts at 2x cook time
export const FIRE_SPREAD_INTERVAL = 4.0; // Seconds before fire spreads to adjacent tile

export function updateCooking(state: GameSimulationState, dt: number): void {
  for (const station of Object.values(state.stations)) {
    // 1. Process active appliance utensils (stoves, ovens, deep fryers)
    if (station.applianceUtensil && station.applianceUtensil.isCooking) {
      updateUtensilCooking(station, station.applianceUtensil, dt, state);
    }

    // 2. Process fire spreading if station is on fire
    if (station.onFire) {
      station.fireProgress = Math.min(1.0, (station.fireProgress ?? 0.5) + dt * 0.1);
      // Fire spread logic
      if (!station.applianceUtensil) {
        station.applianceUtensil = {
          id: `fire_timer_${station.id}`,
          type: 'pan',
          contents: [],
          cookProgress: 0,
          isCooking: false,
          isBurning: true,
          fireTimer: 0,
        };
      }
      station.applianceUtensil.fireTimer += dt;
      if (station.applianceUtensil.fireTimer >= FIRE_SPREAD_INTERVAL) {
        station.applianceUtensil.fireTimer = 0;
        spreadFireToAdjacent(station, state);
      }
    }
  }
}

function updateUtensilCooking(
  station: Station,
  utensil: UtensilItem,
  dt: number,
  state: GameSimulationState
): void {
  if (utensil.contents.length === 0) {
    utensil.isCooking = false;
    utensil.cookProgress = 0;
    return;
  }

  // Advance cooking
  utensil.cookProgress += COOK_RATE_PER_SEC * dt;

  // Mark all contents as cooking or cooked
  for (const ing of utensil.contents) {
    ing.cookProgress = utensil.cookProgress;
    if (utensil.cookProgress >= 1.0 && ing.state !== 'burned') {
      ing.state = 'cooked';
    }
  }

  // Overcooked & Fire
  if (utensil.cookProgress >= OVERCOOK_BURNING_THRESHOLD && !station.onFire) {
    station.onFire = true;
    station.fireProgress = 0.6;
    utensil.isBurning = true;
    state.firesCount += 1;

    for (const ing of utensil.contents) {
      ing.state = 'burned';
    }

    state.floatingTexts.push({
      id: `fire_${Date.now()}_${station.id}`,
      text: 'CHÁY RỒI!',
      x: station.x + 0.5,
      y: station.y + 0.5,
      color: '#ef4444',
      duration: 2.0,
      elapsed: 0,
    });
  }
}

function spreadFireToAdjacent(sourceStation: Station, state: GameSimulationState): void {
  const neighbors = [
    { x: sourceStation.x + 1, y: sourceStation.y },
    { x: sourceStation.x - 1, y: sourceStation.y },
    { x: sourceStation.x, y: sourceStation.y + 1 },
    { x: sourceStation.x, y: sourceStation.y - 1 },
  ];

  for (const n of neighbors) {
    const key = `${n.x},${n.y}`;
    const target = state.stations[key];
    if (target && !target.onFire && target.type !== 'sink' && target.type !== 'extinguisher_stand') {
      target.onFire = true;
      target.fireProgress = 0.5;
      state.firesCount += 1;
      break; // Spread to at most 1 adjacent station per interval to keep gameplay balanced
    }
  }
}
