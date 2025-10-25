import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAdminRecipeStore from "../adminRecipeStore";
import { USER_SEGMENTS } from "../services/RecipeService";

const RecipeAnalytics = () => {
  const {
    fetchMarketInsights,
    fetchSegmentRecommendations,
    forecastAndGenerate,
    predictTrends,
    loading,
    marketInsights,
    segmentRecommendations,
    forecastData,
    selectedSegment,
    setSelectedSegment,
  } = useAdminRecipeStore();

  const [activeView, setActiveView] = useState("insights");

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSegment]);

  const loadAnalytics = async () => {
    try {
      await Promise.all([
        fetchMarketInsights(selectedSegment),
        fetchSegmentRecommendations(selectedSegment),
      ]);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  const handleForecast = async () => {
    try {
      toast.info("🔮 Đang dự báo xu hướng...");
      await forecastAndGenerate({
        user_segment: selectedSegment,
        horizon_days: 30,
      });
      toast.success("✅ Dự báo thành công!");
    } catch (error) {
      toast.error(`❌ Lỗi: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Phân tích & Dự báo
        </h2>
        <p className="text-gray-600">
          Phân tích thị trường và dự báo xu hướng cho chiến lược kinh doanh
        </p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm font-medium text-gray-700">Phân khúc:</label>
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
        >
          {USER_SEGMENTS.map((seg) => (
            <option key={seg.value} value={seg.value}>
              {seg.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleForecast}
          className="ml-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
          disabled={loading}
        >
          🔮 Dự báo 30 ngày
        </button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {["insights", "recommendations", "forecast"].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-6 py-3 font-medium transition-all ${
              activeView === view
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {view === "insights"
              ? "📈 Market Insights"
              : view === "recommendations"
              ? "💡 Recommendations"
              : "🔮 Forecast"}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeView === "insights" && marketInsights && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(marketInsights).map(([key, value]) => (
              <div
                key={key}
                className="bg-white p-6 rounded-lg border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                  {key.replace(/_/g, " ")}
                </h3>
                <div className="text-sm text-gray-600">
                  {typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : value}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === "recommendations" && segmentRecommendations && (
          <div className="space-y-4">
            {segmentRecommendations.recommendations?.map((rec, index) => (
              <div
                key={index}
                className="bg-blue-50 p-6 rounded-lg border border-blue-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {rec.title}
                </h3>
                <p className="text-gray-700">{rec.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeView === "forecast" && forecastData && (
          <div className="space-y-4">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                📊 Dự báo 30 ngày
              </h3>
              <pre className="text-sm text-gray-700 overflow-auto">
                {JSON.stringify(forecastData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeAnalytics;
