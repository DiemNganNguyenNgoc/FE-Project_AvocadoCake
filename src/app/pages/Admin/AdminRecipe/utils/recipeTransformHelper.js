/**
 * Helper functions to transform recipe data from backend to frontend format
 */

/**
 * Transform recipe data from backend response to frontend expected format
 * @param {Object} response - Full backend response
 * @returns {Object} Transformed data with recipe, analytics, metadata
 */
export const transformRecipeResponse = (response) => {
  // Handle format: { result: { recipe, analytics, metadata } }
  if (response && response.result && response.result.recipe) {
    const recipeData = response.result.recipe;
    const analyticsData = response.result.analytics || {};
    const metadataData = response.result.metadata || {};

    return {
      recipe: transformRecipeData(recipeData),
      analytics: analyticsData,
      metadata: metadataData,
    };
  }

  // Handle format: { status, model_used, data: { ...recipe fields } }
  if (response && response.data) {
    const recipeData = response.data;

    return {
      recipe: transformRecipeData(recipeData),
      analytics: extractAnalytics(recipeData),
      metadata: extractMetadata(recipeData),
    };
  }

  // Return as-is if no known format
  return response;
};

/**
 * Transform recipe data keeping all fields as-is
 * @param {Object} recipeData - Recipe data from backend
 * @returns {Object} Transformed recipe data
 */
const transformRecipeData = (recipeData) => {
  return {
    name: recipeData.name || recipeData.title,
    title: recipeData.title || recipeData.name,
    description: recipeData.description,
    prep_time: recipeData.prep_time,
    cook_time: recipeData.cook_time,
    servings: recipeData.servings,
    difficulty: recipeData.difficulty,
    // Keep ingredients as-is (can be array of strings or array of objects)
    ingredients: Array.isArray(recipeData.ingredients)
      ? recipeData.ingredients
      : [],
    // Keep instructions as-is (array of strings)
    instructions: Array.isArray(recipeData.instructions)
      ? recipeData.instructions
      : [],
    tips: recipeData.tips || [],
    tags: recipeData.tags || [],
    estimated_cost: recipeData.estimated_cost,
    // NEW FIELDS from Gemini
    marketing_caption: recipeData.marketing_caption,
    decoration_tips: recipeData.decoration_tips,
    notes: recipeData.notes,
    image_prompt: recipeData.image_prompt,
  };
};

/**
 * Extract analytics data from recipe response
 * @param {Object} recipeData - Recipe data that may contain analytics fields
 * @returns {Object} Analytics data
 */
const extractAnalytics = (recipeData) => {
  return {
    trend_score: recipeData.trend_score,
    popularity_score: recipeData.popularity_score,
    health_score: recipeData.health_score,
    innovation_score: recipeData.innovation_score,
    overall_score: recipeData.overall_score,
    recommendation: recipeData.recommendation,
  };
};

/**
 * Extract metadata from recipe response
 * @param {Object} recipeData - Recipe data that may contain metadata fields
 * @returns {Object} Metadata
 */
const extractMetadata = (recipeData) => {
  return {
    id: recipeData.id,
    language: recipeData.language,
    user_segment: recipeData.user_segment,
    trend_context: recipeData.trend_context,
    created_at: recipeData.created_at,
  };
};
