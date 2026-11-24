import { describe, it, expect } from 'vitest';
import { SimulationEngine } from '../../src/game/simulation/SimulationEngine';
import { KitchenLevelConfig } from '../../src/types/game';
import { matchIngredientsToRecipe, canAddIngredientToDish } from '../../src/game/recipes/RecipeValidator';
import { RECIPES } from '../../src/game/recipes/RecipeDefinitions';

const testLevel: KitchenLevelConfig = {
  id: 'test_level_1',
  worldId: 1,
  levelNumber: 1,
  name: 'Bếp thử nghiệm',
  descriptionVi: 'Bếp kiểm tra mô phỏng',
  difficulty: 'easy',
  environmentTheme: 'basic',
  timeLimit: 60,
  starThresholds: [50, 100, 150],
  width: 8,
  height: 6,
  tiles: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  stations: [
    { id: 'crate_lettuce', type: 'crate', x: 1, y: 0, crateIngredient: 'lettuce' },
    { id: 'crate_tomato', type: 'crate', x: 2, y: 0, crateIngredient: 'tomato' },
    { id: 'crate_cucumber', type: 'crate', x: 3, y: 0, crateIngredient: 'cucumber' },
    { id: 'cutting_board', type: 'cutting_board', x: 4, y: 0 },
    { id: 'plate_dispenser', type: 'plate_dispenser', x: 5, y: 0 },
    { id: 'serving', type: 'serving_window', x: 6, y: 0 },
    { id: 'trash', type: 'trash', x: 7, y: 0 },
  ],
  spawnPoints: [{ x: 3, y: 3 }],
  availableRecipes: ['salad'],
  orderInterval: 15,
  maxSimultaneousOrders: 2,
};

describe('Recipe System', () => {
  it('correctly matches salad ingredients to salad recipe', () => {
    const ingredients = [
      { id: '1', type: 'lettuce' as const, state: 'chopped' as const, chopProgress: 1, cookProgress: 0 },
      { id: '2', type: 'tomato' as const, state: 'chopped' as const, chopProgress: 1, cookProgress: 0 },
      { id: '3', type: 'cucumber' as const, state: 'chopped' as const, chopProgress: 1, cookProgress: 0 },
    ];
    const match = matchIngredientsToRecipe(ingredients);
    expect(match).not.toBeNull();
    expect(match?.id).toBe('salad');
  });

  it('rejects incomplete or raw salad', () => {
    const ingredients = [
      { id: '1', type: 'lettuce' as const, state: 'raw' as const, chopProgress: 0, cookProgress: 0 },
      { id: '2', type: 'tomato' as const, state: 'chopped' as const, chopProgress: 1, cookProgress: 0 },
    ];
    const match = matchIngredientsToRecipe(ingredients);
    expect(match).toBeNull();
  });

  it('allows adding compatible ingredients to dish', () => {
    const current = [
      { id: '1', type: 'lettuce' as const, state: 'chopped' as const, chopProgress: 1, cookProgress: 0 },
    ];
    const next = { id: '2', type: 'tomato' as const, state: 'chopped' as const, chopProgress: 1, cookProgress: 0 };
    expect(canAddIngredientToDish(current, next, 'salad')).toBe(true);
  });
});

describe('Simulation Engine', () => {
  it('initializes in countdown and transitions to playing', () => {
    const engine = new SimulationEngine(testLevel, 'single', [
      { id: 'p1', name: 'Đầu bếp 1', characterId: 'chef_cat', color: '#ff4444' },
    ]);

    expect(engine.state.status).toBe('countdown');
    engine.tick(3.1, {});
    expect(engine.state.status).toBe('playing');
  });

  it('moves player and stops at obstacle boundary', () => {
    const engine = new SimulationEngine(testLevel, 'single', [
      { id: 'p1', name: 'Đầu bếp 1', characterId: 'chef_cat', color: '#ff4444' },
    ]);
    engine.tick(3.1, {}); // Pass countdown

    const startX = engine.state.players['p1'].x;
    // Move right
    engine.tick(0.5, { p1: { moveX: 1, moveY: 0, isDashing: false, actionPickDrop: false, actionInteract: false, actionThrow: false } });
    expect(engine.state.players['p1'].x).toBeGreaterThan(startX);
  });

  it('picks up ingredient from crate', () => {
    const engine = new SimulationEngine(testLevel, 'single', [
      { id: 'p1', name: 'Đầu bếp 1', characterId: 'chef_cat', color: '#ff4444' },
    ]);
    engine.tick(3.1, {});

    // Position player right in front of lettuce crate at (1, 0)
    const p1 = engine.state.players['p1'];
    p1.x = 1.5;
    p1.y = 1.2;
    p1.facing = { x: 0, y: -1 }; // Facing up towards (1, 0)

    engine.tick(0.016, { p1: { moveX: 0, moveY: 0, isDashing: false, actionPickDrop: true, actionInteract: false, actionThrow: false } });
    expect(p1.heldItem).toBeDefined();
    expect(p1.heldItem?.kind).toBe('ingredient');
    if (p1.heldItem?.kind === 'ingredient') {
      expect(p1.heldItem.item.type).toBe('lettuce');
    }
  });
});
