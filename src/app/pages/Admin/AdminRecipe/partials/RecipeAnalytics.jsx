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
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-5xl font-semibold text-avocado-brown-100 mb-4">
          Phân tích & Dự báo
        </h2>
        <p className="text-3xl text-avocado-brown-50 font-light">
          Phân tích thị trường và dự báo xu hướng
        </p>
      </div>

      <div className="flex items-center gap-6 mb-8">
        <label className="text-3xl font-medium text-gray-700">Phân khúc:</label>
        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="px-6 py-4 text-3xl border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-avocado-green-100"
        >
          {USER_SEGMENTS.map((seg) => (
            <option key={seg.value} value={seg.value}>
              {seg.label}
            </option>
          ))}
        </select>
        <button
          onClick={handleForecast}
          className="ml-auto px-10 py-5 text-3xl bg-avocado-green-100 text-avocado-brown-100 rounded-2xl hover:bg-avocado-green-80 font-medium transition-colors"
          disabled={loading}
        >
          Dự báo 30 ngày
        </button>
      </div>

      <div className="flex gap-3 border-b-2 border-gray-200">
        {["insights", "recommendations", "forecast"].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-10 py-6 text-3xl font-medium transition-all ${
              activeView === view
                ? "text-avocado-brown-100 border-b-4 border-avocado-green-100"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {view === "insights"
              ? "Market Insights"
              : view === "recommendations"
              ? "Recommendations"
              : "Forecast"}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeView === "insights" && marketInsights && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(marketInsights).map(([key, value]) => (
              <div
                key={key}
                className="bg-white p-8 rounded-2xl border-2 border-gray-200"
              >
                <h3 className="font-semibold text-3xl text-gray-900 mb-4 capitalize">
                  {key.replace(/_/g, " ")}
                </h3>
                <div className="text-2xl text-gray-600">
                  {typeof value === "object"
                    ? JSON.stringify(value, null, 2)
                    : value}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === "recommendations" && segmentRecommendations && (
          <div className="space-y-6">
            {segmentRecommendations.recommendations?.map((rec, index) => (
              <div
                key={index}
                className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200"
              >
                <h3 className="font-semibold text-3xl text-gray-900 mb-4">
                  {rec.title}
                </h3>
                <p className="text-2xl text-gray-700">{rec.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeView === "forecast" && forecastData && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-8 rounded-2xl border-2 border-purple-200">
              <h3 className="font-semibold text-3xl text-gray-900 mb-6">
                Dự báo 30 ngày
              </h3>
              <pre className="text-2xl text-gray-700 overflow-auto">
                {JSON.stringify(forecastData, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center p-16">
            <div className="w-12 h-12 border-4 border-avocado-green-100 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeAnalytics;
