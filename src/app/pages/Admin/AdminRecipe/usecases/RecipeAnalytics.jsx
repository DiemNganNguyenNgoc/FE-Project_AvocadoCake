import React, { useState } from "react";
import { toast } from "react-toastify";
import useAdminRecipeStore from "../adminRecipeStore";
import { USER_SEGMENTS } from "../services/RecipeService";
import "./RecipeAnalytics.css";

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
    <div className="recipe-analytics">
      <div className="analytics-tabs">
        <button
          className={`analytics-tab ${
            activeAnalyticsTab === "forecast" ? "active" : ""
          }`}
          onClick={() => setActiveAnalyticsTab("forecast")}
        >
          📈 Dự báo
        </button>
        <button
          className={`analytics-tab ${
            activeAnalyticsTab === "market" ? "active" : ""
          }`}
          onClick={() => setActiveAnalyticsTab("market")}
        >
          💼 Thị trường
        </button>
        <button
          className={`analytics-tab ${
            activeAnalyticsTab === "segment" ? "active" : ""
          }`}
          onClick={() => setActiveAnalyticsTab("segment")}
        >
          🎯 Gợi ý Segment
        </button>
      </div>

      <div className="analytics-content">
        {/* Common Controls */}
        <div className="analytics-controls">
          <div className="control-group">
            <label htmlFor="segment-select" className="control-label">
              Phân khúc khách hàng:
            </label>
            <select
              id="segment-select"
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="control-select"
            >
              {USER_SEGMENTS.map((segment) => (
                <option key={segment.value} value={segment.value}>
                  {segment.label}
                </option>
              ))}
            </select>
          </div>

          {activeAnalyticsTab === "forecast" && (
            <div className="control-group">
              <label htmlFor="horizon-days" className="control-label">
                Dự báo (ngày):
              </label>
              <input
                type="number"
                id="horizon-days"
                value={horizonDays}
                onChange={(e) => setHorizonDays(Number(e.target.value))}
                min="7"
                max="90"
                className="control-input"
              />
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeAnalyticsTab === "forecast" && (
          <div className="tab-panel">
            <button
              onClick={handleForecast}
              disabled={loading}
              className="btn-analyze"
            >
              {loading ? "⏳ Đang xử lý..." : "🚀 Dự báo & Tạo Công Thức"}
            </button>

            {forecastData && (
              <div className="forecast-results">
                <div className="result-card">
                  <h3>📅 Khung thời gian</h3>
                  <p>
                    {forecastData.forecast_window?.start} →{" "}
                    {forecastData.forecast_window?.end}
                  </p>
                </div>

                <div className="result-card">
                  <h3>🔥 Sự kiện Hot</h3>
                  <div className="events-tags">
                    {forecastData.top_forecasted_events?.map((event, i) => (
                      <span key={i} className="event-tag">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="result-card">
                  <h3>🍰 Công thức đề xuất</h3>
                  {forecastData.recommended_recipes?.map((rec, i) => (
                    <div key={i} className="recipe-recommendation">
                      <div className="rec-header">
                        <strong>{rec.event}</strong>
                        <span className="viral-badge">
                          🚀 {Math.round(rec.viral_potential * 100)}%
                        </span>
                      </div>
                      <p className="rec-title">{rec.recipe?.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeAnalyticsTab === "market" && (
          <div className="tab-panel">
            <button
              onClick={handleMarketInsights}
              disabled={loading}
              className="btn-analyze"
            >
              {loading ? "⏳ Đang phân tích..." : "💼 Phân tích Thị trường"}
            </button>

            {marketInsights && (
              <div className="market-results">
                <div className="result-card">
                  <h3>📊 Phân tích Segment</h3>
                  <p>
                    Tiềm năng:{" "}
                    <strong>
                      {marketInsights.data?.segment_analysis?.size_estimate}
                    </strong>
                  </p>
                </div>

                <div className="result-card">
                  <h3>🎯 Điểm Cơ Hội</h3>
                  <div className="opportunity-score">
                    {Math.round(
                      (marketInsights.data?.opportunity_score || 0) * 100
                    )}
                    %
                  </div>
                </div>

                <div className="result-card">
                  <h3>💡 Chiến lược đề xuất</h3>
                  <ul className="strategy-list">
                    {marketInsights.data?.recommended_strategies?.map(
                      (strategy, i) => (
                        <li key={i}>{strategy}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {activeAnalyticsTab === "segment" && (
          <div className="tab-panel">
            <button
              onClick={handleSegmentRecommendations}
              disabled={loading}
              className="btn-analyze"
            >
              {loading ? "⏳ Đang tải..." : "🎯 Xem Gợi ý"}
            </button>

            {segmentRecommendations && (
              <div className="segment-results">
                <div className="result-card">
                  <h3>👥 Profile Segment</h3>
                  <p>
                    <strong>
                      {segmentRecommendations.data?.segment_profile?.name}
                    </strong>
                  </p>
                  <p>
                    Tiềm năng thị trường:{" "}
                    {Math.round(
                      (segmentRecommendations.data?.segment_profile
                        ?.market_potential || 0) * 100
                    )}
                    %
                  </p>
                </div>

                <div className="result-card">
                  <h3>🍰 Sản phẩm đề xuất</h3>
                  <ul className="product-list">
                    {segmentRecommendations.data?.recommended_products?.map(
                      (product, i) => (
                        <li key={i}>{product}</li>
                      )
                    )}
                  </ul>
                </div>

                <div className="result-card">
                  <h3>📢 Marketing Tips</h3>
                  <ul className="tips-list">
                    {segmentRecommendations.data?.marketing_tips?.map(
                      (tip, i) => (
                        <li key={i}>{tip}</li>
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
