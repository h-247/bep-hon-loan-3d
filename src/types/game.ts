export type IngredientType =
  | 'lettuce'
  | 'tomato'
  | 'cucumber'
  | 'onion'
  | 'potato'
  | 'beef'
  | 'fish'
  | 'mushroom'
  | 'cheese'
  | 'bun'
  | 'dough'
  | 'rice'
  | 'seaweed'
  | 'egg'
  | 'pasta'
  | 'sauce';

export type IngredientState =
  | 'raw'
  | 'chopped'
  | 'cooking'
  | 'cooked'
  | 'overcooked'
  | 'burned';

export interface Ingredient {
  id: string;
  type: IngredientType;
  state: IngredientState;
  chopProgress: number; // 0 to 1
  cookProgress: number; // 0 to 1 (> 1 is overcooking, >= 1.5 is burning)
}

export type DishType =
  | 'salad'
  | 'hamburger'
  | 'cheeseburger'
  | 'pizza'
  | 'mushroom_pizza'
  | 'sushi'
  | 'fried_rice'
  | 'pasta'
  | 'onion_soup'
  | 'tomato_soup'
  | 'french_fries'
  | 'grilled_fish';

export interface PlateItem {
  id: string;
  isDirty: boolean;
  dishType?: DishType;
  ingredients: Ingredient[];
}

export type UtensilType = 'pan' | 'pot' | 'fire_extinguisher';

export interface UtensilItem {
  id: string;
  type: UtensilType;
  contents: Ingredient[];
  cookProgress: number;
  isCooking: boolean;
  isBurning: boolean;
  fireTimer: number;
}

export type HeldItem =
  | { kind: 'ingredient'; item: Ingredient }
  | { kind: 'plate'; item: PlateItem }
  | { kind: 'utensil'; item: UtensilItem };

export type StationType =
  | 'crate'
  | 'counter'
  | 'cutting_board'
  | 'stove'
  | 'oven'
  | 'deep_fryer'
  | 'plate_dispenser'
  | 'sink'
  | 'serving_window'
  | 'trash'
  | 'extinguisher_stand';

export interface Station {
  id: string;
  type: StationType;
  x: number; // Grid column
  y: number; // Grid row
  item?: HeldItem;
  crateIngredient?: IngredientType;
  washProgress?: number; // For sink: 0 to 1
  chopProgress?: number; // For cutting board: 0 to 1
  dirtyPlateCount?: number;
  cleanPlateCount?: number;
  onFire?: boolean;
  fireProgress?: number; // 0 to 1
  occupiedByPlayerId?: string;
  applianceUtensil?: UtensilItem; // e.g. Pan resting on stove
}

export type ChefAction =
  | 'idle'
  | 'walk'
  | 'run'
  | 'dash'
  | 'chop'
  | 'wash'
  | 'cook'
  | 'extinguish'
  | 'cheer'
  | 'sad';

export interface PlayerContribution {
  prepared: number;
  cooked: number;
  assembled: number;
  delivered: number;
  washed: number;
  extinguished: number;
}

export interface PlayerState {
  id: string;
  name: string;
  characterId: string;
  color: string;
  x: number; // World units
  y: number; // World units (Z in 3D)
  facing: { x: number; y: number };
  vx: number;
  vy: number;
  isDashing: boolean;
  dashTimer: number;
  dashCooldown: number;
  heldItem?: HeldItem;
  isInteracting: boolean;
  currentAction: ChefAction;
  isAI: boolean;
  aiCommand?: string;
  scoreContribution: PlayerContribution;
}

export interface CustomerOrder {
  id: string;
  recipeId: DishType;
  nameVi: string;
  requiredIngredients: {
    type: IngredientType;
    state: IngredientState;
  }[];
  duration: number; // Total seconds
  remainingTime: number; // Remaining seconds
  baseScore: number;
  urgency: 'normal' | 'urgent' | 'critical';
}

export interface FloatingTextEffect {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  duration: number;
  elapsed: number;
}

export interface KitchenHazard {
  id: string;
  type: 'moving_platform' | 'conveyor' | 'sliding_floor' | 'fire_spurt';
  x: number;
  y: number;
  width: number;
  height: number;
  direction?: { x: number; y: number };
  speed?: number;
  active: boolean;
  timer: number;
}

export interface KitchenPing {
  id: string;
  playerId: string;
  playerName: string;
  x: number;
  y: number;
  duration: number;
  elapsed: number;
  type: 'general' | 'help' | 'fire' | 'urgent';
}

export interface QuickChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
}

export type GameMode = 'single' | 'ai' | 'local' | 'online' | 'practice';

export interface KitchenLevelConfig {
  id: string;
  worldId: number;
  levelNumber: number;
  name: string;
  descriptionVi: string;
  difficulty: 'easy' | 'normal' | 'hard' | 'extreme';
  environmentTheme:
    | 'basic'
    | 'fast_food'
    | 'italian'
    | 'asian'
    | 'moving'
    | 'chaotic';
  timeLimit: number; // seconds (0 for practice mode)
  starThresholds: [number, number, number];
  width: number;
  height: number;
  tiles: number[][]; // 0: empty floor, 1: counter/obstacle, 2: void/wall
  stations: Station[];
  spawnPoints: { x: number; y: number }[];
  availableRecipes: DishType[];
  orderInterval: number; // seconds between orders
  maxSimultaneousOrders: number;
  hazards?: KitchenHazard[];
}

export interface GameSimulationState {
  level: KitchenLevelConfig;
  mode: GameMode;
  status: 'countdown' | 'playing' | 'paused' | 'completed' | 'failed';
  countdownTimer: number;
  timeRemaining: number;
  score: number;
  combo: number;
  highestCombo: number;
  completedOrdersCount: number;
  failedOrdersCount: number;
  totalTips: number;
  players: Record<string, PlayerState>;
  stations: Record<string, Station>;
  activeOrders: CustomerOrder[];
  orderQueue: CustomerOrder[];
  floatingTexts: FloatingTextEffect[];
  pings: KitchenPing[];
  chatMessages: QuickChatMessage[];
  firesCount: number;
  randomSeed: number;
}
