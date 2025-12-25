import React, { useState } from "react";
import { toast } from "react-toastify";
import { BarChart3, TrendingUp, Target, Loader2 } from "lucide-react";
import useAdminRecipeStore from "../adminRecipeStore";
import { USER_SEGMENTS } from "../services/RecipeService";

/**
 * RecipeAnalytics Component
 * Phân tích thị trường và dự báo xu hướng
 */
const RecipeAnalytics = () => {
  const {
    forecastAndGenerate,
    fetchMarketInsights,
    fetchSegmentRecommendations,
    loading,
    forecastData,
    marketInsights,
    segmentRecommendations,
  } = useAdminRecipeStore();

  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState("forecast");
  const [selectedSegment, setSelectedSegment] = useState("gen_z");
  const [horizonDays, setHorizonDays] = useState(30);

  /**
   * Handle forecast
   */
  const handleForecast = async () => {
    try {
      toast.info("📊 Đang dự báo xu hướng...");
      await forecastAndGenerate({
        user_segment: selectedSegment,
        horizon_days: horizonDays,
        top_k: 3,
        include_market_analysis: true,
      });
      toast.success("✅ Dự báo thành công!");
    } catch (error) {
      toast.error(`❌ Lỗi: ${error.message}`);
    }
  };

  /**
   * Handle market insights
   */
  const handleMarketInsights = async () => {
    try {
      toast.info("📈 Đang phân tích thị trường...");
      await fetchMarketInsights(selectedSegment, {
        include_competition: true,
      });
      toast.success("✅ Phân tích thành công!");
    } catch (error) {
      toast.error(`❌ Lỗi: ${error.message}`);
    }
  };

  /**
   * Handle segment recommendations
   */
  const handleSegmentRecommendations = async () => {
    try {
      toast.info("🎯 Đang lấy gợi ý...");
      await fetchSegmentRecommendations(selectedSegment);
      toast.success("✅ Lấy gợi ý thành công!");
    } catch (error) {
      toast.error(`❌ Lỗi: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-lg border border-avocado-brown-30 p-2">
        <button
          className={`flex items-center gap-2 px-4 py-2 text-xl rounded-lg transition-colors ${
            activeAnalyticsTab === "forecast"
              ? "bg-avocado-green-100 text-white"
              : "text-gray-700 hover:bg-avocado-green-10"
          }`}
          onClick={() => setActiveAnalyticsTab("forecast")}
        >
          <TrendingUp className="w-4 h-4" />
          Dự báo
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 text-xl rounded-lg transition-colors ${
            activeAnalyticsTab === "market"
              ? "bg-avocado-green-100 text-white"
              : "text-gray-700 hover:bg-avocado-green-10"
          }`}
          onClick={() => setActiveAnalyticsTab("market")}
        >
          <BarChart3 className="w-4 h-4" />
          Thị trường
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-2 text-xl rounded-lg transition-colors ${
            activeAnalyticsTab === "segment"
              ? "bg-avocado-green-100 text-white"
              : "text-gray-700 hover:bg-avocado-green-10"
          }`}
          onClick={() => setActiveAnalyticsTab("segment")}
        >
          <Target className="w-4 h-4" />
          Gợi ý Segment
        </button>
      </div>

      <div className="space-y-6">
        {/* Common Controls */}
        <div className="bg-white rounded-lg border border-avocado-brown-30 p-4 space-y-4">
          <div>
            <label
              htmlFor="segment-select"
              className="block text-xl font-medium text-avocado-brown-100 mb-2"
            >
              Phân khúc khách hàng:
            </label>
            <select
              id="segment-select"
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full px-4 py-2 text-xl border border-avocado-brown-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-green-30"
            >
              {USER_SEGMENTS.map((segment) => (
                <option key={segment.value} value={segment.value}>
                  {segment.label}
                </option>
              ))}
            </select>
          </div>

          {activeAnalyticsTab === "forecast" && (
            <div>
              <label
                htmlFor="horizon-days"
                className="block text-xl font-medium text-avocado-brown-100 mb-2"
              >
                Dự báo (ngày):
              </label>
              <input
                type="number"
                id="horizon-days"
                value={horizonDays}
                onChange={(e) => setHorizonDays(Number(e.target.value))}
                min="7"
                max="90"
                className="w-full px-4 py-2 text-xl border border-avocado-brown-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-avocado-green-30"
              />
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeAnalyticsTab === "forecast" && (
          <div className="space-y-4">
            <button
              onClick={handleForecast}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-xl bg-avocado-green-100 text-white rounded-lg hover:bg-avocado-green-80 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Dự báo & Tạo Công Thức"
              )}
            </button>

            {forecastData && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Khung thời gian
                  </h3>
                  <p className="text-xl text-gray-700">
                    {forecastData.forecast_window?.start} →{" "}
                    {forecastData.forecast_window?.end}
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Sự kiện Hot
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {forecastData.top_forecasted_events?.map((event, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-avocado-green-10 text-avocado-brown-100 text-sm rounded-lg"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Công thức đề xuất
                  </h3>
                  <div className="space-y-3">
                    {forecastData.recommended_recipes?.map((rec, i) => (
                      <div
                        key={i}
                        className="border border-avocado-brown-30 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <strong className="text-xl text-avocado-brown-100">
                            {rec.event}
                          </strong>
                          <span className="px-3 py-1 bg-avocado-green-100 text-white text-sm rounded-lg">
                            {Math.round(rec.viral_potential * 100)}%
                          </span>
                        </div>
                        <p className="text-xl text-gray-700">
                          {rec.recipe?.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeAnalyticsTab === "market" && (
          <div className="space-y-4">
            <button
              onClick={handleMarketInsights}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-xl bg-avocado-green-100 text-white rounded-lg hover:bg-avocado-green-80 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                "Phân tích Thị trường"
              )}
            </button>

            {marketInsights && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Phân tích Segment
                  </h3>
                  <p className="text-xl text-gray-700">
                    Tiềm năng:{" "}
                    <strong>
                      {marketInsights.data?.segment_analysis?.size_estimate}
                    </strong>
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Điểm Cơ Hội
                  </h3>
                  <div className="text-3xl font-bold text-avocado-green-100">
                    {Math.round(
                      (marketInsights.data?.opportunity_score || 0) * 100
                    )}
                    %
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Chiến lược đề xuất
                  </h3>
                  <ul className="space-y-2">
                    {marketInsights.data?.recommended_strategies?.map(
                      (strategy, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xl text-gray-700"
                        >
                          <span className="text-avocado-green-100 mt-1">•</span>
                          {strategy}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeAnalyticsTab === "segment" && (
          <div className="space-y-4">
            <button
              onClick={handleSegmentRecommendations}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-xl bg-avocado-green-100 text-white rounded-lg hover:bg-avocado-green-80 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tải...
                </>
              ) : (
                "Xem Gợi ý"
              )}
            </button>

            {segmentRecommendations && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Profile Segment
                  </h3>
                  <p className="text-xl font-medium text-gray-900 mb-2">
                    {segmentRecommendations.data?.segment_profile?.name}
                  </p>
                  <p className="text-xl text-gray-700">
                    Tiềm năng thị trường:{" "}
                    {Math.round(
                      (segmentRecommendations.data?.segment_profile
                        ?.market_potential || 0) * 100
                    )}
                    %
                  </p>
                </div>

                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Sản phẩm đề xuất
                  </h3>
                  <ul className="space-y-2">
                    {segmentRecommendations.data?.recommended_products?.map(
                      (product, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xl text-gray-700"
                        >
                          <span className="text-avocado-green-100 mt-1">•</span>
                          {product}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="md:col-span-2 bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Marketing Tips
                  </h3>
                  <ul className="space-y-2">
                    {segmentRecommendations.data?.marketing_tips?.map(
                      (tip, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xl text-gray-700"
                        >
                          <span className="text-avocado-green-100 mt-1">•</span>
                          {tip}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeAnalytics;
