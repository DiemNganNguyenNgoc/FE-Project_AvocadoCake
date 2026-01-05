/**
 * Recipe Service - Kết nối với RCM_RECIPE_2 Backend API
 * Base URL: http://localhost:8000/api/v1
 */

import { transformRecipeResponse } from "../utils/recipeTransformHelper";

const RECIPE_API_BASE_URL =
  process.env.REACT_APP_RECIPE_API_URL ||
  "https://rcm-recipe-3.onrender.com/api/v1/";

class RecipeAPIService {
  constructor() {
    // Đảm bảo baseURL luôn có dấu / ở cuối
    this.baseURL = RECIPE_API_BASE_URL.endsWith("/")
      ? RECIPE_API_BASE_URL
      : RECIPE_API_BASE_URL + "/";

    // Base URL cho root endpoints (không có /api/v1/)
    // Xử lý cả absolute URLs (http://...) và relative URLs (/recipe-api)
    if (
      this.baseURL.startsWith("http://") ||
      this.baseURL.startsWith("https://")
    ) {
      // Absolute URL - extract protocol và host
      const url = new URL(this.baseURL);
      this.rootURL = `${url.protocol}//${url.host}/`;
    } else {
      // Relative URL - dùng relative path
      this.rootURL = this.baseURL.replace(/\/api\/v1\/$/, "/");
    }

    console.log("🔧 RecipeService initialized:");
    console.log("   baseURL:", this.baseURL);
    console.log("   rootURL:", this.rootURL);
  }

  /**
   * Helper method để xử lý API calls
   */
  async handleRequest(endpoint, options = {}) {
    // Sử dụng baseURL custom nếu có, nếu không dùng baseURL mặc định
    const baseUrl = options.baseURL || this.baseURL;
    const url = `${baseUrl}${endpoint}`;

    // Debug log để kiểm tra URL
    console.log(`🔗 API Call: ${url}`);

    const config = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // Copy options nhưng loại bỏ baseURL custom
    const { baseURL: _, ...restOptions } = options;
    Object.assign(config, restOptions);

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API Request Error:", error);
      throw this.formatError(error);
    }
  }

  /**
   * Format error messages
   */
  formatError(error) {
    if (error.message.includes("Failed to fetch")) {
      return new Error(
        "Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối."
      );
    }
    return error;
  }

  // ==================== RECIPES ENDPOINTS ====================

  /**
   * Tạo công thức từ nguyên liệu
   * POST /api/v1/recipes/generate-from-ingredients
   * @param {Object} data - { ingredients: string, language: string, use_t5: boolean }
   */
  async generateFromIngredients(data) {
    const response = await this.handleRequest(
      "recipes/generate-from-ingredients",
      {
        method: "POST",
        body: {
          ingredients: data.ingredients,
          language: data.language || "vi",
          use_t5: data.use_t5 !== undefined ? data.use_t5 : true,
        },
      }
    );

    // Transform backend response to match frontend expectations
    // Backend returns: { result: { recipe: {...}, analytics: {...}, metadata: {...} } }
    // Frontend expects: { recipe: {...}, analytics: {...} }
    if (response && response.result && response.result.recipe) {
      const recipeData = response.result.recipe;
      const analyticsData = response.result.analytics || {};
      const metadataData = response.result.metadata || {};

      // Map backend fields to frontend expected format
      return {
        recipe: {
          name: recipeData.name || recipeData.title,
          title: recipeData.title || recipeData.name,
          description: recipeData.description,
          prep_time: recipeData.prep_time,
          cook_time: recipeData.cook_time,
          servings: recipeData.servings,
          difficulty: recipeData.difficulty,
          ingredients: Array.isArray(recipeData.ingredients)
            ? recipeData.ingredients
                .map((ing) => {
                  if (typeof ing === "string") return ing;
                  // If ingredient is object with name, quantity, unit
                  if (ing.name) {
                    const parts = [];
                    if (ing.quantity) parts.push(ing.quantity);
                    if (ing.unit) parts.push(ing.unit);
                    if (ing.name) parts.push(ing.name);
                    return parts.join(" ");
                  }
                  return "";
                })
                .filter((ing) => ing.trim() !== "")
            : [],
          instructions: Array.isArray(recipeData.instructions)
            ? recipeData.instructions
                .map((inst) => {
                  if (typeof inst === "string") return inst;
                  // If instruction is object with step
                  if (inst.step) return inst.step;
                  if (inst.instruction) return inst.instruction;
                  return "";
                })
                .filter((inst) => inst.trim() !== "")
            : [],
          tips: recipeData.tips || [],
          tags: recipeData.tags || [],
          estimated_cost: recipeData.estimated_cost,
          // NEW FIELDS from backend
          marketing_caption: recipeData.marketing_caption,
          decoration_tips: recipeData.decoration_tips,
          notes: recipeData.notes,
          image_prompt: recipeData.image_prompt,
        },
        analytics: analyticsData,
        metadata: metadataData,
      };
    }

    // Fallback: old format with response.data
    if (response && response.data) {
      const recipeData = response.data;

      return {
        recipe: {
          name: recipeData.title || recipeData.name,
          title: recipeData.title || recipeData.name,
          description: recipeData.description,
          prep_time: recipeData.prep_time,
          cook_time: recipeData.cook_time,
          servings: recipeData.servings,
          difficulty: recipeData.difficulty,
          ingredients: Array.isArray(recipeData.ingredients)
            ? recipeData.ingredients
                .map((ing) => {
                  if (typeof ing === "string") return ing;
                  if (ing.name) {
                    const parts = [];
                    if (ing.quantity) parts.push(ing.quantity);
                    if (ing.unit) parts.push(ing.unit);
                    if (ing.name) parts.push(ing.name);
                    return parts.join(" ");
                  }
                  return "";
                })
                .filter((ing) => ing.trim() !== "")
            : [],
          instructions: Array.isArray(recipeData.instructions)
            ? recipeData.instructions
                .map((inst) => {
                  if (typeof inst === "string") return inst;
                  if (inst.step) return inst.step;
                  if (inst.instruction) return inst.instruction;
                  return "";
                })
                .filter((inst) => inst.trim() !== "")
            : [],
          tips: recipeData.tips || [],
          tags: recipeData.tags || [],
          estimated_cost: recipeData.estimated_cost,
          marketing_caption: recipeData.marketing_caption,
          decoration_tips: recipeData.decoration_tips,
          notes: recipeData.notes,
          image_prompt: recipeData.image_prompt,
        },
        analytics: {
          trend_score: recipeData.trend_score,
          popularity_score: recipeData.popularity_score,
          health_score: recipeData.health_score,
          innovation_score: recipeData.innovation_score,
          overall_score: recipeData.overall_score,
          recommendation: recipeData.recommendation,
        },
        metadata: {
          id: recipeData.id,
          language: recipeData.language,
          user_segment: recipeData.user_segment,
          trend_context: recipeData.trend_context,
          created_at: recipeData.created_at,
        },
      };
    }

    return response;
  }

  /**
   * Tạo công thức từ xu hướng
   * POST /api/v1/recipes/generate-from-trend
   * @param {Object} data - { trend: string, user_segment: string, occasion: string, language: string }
   */
  async generateFromTrend(data) {
    const response = await this.handleRequest("recipes/generate-from-trend", {
      method: "POST",
      body: {
        trend: data.trend,
        user_segment: data.user_segment,
        occasion: data.occasion || null,
        language: data.language || "vi",
      },
    });

    // Transform backend response to match frontend expectations
    // Backend returns: { result: { recipe: {...}, analytics: {...}, metadata: {...} } }
    // Frontend expects: { recipe: {...}, analytics: {...} }
    if (response && response.result && response.result.recipe) {
      const recipeData = response.result.recipe;
      const analyticsData = response.result.analytics || {};
      const metadataData = response.result.metadata || {};

      // Map backend fields to frontend expected format
      return {
        recipe: {
          name: recipeData.name || recipeData.title,
          title: recipeData.title || recipeData.name,
          description: recipeData.description,
          prep_time: recipeData.prep_time,
          cook_time: recipeData.cook_time,
          servings: recipeData.servings,
          difficulty: recipeData.difficulty,
          ingredients: Array.isArray(recipeData.ingredients)
            ? recipeData.ingredients
                .map((ing) => {
                  if (typeof ing === "string") return ing;
                  // If ingredient is object with name, quantity, unit
                  if (ing.name) {
                    const parts = [];
                    if (ing.quantity) parts.push(ing.quantity);
                    if (ing.unit) parts.push(ing.unit);
                    if (ing.name) parts.push(ing.name);
                    return parts.join(" ");
                  }
                  return "";
                })
                .filter((ing) => ing.trim() !== "")
            : [],
          instructions: Array.isArray(recipeData.instructions)
            ? recipeData.instructions
                .map((inst) => {
                  if (typeof inst === "string") return inst;
                  // If instruction is object with step
                  if (inst.step) return inst.step;
                  if (inst.instruction) return inst.instruction;
                  return "";
                })
                .filter((inst) => inst.trim() !== "")
            : [],
          tips: recipeData.tips || [],
          tags: recipeData.tags || [],
          estimated_cost: recipeData.estimated_cost,
          // NEW FIELDS from backend
          marketing_caption: recipeData.marketing_caption,
          decoration_tips: recipeData.decoration_tips,
          notes: recipeData.notes,
          image_prompt: recipeData.image_prompt,
        },
        analytics: analyticsData,
        metadata: metadataData,
      };
    }

    // Fallback: old format with response.data
    if (response && response.data) {
      const recipeData = response.data;

      return {
        recipe: {
          name: recipeData.title || recipeData.name,
          title: recipeData.title || recipeData.name,
          description: recipeData.description,
          prep_time: recipeData.prep_time,
          cook_time: recipeData.cook_time,
          servings: recipeData.servings,
          difficulty: recipeData.difficulty,
          ingredients: Array.isArray(recipeData.ingredients)
            ? recipeData.ingredients
                .map((ing) => {
                  if (typeof ing === "string") return ing;
                  if (ing.name) {
                    const parts = [];
                    if (ing.quantity) parts.push(ing.quantity);
                    if (ing.unit) parts.push(ing.unit);
                    if (ing.name) parts.push(ing.name);
                    return parts.join(" ");
                  }
                  return "";
                })
                .filter((ing) => ing.trim() !== "")
            : [],
          instructions: Array.isArray(recipeData.instructions)
            ? recipeData.instructions
                .map((inst) => {
                  if (typeof inst === "string") return inst;
                  if (inst.step) return inst.step;
                  if (inst.instruction) return inst.instruction;
                  return "";
                })
                .filter((inst) => inst.trim() !== "")
            : [],
          tips: recipeData.tips || [],
          tags: recipeData.tags || [],
          estimated_cost: recipeData.estimated_cost,
          marketing_caption: recipeData.marketing_caption,
          decoration_tips: recipeData.decoration_tips,
          notes: recipeData.notes,
          image_prompt: recipeData.image_prompt,
        },
        analytics: {
          trend_score: recipeData.trend_score,
          popularity_score: recipeData.popularity_score,
          health_score: recipeData.health_score,
          innovation_score: recipeData.innovation_score,
          overall_score: recipeData.overall_score,
          recommendation: recipeData.recommendation,
        },
        metadata: {
          id: recipeData.id,
          language: recipeData.language,
          user_segment: recipeData.user_segment,
          trend_context: recipeData.trend_context,
          created_at: recipeData.created_at,
        },
      };
    }

    return response;
  }

  /**
   * Health check cho recipes service
   * GET /api/v1/recipes/health
   */
  async recipesHealthCheck() {
    return this.handleRequest("recipes/health");
  }

  // ==================== TRENDS ENDPOINTS ====================

  /**
   * Lấy xu hướng hiện tại
   * GET /api/v1/trends/current
   */
  async getCurrentTrends() {
    return this.handleRequest("trends/current");
  }

  /**
   * Health check cho trends service
   * GET /api/v1/trends/health
   */
  async trendsHealthCheck() {
    return this.handleRequest("trends/health");
  }

  // ==================== ANALYTICS ENDPOINTS ====================

  /**
   * Dự đoán xu hướng trong tương lai
   * POST /api/v1/analytics/predict-trends
   * @param {Object} data - { target_date: string, user_segment: string, location: string, custom_context: object }
   */
  async predictTrends(data) {
    return this.handleRequest("analytics/predict-trends", {
      method: "POST",
      body: {
        target_date: data.target_date || null,
        user_segment: data.user_segment || "gen_z",
        location: data.location || "vietnam",
        custom_context: data.custom_context || null,
      },
    });
  }

  /**
   * Dự báo và tạo công thức đề xuất
   * POST /api/v1/analytics/forecast-and-generate
   * @param {Object} data - { user_segment: string, horizon_days: number, top_k: number, include_market_analysis: boolean }
   */
  async forecastAndGenerate(data) {
    return this.handleRequest("analytics/forecast-and-generate", {
      method: "POST",
      body: {
        user_segment: data.user_segment || "gen_z",
        horizon_days: data.horizon_days || 30,
        top_k: data.top_k || 3,
        include_market_analysis: data.include_market_analysis !== false,
        location: data.location || "vietnam",
        custom_context: data.custom_context || null,
      },
    });
  }

  /**
   * Tạo công thức thông minh với phân tích
   * POST /api/v1/analytics/generate-smart-recipe
   * @param {Object} data - { user_segment: string, target_date: string, trend_keywords: array, include_market_analysis: boolean }
   */
  async generateSmartRecipe(data) {
    return this.handleRequest("analytics/generate-smart-recipe", {
      method: "POST",
      body: {
        user_segment: data.user_segment,
        target_date: data.target_date || null,
        trend_keywords: data.trend_keywords || null,
        include_market_analysis: data.include_market_analysis !== false,
      },
    });
  }

  /**
   * Lấy market insights cho segment
   * GET /api/v1/analytics/market-insights/{segment}
   * @param {string} segment - User segment
   * @param {Object} params - { target_date: string, include_competition: boolean }
   */
  async getMarketInsights(segment, params = {}) {
    const queryParams = new URLSearchParams();
    if (params.target_date)
      queryParams.append("target_date", params.target_date);
    if (params.include_competition !== undefined) {
      queryParams.append("include_competition", params.include_competition);
    }

    const query = queryParams.toString();
    const endpoint = `analytics/market-insights/${segment}${
      query ? `?${query}` : ""
    }`;

    return this.handleRequest(endpoint);
  }

  /**
   * Lấy xu hướng hot hiện tại
   * GET /api/v1/analytics/trending-now
   */
  async getTrendingNow() {
    return this.handleRequest("analytics/trending-now");
  }

  /**
   * Lấy gợi ý cho segment cụ thể
   * GET /api/v1/analytics/segment-recommendations/{segment}
   * @param {string} segment - User segment
   */
  async getSegmentRecommendations(segment) {
    return this.handleRequest(`analytics/segment-recommendations/${segment}`);
  }

  /**
   * Train ML models
   * POST /api/v1/analytics/train
   */
  async trainModels() {
    return this.handleRequest("analytics/train", {
      method: "POST",
    });
  }

  // ==================== SMART AUTO-GENERATE (NEW) ====================

  /**
   * Generate image from recipe description using Pollinations AI
   * POST /api/v1/smart/generate-image
   * @param {Object} data - { recipe_data: object, recipe_title: string, recipe_description: string, image_prompt: string }
   */
  async generateImage(data) {
    const response = await this.handleRequest("smart/generate-image", {
      method: "POST",
      body: data,
    });

    console.log("🔍 Raw API Response:", response);

    // Response format: { success: boolean, image_data: string, image_url: string, provider: string, ... }
    // Ensure all fields are present
    return {
      success: response.success || false,
      image_data: response.image_data || null,
      image_url: response.image_url || null,
      provider: response.provider || null,
      prompt_used: response.prompt_used || response.image_prompt_used || null,
      message: response.message || null,
      error: response.error || null,
    };
  }

  /**
   * Preview context for smart generation
   * GET /api/v1/smart/context-preview
   * @param {Object} params - { days_ahead: number }
   */
  async getContextPreview(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.days_ahead !== undefined)
      queryParams.append("days_ahead", params.days_ahead);

    const query = queryParams.toString();
    const endpoint = `smart/context-preview${query ? `?${query}` : ""}`;

    return this.handleRequest(endpoint);
  }

  /**
   * Smart Generate Recipe - Auto-generate with zero user input
   * POST /api/v1/smart/generate
   * @param {Object} data - { language: string, target_segment: string, days_ahead: number }
   */
  async smartGenerate(data) {
    const response = await this.handleRequest("smart/generate", {
      method: "POST",
      body: {
        language: data.language || "vi",
        target_segment: data.target_segment || "gen_z",
        days_ahead: data.days_ahead !== undefined ? data.days_ahead : 0,
      },
    });

    console.log("🔍 Smart Generate Raw Response:", response);

    // Transform response - backend trả về: { status: "success", data: {...} }
    // Trong đó data chứa: title, description, ingredients, instructions, marketing_caption, decoration_tips, notes, image_prompt, etc.
    if (response && response.data) {
      const recipeData = response.data;

      return {
        recipe: {
          name: recipeData.title,
          description: recipeData.description,
          prep_time: recipeData.prep_time,
          cook_time: recipeData.cook_time,
          servings: recipeData.servings,
          difficulty: recipeData.difficulty,
          ingredients: Array.isArray(recipeData.ingredients)
            ? recipeData.ingredients
                .map((ing) => {
                  if (typeof ing === "string") return ing;
                  // Backend trả về object với name, quantity, unit, category
                  if (ing.name) {
                    const parts = [];
                    if (ing.quantity) parts.push(ing.quantity);
                    if (ing.unit) parts.push(ing.unit);
                    if (ing.name) parts.push(ing.name);
                    return parts.join(" ");
                  }
                  return "";
                })
                .filter((ing) => ing.trim() !== "")
            : [],
          instructions: Array.isArray(recipeData.instructions)
            ? recipeData.instructions
                .map((inst) => {
                  if (typeof inst === "string") return inst;
                  if (inst.step) return inst.step;
                  if (inst.instruction) return inst.instruction;
                  return "";
                })
                .filter((inst) => inst.trim() !== "")
            : [],
          tips: recipeData.tips || [],
          tags: recipeData.tags || [],
          estimated_cost: recipeData.estimated_cost,
          // NEW FIELDS from backend - CRITICAL: Bổ sung các trường quan trọng
          marketing_caption: recipeData.marketing_caption,
          decoration_tips: recipeData.decoration_tips,
          notes: recipeData.notes,
          image_prompt: recipeData.image_prompt,
        },
        analytics: {
          trend_score: recipeData.trend_score || 0,
          popularity_score: recipeData.popularity_score || 0,
          health_score: recipeData.health_score || 0,
          innovation_score: recipeData.innovation_score || 0,
          overall_score: recipeData.overall_score || 0,
          recommendation: recipeData.recommendation || "",
          viral_potential: recipeData.viral_potential || {
            score: 0,
            level: "Low",
          },
        },
        marketing: {
          primary_channel: recipeData.primary_channel || [],
          posting_time: recipeData.posting_time || "",
          hashtags: recipeData.hashtags || [],
          caption_style: recipeData.caption_style || "",
          visual_theme: recipeData.visual_theme || {},
          pricing_strategy: recipeData.pricing_strategy || {},
          promotion_ideas: recipeData.promotion_ideas || [],
        },
        context: {
          current_date:
            recipeData.current_date || new Date().toISOString().split("T")[0],
          day_of_week: recipeData.day_of_week || "",
          season: recipeData.season || "",
          month: recipeData.month || new Date().getMonth() + 1,
          temperature: recipeData.temperature || "",
          main_event: recipeData.main_event || "",
          all_events: recipeData.all_events || [],
          trending_flavors: recipeData.trending_flavors || [],
          popular_occasions: recipeData.popular_occasions || [],
          demand_factor: recipeData.demand_factor || 0,
          target_segment:
            recipeData.target_segment || recipeData.user_segment || "gen_z",
          market_potential: recipeData.market_potential || 0,
          competition_level: recipeData.competition_level || 0,
          price_sensitivity: recipeData.price_sensitivity || "",
        },
        next_events: recipeData.next_events || [],
        metadata: {
          id: recipeData.id,
          language: recipeData.language,
          user_segment: recipeData.user_segment,
          trend_context: recipeData.trend_context,
          created_at: recipeData.created_at,
          generation_mode: "smart_auto",
        },
      };
    }

    return response;
  }

  // ==================== HEALTH & STATUS ====================

  /**
   * Health check tổng thể
   * GET /health (không có /api/v1 prefix)
   */
  async healthCheck() {
    return this.handleRequest("health", {
      baseURL: this.rootURL,
    });
  }

  /**
   * Lấy thông tin API
   * GET / (không có /api/v1 prefix)
   */
  async getApiInfo() {
    return this.handleRequest("", {
      baseURL: this.rootURL,
    });
  }

  /**
   * Ping endpoint (keep-alive)
   * GET /ping (không có /api/v1 prefix)
   */
  async ping() {
    return this.handleRequest("ping", {
      baseURL: this.rootURL,
    });
  }
}

// Export singleton instance
const recipeAPIService = new RecipeAPIService();
export default recipeAPIService;

// Export constants
export const USER_SEGMENTS = [
  {
    value: "gen_z",
    label: "Gen Z (18-25 tuổi)",
    description: "Năng động, theo trend, thích Instagram",
  },
  {
    value: "millennials",
    label: "Millennials (26-40 tuổi)",
    description: "Chú trọng chất lượng, organic",
  },
  {
    value: "gym",
    label: "Gym Enthusiast",
    description: "Ưu tiên protein, low-carb, healthy",
  },
  {
    value: "kids",
    label: "Trẻ em & Phụ huynh",
    description: "An toàn, vui nhộn, màu sắc",
  },
  {
    value: "health",
    label: "Sức khỏe",
    description: "Organic, low-sugar, dinh dưỡng",
  },
];

export const LANGUAGES = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
];

export const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Dễ", color: "green" },
  { value: "medium", label: "Trung bình", color: "orange" },
  { value: "hard", label: "Khó", color: "red" },
];
