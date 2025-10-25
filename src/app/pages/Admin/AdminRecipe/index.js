/**
 * AdminRecipe Module Exports
 * Main entry point for AI Recipe Generator
 */

export { default } from "./AdminRecipe";
export { default as useAdminRecipeStore } from "./adminRecipeStore";
export { default as recipeAPIService } from "./services/RecipeService";

// Export use case components from partials
export { default as GenerateFromIngredient } from "./usecases/GenerateFromIngredient";
export { default as GenerateFromTrend } from "./partials/GenerateFromTrend";
export { default as RecipeAnalytics } from "./partials/RecipeAnalytics";
export { default as RecipeHistory } from "./partials/RecipeHistory";

// Export shared components
export { default as RecipeDisplay } from "./partials/RecipeDisplay";
