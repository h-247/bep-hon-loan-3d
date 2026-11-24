import {
  Station,
  PlayerState,
  HeldItem,
  Ingredient,
  IngredientType,
  PlateItem,
  UtensilItem,
  GameSimulationState,
} from '../../types/game';
import { matchIngredientsToRecipe, canAddIngredientToDish } from '../recipes/RecipeValidator';

export const CHOP_SPEED_PER_SEC = 0.5; // Takes 2 seconds to chop an ingredient
export const WASH_SPEED_PER_SEC = 0.4; // Takes 2.5 seconds to wash a plate
export const EXTINGUISH_SPEED_PER_SEC = 0.6; // Takes ~1.7 seconds to extinguish fire

export function getStationFacing(player: PlayerState, stations: Record<string, Station>): Station | null {
  const targetX = Math.floor(player.x + player.facing.x * 0.85);
  const targetY = Math.floor(player.y + player.facing.y * 0.85);

  const key = `${targetX},${targetY}`;
  return stations[key] || null;
}

export function handlePickDrop(
  player: PlayerState,
  station: Station | null,
  state: GameSimulationState
): void {
  // If not facing any station, player can drop raw ingredient on empty floor
  if (!station) {
    return;
  }

  // 1. Player is NOT holding anything -> PICK UP
  if (!player.heldItem) {
    // Pick from Crate
    if (station.type === 'crate' && station.crateIngredient) {
      player.heldItem = {
        kind: 'ingredient',
        item: createIngredient(station.crateIngredient),
      };
      player.currentAction = 'idle';
      return;
    }

    // Pick from Plate Dispenser
    if (station.type === 'plate_dispenser') {
      player.heldItem = {
        kind: 'plate',
        item: {
          id: `plate_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          isDirty: false,
          ingredients: [],
        },
      };
      return;
    }

    // Pick from Extinguisher Stand
    if (station.type === 'extinguisher_stand') {
      if (station.item) {
        player.heldItem = station.item;
        station.item = undefined;
      } else {
        player.heldItem = {
          kind: 'utensil',
          item: createUtensil('fire_extinguisher'),
        };
      }
      return;
    }

    // Pick clean plate from Sink
    if (station.type === 'sink' && (station.cleanPlateCount ?? 0) > 0) {
      station.cleanPlateCount = (station.cleanPlateCount ?? 0) - 1;
      player.heldItem = {
        kind: 'plate',
        item: {
          id: `plate_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          isDirty: false,
          ingredients: [],
        },
      };
      return;
    }

    // Pick up station's placed item
    if (station.item) {
      player.heldItem = station.item;
      station.item = undefined;
      return;
    }

    // Pick up cooked food directly from appliance if it's finished cooking
    if (station.applianceUtensil && station.applianceUtensil.contents.length > 0) {
      const utensil = station.applianceUtensil;
      // If cooked food can be transferred into hands
      if (utensil.cookProgress >= 1.0 && !utensil.isBurning) {
        // Can pick up cooked food item directly if player is empty
        const cookedItem = utensil.contents.shift();
        if (cookedItem) {
          player.heldItem = {
            kind: 'ingredient',
            item: cookedItem,
          };
          if (utensil.contents.length === 0) {
            utensil.cookProgress = 0;
            utensil.isCooking = false;
          }
          return;
        }
      }
    }
    return;
  }

  // 2. Player IS holding something -> PLACE / ASSEMBLE / DELIVER / TRASH
  const held = player.heldItem;

  // Trash Bin
  if (station.type === 'trash') {
    // If it's a plate, clear ingredients and make it dirty, but keep plate
    if (held.kind === 'plate') {
      held.item.ingredients = [];
      held.item.dishType = undefined;
      // Discarded food
    } else if (held.kind === 'utensil' && held.item.type !== 'fire_extinguisher') {
      // Empty pan/pot contents
      held.item.contents = [];
      held.item.cookProgress = 0;
      held.item.isCooking = false;
      held.item.isBurning = false;
    } else if (held.kind === 'ingredient') {
      // Throw away ingredient
      player.heldItem = undefined;
    }
    return;
  }

  // Extinguisher stand return
  if (station.type === 'extinguisher_stand' && held.kind === 'utensil' && held.item.type === 'fire_extinguisher') {
    station.item = held;
    player.heldItem = undefined;
    return;
  }

  // Serving Window Delivery
  if (station.type === 'serving_window') {
    if (held.kind === 'plate' && held.item.ingredients.length > 0 && !held.item.isDirty) {
      // Try to deliver dish
      deliverPlate(player, held.item, state);
      player.heldItem = undefined;
    }
    return;
  }

  // Sink: Add dirty plate
  if (station.type === 'sink' && held.kind === 'plate' && held.item.isDirty) {
    station.dirtyPlateCount = (station.dirtyPlateCount ?? 0) + 1;
    player.heldItem = undefined;
    return;
  }

  // Stove: Add ingredient to pan or pot
  if (station.type === 'stove' && station.applianceUtensil) {
    const utensil = station.applianceUtensil;
    if (held.kind === 'ingredient' && !utensil.isBurning) {
      if (canCookInUtensil(held.item, utensil)) {
        utensil.contents.push(held.item);
        utensil.isCooking = true;
        player.heldItem = undefined;
        player.scoreContribution.cooked += 1;
        return;
      }
    }
    // If holding plate, transfer cooked contents onto plate
    if (held.kind === 'plate' && !held.item.isDirty && utensil.cookProgress >= 1.0 && utensil.contents.length > 0) {
      while (utensil.contents.length > 0) {
        const item = utensil.contents.shift()!;
        held.item.ingredients.push(item);
      }
      utensil.cookProgress = 0;
      utensil.isCooking = false;
      held.item.dishType = matchIngredientsToRecipe(held.item.ingredients)?.id;
      player.scoreContribution.assembled += 1;
      return;
    }
  }

  // Oven / Deep Fryer
  if ((station.type === 'oven' || station.type === 'deep_fryer') && station.applianceUtensil) {
    const appliance = station.applianceUtensil;
    if (held.kind === 'ingredient' && appliance.contents.length === 0 && !appliance.isBurning) {
      appliance.contents.push(held.item);
      appliance.isCooking = true;
      player.heldItem = undefined;
      return;
    }
    if (held.kind === 'plate' && !held.item.isDirty && appliance.cookProgress >= 1.0 && appliance.contents.length > 0) {
      while (appliance.contents.length > 0) {
        const item = appliance.contents.shift()!;
        held.item.ingredients.push(item);
      }
      appliance.cookProgress = 0;
      appliance.isCooking = false;
      held.item.dishType = matchIngredientsToRecipe(held.item.ingredients)?.id;
      player.scoreContribution.assembled += 1;
      return;
    }
  }

  // Cutting Board
  if (station.type === 'cutting_board') {
    if (!station.item && held.kind === 'ingredient') {
      if (canBeChopped(held.item)) {
        station.item = held;
        station.chopProgress = held.item.chopProgress;
        player.heldItem = undefined;
        return;
      }
    }
  }

  // General Counter (or empty cutting board/station)
  if (station.type === 'counter' || station.type === 'cutting_board') {
    // If station is empty, place item
    if (!station.item) {
      station.item = held;
      player.heldItem = undefined;
      return;
    }

    // Dish Assembly on Counter:
    // Case A: Station has a Plate, player holds an Ingredient
    if (station.item.kind === 'plate' && !station.item.item.isDirty && held.kind === 'ingredient') {
      const plate = station.item.item;
      if (canAddIngredientToDish(plate.ingredients, held.item)) {
        plate.ingredients.push(held.item);
        plate.dishType = matchIngredientsToRecipe(plate.ingredients)?.id;
        player.heldItem = undefined;
        player.scoreContribution.assembled += 1;
        return;
      }
    }

    // Case B: Player holds a Plate, station has an Ingredient
    if (held.kind === 'plate' && !held.item.isDirty && station.item.kind === 'ingredient') {
      const ing = station.item.item;
      if (canAddIngredientToDish(held.item.ingredients, ing)) {
        held.item.ingredients.push(ing);
        held.item.dishType = matchIngredientsToRecipe(held.item.ingredients)?.id;
        station.item = undefined;
        player.scoreContribution.assembled += 1;
        return;
      }
    }
  }
}

export function handleInteract(
  player: PlayerState,
  station: Station | null,
  dt: number,
  state: GameSimulationState
): void {
  // Fire extinguishing
  if (player.heldItem?.kind === 'utensil' && player.heldItem.item.type === 'fire_extinguisher') {
    player.currentAction = 'extinguish';
    if (station && station.onFire) {
      station.fireProgress = Math.max(0, (station.fireProgress ?? 1) - EXTINGUISH_SPEED_PER_SEC * dt);
      if (station.fireProgress <= 0) {
        station.onFire = false;
        station.fireProgress = 0;
        if (station.applianceUtensil) {
          station.applianceUtensil.isBurning = false;
          station.applianceUtensil.contents = [];
          station.applianceUtensil.cookProgress = 0;
        }
        player.scoreContribution.extinguished += 1;
        state.firesCount = Math.max(0, state.firesCount - 1);
      }
    }
    return;
  }

  if (!station) {
    return;
  }

  // Chopping at cutting board
  if (station.type === 'cutting_board' && station.item?.kind === 'ingredient') {
    const ing = station.item.item;
    if (ing.state === 'raw') {
      player.currentAction = 'chop';
      station.chopProgress = (station.chopProgress ?? 0) + CHOP_SPEED_PER_SEC * dt;
      ing.chopProgress = station.chopProgress;
      if (station.chopProgress >= 1.0) {
        ing.state = 'chopped';
        ing.chopProgress = 1.0;
        station.chopProgress = 0;
        player.scoreContribution.prepared += 1;
        player.currentAction = 'idle';
      }
    }
    return;
  }

  // Washing dirty plates at sink
  if (station.type === 'sink' && (station.dirtyPlateCount ?? 0) > 0) {
    player.currentAction = 'wash';
    station.washProgress = (station.washProgress ?? 0) + WASH_SPEED_PER_SEC * dt;
    if (station.washProgress >= 1.0) {
      station.dirtyPlateCount = Math.max(0, (station.dirtyPlateCount ?? 1) - 1);
      station.cleanPlateCount = (station.cleanPlateCount ?? 0) + 1;
      station.washProgress = 0;
      player.scoreContribution.washed += 1;
      player.currentAction = 'idle';
    }
    return;
  }
}

function createIngredient(type: IngredientType): Ingredient {
  return {
    id: `ing_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type,
    state: 'raw',
    chopProgress: 0,
    cookProgress: 0,
  };
}

export function createUtensil(type: 'pan' | 'pot' | 'fire_extinguisher'): UtensilItem {
  return {
    id: `utensil_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type,
    contents: [],
    cookProgress: 0,
    isCooking: false,
    isBurning: false,
    fireTimer: 0,
  };
}

function canBeChopped(ingredient: Ingredient): boolean {
  if (ingredient.state !== 'raw') return false;
  // Ingredients that require chopping
  const choppables: IngredientType[] = [
    'lettuce',
    'tomato',
    'cucumber',
    'onion',
    'potato',
    'fish',
    'mushroom',
  ];
  return choppables.includes(ingredient.type);
}

function canCookInUtensil(ingredient: Ingredient, utensil: UtensilItem): boolean {
  if (utensil.type === 'pan') {
    // Pan cooks: beef (raw -> cooked), fish (chopped -> cooked), egg, fried rice ingredients
    if (ingredient.type === 'beef' && ingredient.state === 'raw') return true;
    if (ingredient.type === 'fish' && ingredient.state === 'chopped') return true;
    if (ingredient.type === 'egg' || ingredient.type === 'rice' || (ingredient.type === 'onion' && ingredient.state === 'chopped')) return true;
  }
  if (utensil.type === 'pot') {
    // Pot cooks: rice (boiled), pasta (boiled), soup (onion, tomato)
    if (ingredient.type === 'rice' && ingredient.state === 'raw') return true;
    if (ingredient.type === 'pasta' && ingredient.state === 'raw') return true;
    if (ingredient.type === 'onion' && ingredient.state === 'chopped') return true;
    if (ingredient.type === 'tomato' && ingredient.state === 'chopped') return true;
  }
  return false;
}

function deliverPlate(
  player: PlayerState,
  plate: PlateItem,
  state: GameSimulationState
): void {
  // Check if plate matches any active customer order
  const matchedIndex = state.activeOrders.findIndex((order) => {
    return plate.dishType === order.recipeId;
  });

  if (matchedIndex !== -1) {
    const order = state.activeOrders[matchedIndex];
    // Fast delivery tip calculation
    const timeRatio = order.remainingTime / order.duration;
    const tip = Math.floor(order.baseScore * 0.5 * timeRatio);
    const orderScore = (order.baseScore + tip) * state.combo;

    state.score += orderScore;
    state.combo = Math.min(4, state.combo + 1);
    if (state.combo > state.highestCombo) {
      state.highestCombo = state.combo;
    }
    state.completedOrdersCount += 1;
    state.totalTips += tip;
    player.scoreContribution.delivered += 1;

    // Remove completed order
    state.activeOrders.splice(matchedIndex, 1);

    // Add floating score text
    state.floatingTexts.push({
      id: `float_${Date.now()}`,
      text: `+${orderScore}đ (${order.nameVi})`,
      x: player.x,
      y: player.y,
      color: '#22c55e',
      duration: 1.5,
      elapsed: 0,
    });
  } else {
    // Delivery of wrong/incomplete dish penalty
    state.score = Math.max(0, state.score - 10);
    state.combo = 1;
    state.failedOrdersCount += 1;

    state.floatingTexts.push({
      id: `float_${Date.now()}`,
      text: `-10đ Sai món!`,
      x: player.x,
      y: player.y,
      color: '#ef4444',
      duration: 1.5,
      elapsed: 0,
    });
  }

  // After 6 seconds, a dirty plate returns to the sink or counter
  setTimeoutDirtyPlateReturn(state);
}

function setTimeoutDirtyPlateReturn(state: GameSimulationState): void {
  // Add to one of the sinks or counters
  const sink = Object.values(state.stations).find((s) => s.type === 'sink');
  if (sink) {
    sink.dirtyPlateCount = (sink.dirtyPlateCount ?? 0) + 1;
  }
}
