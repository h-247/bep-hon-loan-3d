import { DishType, Ingredient } from '../../types/game';
import { RECIPES, RecipeDefinition } from './RecipeDefinitions';

export function matchIngredientsToRecipe(ingredients: Ingredient[]): RecipeDefinition | null {
  if (ingredients.length === 0) return null;

  for (const recipe of Object.values(RECIPES)) {
    if (isIngredientsMatchingRecipe(ingredients, recipe)) {
      return recipe;
    }
  }
  return null;
}

export function isIngredientsMatchingRecipe(
  ingredients: Ingredient[],
  recipe: RecipeDefinition
): boolean {
  // Count needed ingredients
  const neededMap: Record<string, number> = {};
  for (const req of recipe.requirements) {
    const key = `${req.type}:${req.state}`;
    const qty = req.quantity ?? 1;
    neededMap[key] = (neededMap[key] || 0) + qty;
  }

  // Count provided ingredients
  const providedMap: Record<string, number> = {};
  for (const ing of ingredients) {
    const key = `${ing.type}:${ing.state}`;
    providedMap[key] = (providedMap[key] || 0) + 1;
  }

  // Exact match on keys and quantities
  const neededKeys = Object.keys(neededMap);
  const providedKeys = Object.keys(providedMap);

  if (neededKeys.length !== providedKeys.length) return false;

  for (const key of neededKeys) {
    if (providedMap[key] !== neededMap[key]) {
      return false;
    }
  }

  return true;
}

export function canAddIngredientToDish(
  currentIngredients: Ingredient[],
  newIngredient: Ingredient,
  targetRecipeId?: DishType
): boolean {
  // If target recipe specified, test against it
  if (targetRecipeId) {
    const recipe = RECIPES[targetRecipeId];
    if (!recipe) return false;
    return isCompatibleWithRecipe([...currentIngredients, newIngredient], recipe);
  }

  // Otherwise check if adding this ingredient is a valid partial subset of ANY recipe
  for (const recipe of Object.values(RECIPES)) {
    if (isCompatibleWithRecipe([...currentIngredients, newIngredient], recipe)) {
      return true;
    }
  }
  return false;
}

export function isCompatibleWithRecipe(
  ingredients: Ingredient[],
  recipe: RecipeDefinition
): boolean {
  const neededMap: Record<string, number> = {};
  for (const req of recipe.requirements) {
    const key = `${req.type}:${req.state}`;
    const qty = req.quantity ?? 1;
    neededMap[key] = (neededMap[key] || 0) + qty;
  }

  const providedMap: Record<string, number> = {};
  for (const ing of ingredients) {
    const key = `${ing.type}:${ing.state}`;
    providedMap[key] = (providedMap[key] || 0) + 1;
  }

  for (const key of Object.keys(providedMap)) {
    if (!neededMap[key]) return false;
    if (providedMap[key] > neededMap[key]) return false;
  }

  return true;
}
