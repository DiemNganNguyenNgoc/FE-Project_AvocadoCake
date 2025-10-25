import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import recipeAPIService from "../services/RecipeService";
import RecipeDisplay from "../components/RecipeDisplay";
import { TrendingUp, Sparkles, RotateCcw, RefreshCcw } from "lucide-react";
import Button from "../../../components/AdminLayout/Button";
import Select from "../../../components/AdminLayout/Select";

/**
 * GenerateFromTrend - Tạo công thức từ xu hướng
 * React thuần + TailwindCSS + AdminLayout components
 */
const GenerateFromTrend = ({
  loading,
  setLoading,
  currentRecipe,
  setCurrentRecipe,
  addToHistory,
}) => {
  // State
  const [formData, setFormData] = useState({
    language: "vi",
    userSegment: "gen_z",
    useT5: false,
  });
  const [trendData, setTrendData] = useState(null);
  const [loadingTrends, setLoadingTrends] = useState(false);

  // Language options
  const languageOptions = [
    { value: "vi", label: "🇻🇳 Tiếng Việt" },
    { value: "en", label: "🇺🇸 English" },
  ];

  // User segment options
  const segmentOptions = [
    { value: "gen_z", label: "👨‍🎓 Gen Z (18-25)" },
    { value: "millennials", label: "👔 Millennials (26-40)" },
    { value: "gym", label: "💪 Gym/Fitness" },
    { value: "kids", label: "👶 Trẻ em" },
    { value: "health", label: "🥗 Sức khỏe" },
  ];

  // Load trends on mount
  useEffect(() => {
    fetchCurrentTrends();
  }, []);

  /**
   * Fetch current trends
   */
  const fetchCurrentTrends = async () => {
    setLoadingTrends(true);
    try {
      const result = await recipeAPIService.getCurrentTrends();
      if (result.success) {
        setTrendData(result);
        toast.success("📊 Đã tải xu hướng mới nhất!");
      } else {
        toast.error(`❌ ${result.error || "Không thể tải xu hướng"}`);
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoadingTrends(false);
    }
  };

  /**
   * Handle form change
   */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({
      language: "vi",
      userSegment: "gen_z",
      useT5: false,
    });
    setCurrentRecipe(null);
  };

  /**
   * Generate recipe from trend
   */
  const handleGenerate = async () => {
    if (!trendData) {
      toast.warn("⚠️ Vui lòng tải xu hướng trước!");
      return;
    }

    setLoading(true);
    setCurrentRecipe(null);

    try {
      const result = await recipeAPIService.generateFromTrend({
        language: formData.language,
        user_segment: formData.userSegment,
        use_t5: formData.useT5,
      });

      if (result.success) {
        const recipeData = {
          ...result,
          type: "trend",
          params: { ...formData, trendData },
        };

        setCurrentRecipe(recipeData);
        addToHistory(recipeData);

        toast.success("✅ Tạo công thức từ xu hướng thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(`❌ ${result.error || "Lỗi không xác định"}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tạo công thức từ Xu hướng
          </h2>
        </div>

        <Button
          variant="outline"
          onClick={fetchCurrentTrends}
          disabled={loadingTrends}
        >
          <RefreshCcw
            className={`w-5 h-5 ${loadingTrends ? "animate-spin" : ""}`}
          />
          Làm mới xu hướng
        </Button>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trend Data + Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Current Trends */}
          {loadingTrends ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Đang tải xu hướng...
                </p>
              </div>
            </div>
          ) : trendData ? (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Xu hướng hiện tại
              </h3>

              {/* Trending Keywords */}
              {trendData.trending_keywords &&
                trendData.trending_keywords.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      🔥 Từ khóa nổi bật:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trendData.trending_keywords
                        .slice(0, 10)
                        .map((keyword, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white dark:bg-dark-3 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-stroke-dark shadow-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

              {/* Market Insights */}
              {trendData.market_insights && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    📈 Thông tin thị trường:
                  </p>
                  <div className="bg-white dark:bg-dark-3 rounded-lg p-3 text-sm space-y-1">
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Xu hướng chính:</strong>{" "}
                      {trendData.market_insights.primary_trend || "N/A"}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Độ phổ biến:</strong>{" "}
                      <span className="text-primary font-semibold">
                        {trendData.market_insights.popularity_score || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              {trendData.timestamp && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  📅 Cập nhật:{" "}
                  {new Date(trendData.timestamp).toLocaleString("vi-VN")}
                </p>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-dark-3 rounded-xl p-6 border border-gray-200 dark:border-stroke-dark text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Nhấn "Làm mới xu hướng" để tải dữ liệu
              </p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* Language Select */}
            <Select
              label="🌐 Ngôn ngữ"
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              options={languageOptions}
              disabled={loading}
            />

            {/* User Segment Select */}
            <Select
              label="👥 Đối tượng khách hàng"
              value={formData.userSegment}
              onChange={(e) => handleChange("userSegment", e.target.value)}
              options={segmentOptions}
              disabled={loading}
            />

            {/* T5 Model Toggle */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.useT5}
                  onChange={(e) => handleChange("useT5", e.target.checked)}
                  disabled={loading}
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary cursor-pointer disabled:cursor-not-allowed"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Sử dụng T5 Model
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Tăng độ sáng tạo với AI mô hình T5
                  </p>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={loading || !trendData}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Tạo từ Xu hướng
                  </>
                )}
              </Button>

              <Button variant="outline" onClick={resetForm} disabled={loading}>
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Result */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                🤖 AI đang phân tích xu hướng và tạo công thức...
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          ) : currentRecipe ? (
            <RecipeDisplay recipe={currentRecipe} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4">
              <div className="text-8xl">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chưa có công thức nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Tải xu hướng hiện tại và nhấn <strong>"Tạo từ Xu hướng"</strong>{" "}
                để bắt đầu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateFromTrend;
