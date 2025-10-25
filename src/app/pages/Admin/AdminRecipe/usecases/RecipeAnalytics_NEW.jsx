import React, { useState } from "react";
import { BarChart3, TrendingUp, Users, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import recipeAPIService from "../services/RecipeService";
import RecipeDisplay from "../components/RecipeDisplay";
import Button from "../../../components/AdminLayout/Button";
import Select from "../../../components/AdminLayout/Select";

/**
 * RecipeAnalytics - Phân tích và dự báo
 * React thuần + TailwindCSS + AdminLayout components
 */
const RecipeAnalytics = ({
  loading,
  setLoading,
  currentRecipe,
  setCurrentRecipe,
  addToHistory,
}) => {
  // State
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState("forecast");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState("gen_z");

  // User segment options
  const segmentOptions = [
    { value: "gen_z", label: "👨‍🎓 Gen Z (18-25)" },
    { value: "millennials", label: "👔 Millennials (26-40)" },
    { value: "gym", label: "💪 Gym/Fitness" },
    { value: "kids", label: "👶 Trẻ em" },
    { value: "health", label: "🥗 Sức khỏe" },
  ];

  /**
   * Analytics tabs
   */
  const analyticsTabs = [
    {
      id: "forecast",
      label: "Dự báo & Tạo công thức",
      icon: TrendingUp,
      description: "Dự báo xu hướng và tự động tạo công thức",
    },
    {
      id: "market",
      label: "Phân tích thị trường",
      icon: BarChart3,
      description: "Phân tích chi tiết thị trường hiện tại",
    },
    {
      id: "segment",
      label: "Gợi ý theo Segment",
      icon: Users,
      description: "Gợi ý công thức cho từng nhóm khách hàng",
    },
  ];

  /**
   * Handle Forecast and Generate
   */
  const handleForecastAndGenerate = async () => {
    setLoading(true);
    setAnalyticsData(null);
    setCurrentRecipe(null);

    try {
      const result = await recipeAPIService.forecastAndGenerate();

      if (result.success) {
        setAnalyticsData(result);

        // If recipe generated, display it
        if (result.recipe) {
          const recipeData = {
            ...result,
            type: "forecast",
            params: { method: "forecast_and_generate" },
          };
          setCurrentRecipe(recipeData);
          addToHistory(recipeData);
        }

        toast.success("✅ Dự báo và tạo công thức thành công!");
      } else {
        toast.error(`❌ ${result.error || "Lỗi không xác định"}`);
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Market Insights
   */
  const handleMarketInsights = async () => {
    setLoading(true);
    setAnalyticsData(null);
    setCurrentRecipe(null);

    try {
      const result = await recipeAPIService.getMarketInsights();

      if (result.success) {
        setAnalyticsData(result);
        toast.success("✅ Phân tích thị trường thành công!");
      } else {
        toast.error(`❌ ${result.error || "Lỗi không xác định"}`);
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Segment Recommendations
   */
  const handleSegmentRecommendations = async () => {
    setLoading(true);
    setAnalyticsData(null);
    setCurrentRecipe(null);

    try {
      const result = await recipeAPIService.getSegmentRecommendations(
        selectedSegment
      );

      if (result.success) {
        setAnalyticsData(result);
        toast.success(`✅ Gợi ý cho segment ${selectedSegment} thành công!`);
      } else {
        toast.error(`❌ ${result.error || "Lỗi không xác định"}`);
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Execute analytics action
   */
  const executeAnalytics = () => {
    switch (activeAnalyticsTab) {
      case "forecast":
        handleForecastAndGenerate();
        break;
      case "market":
        handleMarketInsights();
        break;
      case "segment":
        handleSegmentRecommendations();
        break;
      default:
        break;
    }
  };

  /**
   * Render analytics result
   */
  const renderAnalyticsResult = () => {
    if (!analyticsData) return null;

    return (
      <div className="space-y-6">
        {/* Forecast Result */}
        {activeAnalyticsTab === "forecast" && analyticsData.forecast && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Dự báo xu hướng
            </h3>

            <div className="space-y-3">
              {analyticsData.forecast.predictions && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    📊 Dự báo:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analyticsData.forecast.predictions
                      .slice(0, 8)
                      .map((pred, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white dark:bg-dark-3 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-stroke-dark"
                        >
                          {pred}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {analyticsData.forecast.confidence_score && (
                <div className="bg-white dark:bg-dark-3 rounded-lg p-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Độ tin cậy:</strong>{" "}
                    <span className="text-primary font-semibold">
                      {(analyticsData.forecast.confidence_score * 100).toFixed(
                        1
                      )}
                      %
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Market Insights Result */}
        {activeAnalyticsTab === "market" && analyticsData.insights && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Phân tích thị trường
            </h3>

            <div className="space-y-3">
              {analyticsData.insights.trending_flavors && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    🍰 Hương vị xu hướng:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analyticsData.insights.trending_flavors.map(
                      (flavor, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white dark:bg-dark-3 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-stroke-dark"
                        >
                          {flavor}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

              {analyticsData.insights.market_summary && (
                <div className="bg-white dark:bg-dark-3 rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {analyticsData.insights.market_summary}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Segment Recommendations Result */}
        {activeAnalyticsTab === "segment" && analyticsData.recommendations && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Gợi ý cho {selectedSegment}
            </h3>

            <div className="space-y-3">
              {analyticsData.recommendations.suggested_recipes && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    💡 Công thức gợi ý:
                  </p>
                  <div className="space-y-2">
                    {analyticsData.recommendations.suggested_recipes.map(
                      (recipe, index) => (
                        <div
                          key={index}
                          className="bg-white dark:bg-dark-3 rounded-lg p-3 border border-gray-200 dark:border-stroke-dark"
                        >
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {recipe.name || recipe}
                          </p>
                          {recipe.score && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              Điểm phù hợp:{" "}
                              <span className="text-primary font-semibold">
                                {recipe.score}
                              </span>
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {analyticsData.recommendations.target_preferences && (
                <div className="bg-white dark:bg-dark-3 rounded-lg p-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    🎯 Sở thích mục tiêu:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {analyticsData.recommendations.target_preferences}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recipe Display */}
        {analyticsData.recipe && currentRecipe && (
          <div className="mt-6">
            <RecipeDisplay recipe={currentRecipe} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Phân tích & Dự báo
        </h2>
      </div>

      {/* Analytics Sub-tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {analyticsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAnalyticsTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveAnalyticsTab(tab.id);
                setAnalyticsData(null);
                setCurrentRecipe(null);
              }}
              className={`
                flex flex-col items-center gap-2 p-4 rounded-xl font-medium transition-all
                ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-gray-50 dark:bg-dark-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-4"
                }
              `}
              title={tab.description}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="bg-gray-50 dark:bg-dark-3 rounded-xl p-6 border border-gray-200 dark:border-stroke-dark space-y-4">
        {/* Segment selector (only for segment tab) */}
        {activeAnalyticsTab === "segment" && (
          <Select
            label="👥 Chọn đối tượng khách hàng"
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            options={segmentOptions}
            disabled={loading}
          />
        )}

        {/* Execute Button */}
        <Button
          variant="primary"
          onClick={executeAnalytics}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Đang phân tích...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {activeAnalyticsTab === "forecast" && "Dự báo & Tạo công thức"}
              {activeAnalyticsTab === "market" && "Phân tích thị trường"}
              {activeAnalyticsTab === "segment" && "Lấy gợi ý"}
            </>
          )}
        </Button>
      </div>

      {/* Result */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              🤖 Đang phân tích dữ liệu...
            </p>
          </div>
        ) : analyticsData ? (
          renderAnalyticsResult()
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
            <div className="text-8xl">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Chưa có dữ liệu phân tích
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Chọn loại phân tích và nhấn nút để bắt đầu
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeAnalytics;
