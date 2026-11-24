import { DishType, IngredientType, IngredientState } from '../../types/game';

export interface RecipeRequirement {
  type: IngredientType;
  state: IngredientState;
  quantity?: number;
}

export interface RecipeDefinition {
  id: DishType;
  nameVi: string;
  descriptionVi: string;
  requirements: RecipeRequirement[];
  requiresCooking: boolean;
  cookMethod?: 'stove_pan' | 'stove_pot' | 'oven' | 'deep_fryer';
  prepTimeSeconds: number;
  cookTimeSeconds: number;
  baseScore: number;
  expireTimeSeconds: number;
  difficulty: 'easy' | 'normal' | 'hard';
  color: string;
  icon: string;
}

export const RECIPES: Record<DishType, RecipeDefinition> = {
  salad: {
    id: 'salad',
    nameVi: 'Salad rau củ',
    descriptionVi: 'Salad tươi ngon với xà lách, cà chua và dưa leo thái lát',
    requirements: [
      { type: 'lettuce', state: 'chopped', quantity: 1 },
      { type: 'tomato', state: 'chopped', quantity: 1 },
      { type: 'cucumber', state: 'chopped', quantity: 1 },
    ],
    requiresCooking: false,
    prepTimeSeconds: 6,
    cookTimeSeconds: 0,
    baseScore: 50,
    expireTimeSeconds: 90,
    difficulty: 'easy',
    color: '#4ade80',
    icon: '🥗',
  },
  hamburger: {
    id: 'hamburger',
    nameVi: 'Bánh hamburger',
    descriptionVi: 'Bánh mì kẹp thịt bò áp chảo, xà lách tươi và cà chua',
    requirements: [
      { type: 'bun', state: 'raw', quantity: 1 },
      { type: 'beef', state: 'cooked', quantity: 1 },
      { type: 'lettuce', state: 'chopped', quantity: 1 },
      { type: 'tomato', state: 'chopped', quantity: 1 },
    ],
    requiresCooking: true,
    cookMethod: 'stove_pan',
    prepTimeSeconds: 8,
    cookTimeSeconds: 8,
    baseScore: 90,
    expireTimeSeconds: 110,
    difficulty: 'normal',
    color: '#f97316',
    icon: '🍔',
  },
  cheeseburger: {
    id: 'cheeseburger',
    nameVi: 'Hamburger phô mai',
    descriptionVi: 'Bánh mì kẹp thịt bò nướng thơm lừng cùng lát phô mai béo ngậy',
    requirements: [
      { type: 'bun', state: 'raw', quantity: 1 },
      { type: 'beef', state: 'cooked', quantity: 1 },
      { type: 'cheese', state: 'raw', quantity: 1 },
    ],
    requiresCooking: true,
    cookMethod: 'stove_pan',
    prepTimeSeconds: 6,
    cookTimeSeconds: 8,
    baseScore: 80,
    expireTimeSeconds: 100,
    difficulty: 'easy',
    color: '#eab308',
    icon: '🧀',
  },
  pizza: {
    id: 'pizza',
    nameVi: 'Bánh pizza',
    descriptionVi: 'Đế bánh pizza cùng sốt cà chua và phô mai nướng trong lò',
    requirements: [
      { type: 'dough', state: 'raw', quantity: 1 },
      { type: 'tomato', state: 'chopped', quantity: 1 },
      { type: 'cheese', state: 'raw', quantity: 1 },
    ],
    requiresCooking: true,
    cookMethod: 'oven',
    prepTimeSeconds: 8,
    cookTimeSeconds: 12,
    baseScore: 95,
    expireTimeSeconds: 115,
    difficulty: 'normal',
    color: '#ef4444',
    icon: '🍕',
  },
  mushroom_pizza: {
    id: 'mushroom_pizza',
    nameVi: 'Pizza nấm',
    descriptionVi: 'Đế pizza đặc biệt với nấm thái lát, cà chua và phô mai nướng giòn',
    requirements: [
      { type: 'dough', state: 'raw', quantity: 1 },
      { type: 'tomato', state: 'chopped', quantity: 1 },
      { type: 'cheese', state: 'raw', quantity: 1 },
      { type: 'mushroom', state: 'chopped', quantity: 1 },
    ],
    requiresCooking: true,
    cookMethod: 'oven',
    prepTimeSeconds: 10,
    cookTimeSeconds: 14,
    baseScore: 120,
    expireTimeSeconds: 125,
    difficulty: 'hard',
    color: '#d97706',
    icon: '🍄',
  },
  sushi: {
    id: 'sushi',
    nameVi: 'Sushi',
    descriptionVi: 'Cơm dẻo cuốn rong biển cùng cá hồi tươi ngon thái lát',
    requirements: [
      { type: 'rice', state: 'cooked', quantity: 1 },
      { type: 'seaweed', state: 'raw', quantity: 1 },
      { type: 'fish', state: 'chopped', quantity: 1 },
    ],
    requiresCooking: true,
    cookMethod: 'stove_pot',
    prepTimeSeconds: 8,
    cookTimeSeconds: 10,
    baseScore: 100,
    expireTimeSeconds: 110,
    difficulty: 'normal',
    color: '#06b6d4',
    icon: '🍣',
  },
  fried_rice: {
    id: 'fried_rice',
    nameVi: 'Cơm chiên',
    descriptionVi: 'Cơm chiên vàng ươm cùng trứng thơm bùi và rau củ thanh ngọt',
    requirements: [
      { type: 'rice', state: 'cooked', quantity: 1 },
      { type: 'egg', state: 'raw', quantity: 1 },
      { type: 'onion', state: 'chopped', quantity: 1 },
    ],
    requiresCooking: true,
    cookMethod: 'stove_pan',
    prepTimeSeconds: 9,
    cookTimeSeconds: 10,
    baseScore: 105,
    expireTimeSeconds: 115,
    difficulty: 'normal',
    color: '#facc15',
    icon: '🍚',
  },
  pasta: {
    id: 'pasta',
    nameVi: 'Mì Ý',
    descriptionVi: 'Mì Ý luộc chín tới hòa quyện cùng nước sốt cà chua đậm đà',
    requirements: [
      { type: 'pasta', state: 'cooked', quantity: 1 },
      { type: 'sauce', state: 'cooked', quantity: 1 },
    ],
    requiresCooking: true,
    cookMethod: 'stove_pot',
    prepTimeSeconds: 8,
    cookTimeSeconds: 10,
    baseScore: 85,
    expireTimeSeconds: 100,
    difficulty: 'easy',
    color: '#ec4899',
    icon: '🍝',
  },
  onion_soup: {
    id: 'onion_soup',
    nameVi: 'Súp hành tây',
    descriptionVi: 'Súp hành tây hầm ngọt thanh từ hành tây thái nhỏ',
    requirements: [
      { type: 'onion', state: 'chopped', quantity: 3 },
    ],
    requiresCooking: true,
    cookMethod: 'stove_pot',
    prepTimeSeconds: 9,
    cookTimeSeconds: 12,
    baseScore: 80,
    expireTimeSeconds: 95,
    difficulty: 'easy',
    color: '#a855f7',
    icon: '🥣',
  },
  tomato_soup: {
    id: 'tomato_soup',
    nameVi: 'Súp cà chua',
    descriptionVi: 'Súp cà chua nóng hổi đỏ mọng giàu dinh dưỡng',
    requirements: [
      { type: 'tomato', state: 'chopped', quantity: 3 },
    ],
    requiresCooking: true,
    cookMethod: 'stove_pot',
    prepTimeSeconds: 9,
    cookTimeSeconds: 12,
    baseScore: 80,
    expireTimeSeconds: 95,
    difficulty: 'easy',
    color: '#f43f5e',
    icon: '🍲',
  },
  french_fries: {
    id: 'french_fries',
    nameVi: 'Khoai tây chiên',
    descriptionVi: 'Khoai tây xắt sợi chiên ngập dầu giòn rụm màu vàng óng',
    requirements: [
      { type: 'potato', state: 'chopped', quantity: 2 },
    ],
    requiresCooking: true,
    cookMethod: 'deep_fryer',
    prepTimeSeconds: 6,
    cookTimeSeconds: 8,
    baseScore: 60,
    expireTimeSeconds: 85,
    difficulty: 'easy',
    color: '#fbbf24',
    icon: '🍟',
  },
  grilled_fish: {
    id: 'grilled_fish',
    nameVi: 'Cá nướng',
    descriptionVi: 'Phi lê cá tươi nướng trên chảo thơm nức mũi',
    requirements: [
      { type: 'fish', state: 'chopped', quantity: 1 },
    ],
    requiresCooking: true,
    cookMethod: 'stove_pan',
    prepTimeSeconds: 5,
    cookTimeSeconds: 9,
    baseScore: 70,
    expireTimeSeconds: 90,
    difficulty: 'easy',
    color: '#38bdf8',
    icon: '🐟',
  },
};
