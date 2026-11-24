import { GameSimulationState, CustomerOrder, DishType } from '../../types/game';
import { RECIPES } from '../recipes/RecipeDefinitions';
import { PRNG } from '../core/PRNG';

export function updateOrders(
  state: GameSimulationState,
  dt: number,
  prng: PRNG,
  orderSpawnTimer: { value: number }
): void {
  // 1. Advance existing orders and handle expiration
  for (let i = state.activeOrders.length - 1; i >= 0; i--) {
    const order = state.activeOrders[i];
    order.remainingTime -= dt;

    const ratio = order.remainingTime / order.duration;
    if (ratio <= 0.2) {
      order.urgency = 'critical';
    } else if (ratio <= 0.45) {
      order.urgency = 'urgent';
    } else {
      order.urgency = 'normal';
    }

    if (order.remainingTime <= 0) {
      // Order expired!
      state.activeOrders.splice(i, 1);
      state.score = Math.max(0, state.score - 20);
      state.combo = 1;
      state.failedOrdersCount += 1;

      state.floatingTexts.push({
        id: `expired_${Date.now()}_${order.id}`,
        text: `-20đ Hết giờ! (${order.nameVi})`,
        x: state.level.width / 2,
        y: 1.0,
        color: '#ef4444',
        duration: 2.0,
        elapsed: 0,
      });
    }
  }

  // 2. Spawn new orders if below maximum capacity
  orderSpawnTimer.value += dt;
  if (
    orderSpawnTimer.value >= state.level.orderInterval &&
    state.activeOrders.length < state.level.maxSimultaneousOrders
  ) {
    orderSpawnTimer.value = 0;
    spawnNewOrder(state, prng);
  }
}

export function spawnNewOrder(state: GameSimulationState, prng: PRNG): CustomerOrder | null {
  const recipes = state.level.availableRecipes;
  if (!recipes || recipes.length === 0) return null;

  const recipeId = prng.pickOne(recipes);
  const def = RECIPES[recipeId];
  if (!def) return null;

  const order: CustomerOrder = {
    id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    recipeId,
    nameVi: def.nameVi,
    requiredIngredients: def.requirements.map((r) => ({
      type: r.type,
      state: r.state,
    })),
    duration: def.expireTimeSeconds,
    remainingTime: def.expireTimeSeconds,
    baseScore: def.baseScore,
    urgency: 'normal',
  };

  state.activeOrders.push(order);
  return order;
}
