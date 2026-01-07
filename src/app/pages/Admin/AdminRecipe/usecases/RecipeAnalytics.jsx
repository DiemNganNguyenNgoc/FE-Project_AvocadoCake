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
              <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                    <h3 className="text-lg font-semibold text-avocado-brown-100 mb-2">
                      Khung thời gian
                    </h3>
                    <p className="text-xl text-gray-700">
                      {forecastData.forecast_window?.start} →{" "}
                      {forecastData.forecast_window?.end}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                    <h3 className="text-lg font-semibold text-avocado-brown-100 mb-2">
                      Trend Strength
                    </h3>
                    <div className="text-3xl font-bold text-avocado-green-100">
                      {Math.round(
                        (forecastData.trends_summary?.avg_trend_strength || 0) *
                          100
                      )}
                      %
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                    <h3 className="text-lg font-semibold text-avocado-brown-100 mb-2">
                      Engagement Score
                    </h3>
                    <div className="text-3xl font-bold text-avocado-green-100">
                      {Math.round(
                        (forecastData.trends_summary?.avg_engagement || 0) * 100
                      )}
                      %
                    </div>
                  </div>
                </div>

                {/* Top Events */}
                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    🔥 Sự kiện Hot
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {forecastData.top_forecasted_events?.map((event, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gradient-to-r from-avocado-green-100 to-avocado-green-80 text-white text-xl rounded-lg font-medium shadow-sm"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations per Event */}
                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    📊 Phân tích & Gợi ý
                  </h3>
                  <div className="space-y-4">
                    {forecastData.recommended_recipes?.map((rec, i) => (
                      <div
                        key={i}
                        className="border border-avocado-brown-30 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <strong className="text-2xl text-avocado-brown-100">
                              {rec.event}
                            </strong>
                            <span className="text-xl text-gray-500">
                              ({rec.date})
                            </span>
                          </div>
                          <span className="px-4 py-2 bg-avocado-green-100 text-white text-xl rounded-lg font-semibold">
                            Viral: {Math.round(rec.viral_potential * 100)}%
                          </span>
                        </div>

                        {/* Suggested Recipe Names */}
                        <div className="mb-3">
                          <h4 className="text-lg font-medium text-gray-700 mb-2">
                            💡 Gợi ý tên bánh:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {rec.suggested_recipe_names?.map((name, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-avocado-green-10 text-avocado-brown-100 text-xl rounded-lg"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Trending Ingredients */}
                        <div className="mb-3">
                          <h4 className="text-lg font-medium text-gray-700 mb-2">
                            🌟 Nguyên liệu trending:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {rec.trending_ingredients?.map(
                              (ingredient, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xl rounded-lg"
                                >
                                  {ingredient}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        {/* Analytics */}
                        {rec.analytics && (
                          <div className="grid grid-cols-2 gap-3 text-xl">
                            <div>
                              <span className="text-gray-600">
                                Trend Strength:
                              </span>{" "}
                              <strong className="text-avocado-green-100">
                                {Math.round(
                                  (rec.analytics.trend_strength || 0) * 100
                                )}
                                %
                              </strong>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Seasonal Demand:
                              </span>{" "}
                              <strong className="text-avocado-green-100">
                                {rec.analytics.seasonal_demand?.toFixed(2)}x
                              </strong>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Market Potential:
                              </span>{" "}
                              <strong className="text-avocado-green-100">
                                {Math.round(
                                  (rec.analytics.market_potential || 0) * 100
                                )}
                                %
                              </strong>
                            </div>
                            <div>
                              <span className="text-gray-600">
                                Competition:
                              </span>{" "}
                              <strong className="text-orange-600">
                                {Math.round(
                                  (rec.analytics.competition_level || 0) * 100
                                )}
                                %
                              </strong>
                            </div>
                          </div>
                        )}
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
              <div className="space-y-4">
                {/* Overview Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Tiềm năng thị trường
                    </h3>
                    <div className="text-3xl font-bold text-blue-700">
                      {Math.round(
                        (marketInsights.segment_analysis?.profile
                          ?.market_potential || 0) * 100
                      )}
                      %
                    </div>
                    <p className="text-xl text-blue-600 mt-1">
                      {marketInsights.segment_analysis?.size_estimate}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      Điểm Cơ Hội
                    </h3>
                    <div className="text-3xl font-bold text-green-700">
                      {Math.round(
                        (marketInsights.opportunity_score || 0) * 100
                      )}
                      %
                    </div>
                    <p className="text-xl text-green-600 mt-1">
                      {marketInsights.opportunity_score > 0.7
                        ? "Rất cao"
                        : marketInsights.opportunity_score > 0.5
                        ? "Trung bình"
                        : "Thấp"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-4">
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">
                      Cạnh tranh
                    </h3>
                    <div className="text-3xl font-bold text-orange-700">
                      {Math.round(
                        (marketInsights.competition_analysis?.intensity || 0) *
                          100
                      )}
                      %
                    </div>
                    <p className="text-xl text-orange-600 mt-1">
                      {marketInsights.competition_analysis?.intensity > 0.7
                        ? "Cao"
                        : marketInsights.competition_analysis?.intensity > 0.4
                        ? "Trung bình"
                        : "Thấp"}
                    </p>
                  </div>
                </div>

                {/* Seasonal Trends */}
                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Xu hướng theo mùa
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-xl">
                    <div>
                      <span className="text-gray-600">Mùa hiện tại:</span>{" "}
                      <strong className="text-avocado-brown-100">
                        {marketInsights.seasonal_trends?.current_season}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-600">Demand multiplier:</span>{" "}
                      <strong className="text-avocado-green-100">
                        {marketInsights.seasonal_trends?.demand_multiplier?.toFixed(
                          2
                        )}
                        x
                      </strong>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-600">Hương vị trending:</span>{" "}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {marketInsights.seasonal_trends?.trending_flavors?.map(
                          (flavor, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg"
                            >
                              {flavor}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategies */}
                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Chiến lược đề xuất
                  </h3>
                  {marketInsights.recommended_strategies?.length > 0 ? (
                    <ul className="space-y-2">
                      {marketInsights.recommended_strategies.map(
                        (strategy, i) => (
                          <li
                            key={i}
                            className="text-xl text-gray-700 p-2 hover:bg-avocado-green-10 rounded"
                          >
                            {strategy}
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-xl text-gray-500 italic">
                      Chưa có chiến lược đề xuất
                    </p>
                  )}
                </div>

                {/* Differentiation Opportunities */}
                {marketInsights.competition_analysis
                  ?.differentiation_opportunities?.length > 0 && (
                  <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                    <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                      Cơ hội khác biệt hóa
                    </h3>
                    <ul className="space-y-2">
                      {marketInsights.competition_analysis.differentiation_opportunities.map(
                        (opp, i) => (
                          <li key={i} className="text-xl text-gray-700">
                            {opp}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Competitive Advantages */}
                {marketInsights.competition_analysis?.competitive_advantages
                  ?.length > 0 && (
                  <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                    <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                      Lợi thế cạnh tranh
                    </h3>
                    <ul className="space-y-2">
                      {marketInsights.competition_analysis.competitive_advantages.map(
                        (adv, i) => (
                          <li key={i} className="text-xl text-gray-700">
                            {adv}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
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

            {segmentRecommendations && segmentRecommendations.data && (
              <div className="space-y-4">
                {/* Profile Card */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-4">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">
                    Profile Segment
                  </h3>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-purple-800">
                      {segmentRecommendations.data.segment_profile?.name}
                    </p>
                    <div className="grid md:grid-cols-3 gap-3 text-xl">
                      <div>
                        <span className="text-gray-600">Tiềm năng:</span>{" "}
                        <strong className="text-purple-700">
                          {Math.round(
                            (segmentRecommendations.data.segment_profile
                              ?.market_potential || 0) * 100
                          )}
                          %
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-600">Cạnh tranh:</span>{" "}
                        <strong className="text-orange-700">
                          {Math.round(
                            (segmentRecommendations.data.segment_profile
                              ?.competition_level || 0) * 100
                          )}
                          %
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-600">Xu hướng:</span>{" "}
                        <strong className="text-green-700">
                          {
                            segmentRecommendations.data.segment_profile
                              ?.growth_trend
                          }
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Opportunities */}
                {segmentRecommendations.data.current_opportunities?.length >
                  0 && (
                  <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                    <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                      Cơ hội hiện tại
                    </h3>
                    <ul className="space-y-2">
                      {segmentRecommendations.data.current_opportunities.map(
                        (opp, i) => (
                          <li
                            key={i}
                            className="text-xl text-gray-700 p-2 bg-green-50 rounded"
                          >
                            {opp}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Recommended Products */}
                <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                  <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                    Sản phẩm đề xuất
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {segmentRecommendations.data.recommended_products?.map(
                      (product, i) => (
                        <div
                          key={i}
                          className="text-xl text-gray-700 p-3 border border-avocado-brown-30 rounded-lg hover:bg-avocado-green-10 transition-colors"
                        >
                          {product}
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Pricing Strategy */}
                {segmentRecommendations.data.pricing_strategy && (
                  <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                    <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                      Chiến lược giá
                    </h3>
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-3 gap-3 text-xl">
                        <div>
                          <span className="text-gray-600">Chiến lược:</span>{" "}
                          <strong className="text-avocado-brown-100">
                            {
                              segmentRecommendations.data.pricing_strategy
                                .strategy
                            }
                          </strong>
                        </div>
                        <div>
                          <span className="text-gray-600">Phạm vi giá:</span>{" "}
                          <strong className="text-avocado-brown-100">
                            {
                              segmentRecommendations.data.pricing_strategy
                                .price_range
                            }
                          </strong>
                        </div>
                        <div>
                          <span className="text-gray-600">Vị thế:</span>{" "}
                          <strong className="text-avocado-brown-100">
                            {
                              segmentRecommendations.data.pricing_strategy
                                .positioning
                            }
                          </strong>
                        </div>
                      </div>
                      {segmentRecommendations.data.pricing_strategy
                        .recommendations?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xl text-gray-600 mb-2">
                            Khuyến nghị:
                          </p>
                          <ul className="space-y-1">
                            {segmentRecommendations.data.pricing_strategy.recommendations.map(
                              (rec, i) => (
                                <li
                                  key={i}
                                  className="text-xl text-gray-700 ml-4"
                                >
                                  • {rec}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Marketing Tips */}
                {segmentRecommendations.data.marketing_tips?.length > 0 && (
                  <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                    <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                      Marketing Tips
                    </h3>
                    <ul className="space-y-2">
                      {segmentRecommendations.data.marketing_tips.map(
                        (tip, i) => (
                          <li
                            key={i}
                            className="text-xl text-gray-700 p-2 hover:bg-blue-50 rounded"
                          >
                            {tip}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Timing Optimization */}
                {segmentRecommendations.data.timing_optimization && (
                  <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
                    <h3 className="text-lg font-semibold text-avocado-brown-100 mb-3">
                      Tối ưu thời gian
                    </h3>
                    <div className="grid md:grid-cols-2 gap-3 text-xl">
                      <div>
                        <span className="text-gray-600">
                          Ngày launch tốt nhất:
                        </span>{" "}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {segmentRecommendations.data.timing_optimization.best_launch_days?.map(
                            (day, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-green-100 text-green-800 rounded"
                              >
                                {day}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Timing sự kiện:</span>{" "}
                        <p className="text-gray-800 mt-1">
                          {
                            segmentRecommendations.data.timing_optimization
                              .event_timing
                          }
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-600">
                          Production planning:
                        </span>{" "}
                        <p className="text-gray-800 mt-1">
                          {
                            segmentRecommendations.data.timing_optimization
                              .production_planning
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeAnalytics;
