import { useState, useCallback, useEffect } from "react";
import recipeAPIService from "./services/RecipeService";

/**
 * Custom Hook for Recipe Management
 * Quản lý state cho toàn bộ module AdminRecipe bằng React hooks
 * Không sử dụng Zustand - Chỉ dùng React hooks thuần túy
 */
const useAdminRecipeStore = () => {
  // ==================== STATE ====================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [recipeHistory, setRecipeHistory] = useState([]);
  const [currentTrends, setCurrentTrends] = useState([]);
  const [trendingNow, setTrendingNow] = useState(null);
  const [marketInsights, setMarketInsights] = useState(null);
  const [segmentRecommendations, setSegmentRecommendations] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [activeTab, setActiveTab] = useState("generate-ingredient");
  const [selectedSegment, setSelectedSegment] = useState("gen_z");

  // ==================== LOAD HISTORY ====================
  const loadHistory = useCallback(() => {
    try {
      const saved = localStorage.getItem("recipeHistory");
      if (saved) {
        setRecipeHistory(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // ==================== HELPER FUNCTIONS ====================
  const clearError = useCallback(() => setError(null), []);

  // Format error message để user-friendly
  const formatErrorMessage = useCallback((error) => {
    const errorMsg = error.message || error.toString();

    // Kiểm tra lỗi rate limit từ Gemini
    if (
      errorMsg.includes("429") ||
      errorMsg.includes("Quota exceeded") ||
      errorMsg.includes("RATE_LIMIT_EXCEEDED") ||
      errorMsg.includes("quota metric")
    ) {
      return "⏱️ Gemini API đang quá tải. Vui lòng đợi 1-2 phút rồi thử lại. Hệ thống đang sử dụng free tier với giới hạn 15 request/phút.";
    }

    // Kiểm tra lỗi kết nối
    if (errorMsg.includes("Failed to fetch") || errorMsg.includes("Network")) {
      return "🔌 Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.";
    }

    // Kiểm tra lỗi API key
    if (
      errorMsg.includes("API key") ||
      errorMsg.includes("401") ||
      errorMsg.includes("403")
    ) {
      return "🔑 Lỗi xác thực API. Vui lòng kiểm tra API key trong backend.";
    }

    // Trả về lỗi gốc nếu không match
    return errorMsg;
  }, []);

  const addToHistory = useCallback(
    (recipe) => {
      const newHistory = [
        {
          ...recipe,
          timestamp: new Date().toISOString(),
          id: Date.now(),
        },
        ...recipeHistory,
      ].slice(0, 20);

      setRecipeHistory(newHistory);

      try {
        localStorage.setItem("recipeHistory", JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage:", error);
      }
    },
    [recipeHistory]
  );

  const clearHistory = useCallback(() => {
    setRecipeHistory([]);
    localStorage.removeItem("recipeHistory");
  }, []);

  const deleteFromHistory = useCallback((id) => {
    setRecipeHistory((prev) => {
      const newHistory = prev.filter((recipe) => recipe.id !== id);
      try {
        localStorage.setItem("recipeHistory", JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to update history:", error);
      }
      return newHistory;
    });
  }, []);

  // ==================== API CALLS ====================

  const generateFromIngredients = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const result = await recipeAPIService.generateFromIngredients(data);
        setCurrentRecipe(result);

        addToHistory({
          type: "from-ingredients",
          data: data,
          result: result,
        });

        return result;
      } catch (err) {
        const formattedError = formatErrorMessage(err);
        setError(formattedError);
        throw new Error(formattedError);
      } finally {
        setLoading(false);
      }
    },
    [addToHistory, formatErrorMessage]
  );

  const generateFromTrend = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const result = await recipeAPIService.generateFromTrend(data);
        setCurrentRecipe(result);

        addToHistory({
          type: "from-trend",
          data: data,
          result: result,
        });

        return result;
      } catch (err) {
        const formattedError = formatErrorMessage(err);
        setError(formattedError);
        throw new Error(formattedError);
      } finally {
        setLoading(false);
      }
    },
    [addToHistory, formatErrorMessage]
  );

  const fetchCurrentTrends = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const trends = await recipeAPIService.getCurrentTrends();
      setCurrentTrends(trends);
      return trends;
    } catch (err) {
      const formattedError = formatErrorMessage(err);
      setError(formattedError);
      throw new Error(formattedError);
    } finally {
      setLoading(false);
    }
  }, [formatErrorMessage]);

  const fetchTrendingNow = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await recipeAPIService.getTrendingNow();
      setTrendingNow(data);
      return data;
    } catch (err) {
      const formattedError = formatErrorMessage(err);
      setError(formattedError);
      throw new Error(formattedError);
    } finally {
      setLoading(false);
    }
  }, [formatErrorMessage]);

  const predictTrends = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const result = await recipeAPIService.predictTrends(data);
        return result;
      } catch (err) {
        const formattedError = formatErrorMessage(err);
        setError(formattedError);
        throw new Error(formattedError);
      } finally {
        setLoading(false);
      }
    },
    [formatErrorMessage]
  );

  const forecastAndGenerate = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const result = await recipeAPIService.forecastAndGenerate(data);
        setForecastData(result);
        return result;
      } catch (err) {
        const formattedError = formatErrorMessage(err);
        setError(formattedError);
        throw new Error(formattedError);
      } finally {
        setLoading(false);
      }
    },
    [formatErrorMessage]
  );

  const generateSmartRecipe = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const result = await recipeAPIService.generateSmartRecipe(data);
        setCurrentRecipe(result);

        addToHistory({
          type: "smart-recipe",
          data: data,
          result: result,
        });

        return result;
      } catch (err) {
        const formattedError = formatErrorMessage(err);
        setError(formattedError);
        throw new Error(formattedError);
      } finally {
        setLoading(false);
      }
    },
    [addToHistory, formatErrorMessage]
  );

  const fetchMarketInsights = useCallback(
    async (segment, params = {}) => {
      setLoading(true);
      setError(null);

      try {
        const insights = await recipeAPIService.getMarketInsights(
          segment,
          params
        );
        setMarketInsights(insights);
        return insights;
      } catch (err) {
        const formattedError = formatErrorMessage(err);
        setError(formattedError);
        throw new Error(formattedError);
      } finally {
        setLoading(false);
      }
    },
    [formatErrorMessage]
  );

  const fetchSegmentRecommendations = useCallback(
    async (segment) => {
      setLoading(true);
      setError(null);

      try {
        const recommendations =
          await recipeAPIService.getSegmentRecommendations(segment);
        setSegmentRecommendations(recommendations);
        return recommendations;
      } catch (err) {
        const formattedError = formatErrorMessage(err);
        setError(formattedError);
        throw new Error(formattedError);
      } finally {
        setLoading(false);
      }
    },
    [formatErrorMessage]
  );

  const trainModels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await recipeAPIService.trainModels();
      return result;
    } catch (err) {
      const formattedError = formatErrorMessage(err);
      setError(formattedError);
      throw new Error(formattedError);
    } finally {
      setLoading(false);
    }
  }, [formatErrorMessage]);

  const checkHealth = useCallback(async () => {
    try {
      const health = await recipeAPIService.healthCheck();
      return health;
    } catch (err) {
      const formattedError = formatErrorMessage(err);
      console.error("Health check failed:", formattedError);
      throw new Error(formattedError);
    }
  }, [formatErrorMessage]);

  // ==================== RETURN ====================
  return {
    // State
    loading,
    error,
    currentRecipe,
    recipeHistory,
    currentTrends,
    trendingNow,
    marketInsights,
    segmentRecommendations,
    forecastData,
    activeTab,
    selectedSegment,

    // Setters
    setLoading,
    setError,
    clearError,
    setActiveTab,
    setSelectedSegment,

    // History management
    addToHistory,
    loadHistory,
    clearHistory,
    deleteFromHistory,

    // API calls
    generateFromIngredients,
    generateFromTrend,
    fetchCurrentTrends,
    fetchTrendingNow,
    predictTrends,
    forecastAndGenerate,
    generateSmartRecipe,
    fetchMarketInsights,
    fetchSegmentRecommendations,
    trainModels,
    checkHealth,
  };
};

export default useAdminRecipeStore;
