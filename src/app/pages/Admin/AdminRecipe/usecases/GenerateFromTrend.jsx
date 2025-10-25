import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAdminRecipeStore from "../adminRecipeStore";
import { USER_SEGMENTS, LANGUAGES } from "../services/RecipeService";
import RecipeDisplay from "../components/RecipeDisplay";
import "./GenerateFromTrend.css";

/**
 * GenerateFromTrend Component
 * Tạo công thức từ xu hướng thị trường
 */
const GenerateFromTrend = () => {
  const {
    generateFromTrend,
    fetchCurrentTrends,
    fetchTrendingNow,
    loading,
    currentRecipe,
    currentTrends,
    trendingNow,
  } = useAdminRecipeStore();

  const [formData, setFormData] = useState({
    trend: "",
    user_segment: "gen_z",
    occasion: "",
    language: "vi",
  });

  const [showResult, setShowResult] = useState(false);

  /**
   * Load trends on mount
   */
  useEffect(() => {
    loadTrendsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Load trends data
   */
  const loadTrendsData = async () => {
    try {
      await Promise.all([fetchCurrentTrends(), fetchTrendingNow()]);
    } catch (error) {
      console.error("Failed to load trends:", error);
    }
  };

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.trend.trim()) {
      toast.warning("⚠️ Vui lòng nhập xu hướng!");
      return;
    }

    try {
      toast.info("🤖 Đang tạo công thức từ xu hướng...");

      await generateFromTrend(formData);

      setShowResult(true);
      toast.success("✅ Tạo công thức thành công!");
    } catch (error) {
      toast.error(`❌ Lỗi: ${error.message}`);
    }
  };

  /**
   * Handle reset
   */
  const handleReset = () => {
    setFormData({
      trend: "",
      user_segment: "gen_z",
      occasion: "",
      language: "vi",
    });
    setShowResult(false);
  };

  /**
   * Apply trending keyword
   */
  const applyTrendingKeyword = (keyword) => {
    setFormData((prev) => ({
      ...prev,
      trend: keyword,
    }));
    toast.info(`🔥 Đã chọn xu hướng: ${keyword}`);
  };

  /**
   * Popular occasions
   */
  const occasions = [
    { value: "", label: "Không chỉ định" },
    { value: "birthday", label: "🎂 Sinh nhật" },
    { value: "wedding", label: "💒 Đám cưới" },
    { value: "halloween", label: "🎃 Halloween" },
    { value: "christmas", label: "🎄 Giáng sinh" },
    { value: "valentines", label: "💝 Valentine" },
    { value: "tet", label: "🏮 Tết" },
    { value: "mothers_day", label: "👩‍👦 Ngày của mẹ" },
    { value: "corporate", label: "🏢 Sự kiện công ty" },
  ];

  return (
    <div className="generate-from-trend">
      {!showResult ? (
        <div className="form-container">
          <div className="form-header">
            <h2>🔥 Tạo Công Thức Từ Xu Hướng</h2>
            <p className="form-description">
              Dựa trên xu hướng thị trường và phân khúc khách hàng để tạo công
              thức phù hợp
            </p>
          </div>

          {/* Trending Now Section */}
          {trendingNow && (
            <div className="trending-section">
              <h3 className="section-title">🔥 Xu Hướng Hot Hiện Tại</h3>
              <div className="trending-info">
                <div className="trending-grid">
                  <div className="info-card">
                    <div className="info-label">Mùa</div>
                    <div className="info-value">
                      {trendingNow.data?.current_season}
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-label">Nhiệt độ</div>
                    <div className="info-value">
                      {trendingNow.data?.temperature_context}
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-label">Cơ hội</div>
                    <div className="info-value">
                      {Math.round(
                        (trendingNow.data?.opportunity_score || 0) * 100
                      )}
                      %
                    </div>
                  </div>
                </div>

                {trendingNow.data?.trending_flavors && (
                  <div className="flavor-tags">
                    <div className="tags-label">Hương vị hot:</div>
                    <div className="tags-container">
                      {trendingNow.data.trending_flavors
                        .slice(0, 8)
                        .map((flavor, index) => (
                          <button
                            key={index}
                            className="flavor-tag"
                            onClick={() => applyTrendingKeyword(flavor)}
                            type="button"
                          >
                            {flavor}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {trendingNow.data?.hot_events &&
                  trendingNow.data.hot_events.length > 0 && (
                    <div className="events-section">
                      <div className="tags-label">Sự kiện sắp tới:</div>
                      <div className="events-list">
                        {trendingNow.data.hot_events.map((event, index) => (
                          <span key={index} className="event-badge">
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Current Trends */}
          {currentTrends && currentTrends.length > 0 && (
            <div className="trends-section">
              <h3 className="section-title">📈 Xu Hướng Mạng Xã Hội</h3>
              <div className="trends-grid">
                {currentTrends.map((trend, index) => (
                  <button
                    key={index}
                    className="trend-card"
                    onClick={() => applyTrendingKeyword(trend.keyword)}
                    type="button"
                  >
                    <div className="trend-keyword">{trend.keyword}</div>
                    <div className="trend-info">
                      <span className="trend-platform">{trend.platform}</span>
                      <span className="trend-score">
                        {Math.round(trend.score * 100)}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="recipe-form">
            {/* Trend Input */}
            <div className="form-group">
              <label htmlFor="trend" className="form-label">
                <span className="label-icon">🔥</span>
                Xu hướng / Trend Keywords
                <span className="required">*</span>
              </label>
              <input
                type="text"
                id="trend"
                name="trend"
                value={formData.trend}
                onChange={handleChange}
                placeholder="Ví dụ: Matcha, Minimalist, Labubu, Viral TikTok..."
                className="form-input"
                required
              />
              <p className="form-hint">
                💡 Nhập từ khóa xu hướng hoặc chọn từ danh sách phía trên
              </p>
            </div>

            {/* User Segment */}
            <div className="form-group">
              <label htmlFor="user_segment" className="form-label">
                <span className="label-icon">🎯</span>
                Phân khúc khách hàng
                <span className="required">*</span>
              </label>
              <select
                id="user_segment"
                name="user_segment"
                value={formData.user_segment}
                onChange={handleChange}
                className="form-select"
                required
              >
                {USER_SEGMENTS.map((segment) => (
                  <option key={segment.value} value={segment.value}>
                    {segment.label} - {segment.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Occasion */}
            <div className="form-group">
              <label htmlFor="occasion" className="form-label">
                <span className="label-icon">🎉</span>
                Dịp đặc biệt (Tùy chọn)
              </label>
              <select
                id="occasion"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className="form-select"
              >
                {occasions.map((occ) => (
                  <option key={occ.value} value={occ.value}>
                    {occ.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div className="form-group">
              <label htmlFor="language" className="form-label">
                <span className="label-icon">🌐</span>
                Ngôn ngữ
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="form-select"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="btn-reset"
                disabled={loading}
              >
                🔄 Làm mới
              </button>
              <button type="submit" className="btn-generate" disabled={loading}>
                {loading ? (
                  <>
                    <div className="loading-spinner" />
                    Đang tạo...
                  </>
                ) : (
                  <>✨ Tạo Công Thức</>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="result-container">
          <div className="result-header">
            <button onClick={() => setShowResult(false)} className="btn-back">
              ← Tạo công thức mới
            </button>
          </div>

          <RecipeDisplay recipe={currentRecipe} />
        </div>
      )}
    </div>
  );
};

export default GenerateFromTrend;
