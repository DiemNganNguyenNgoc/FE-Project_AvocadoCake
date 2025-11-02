import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import recipeAPIService from "../services/RecipeService";
import RecipeDisplay from "../partials/RecipeDisplay";
import useAdminRecipeStore from "../adminRecipeStore";
import {
  Sparkles,
  Calendar,
  TrendingUp,
  Users,
  Zap,
  RefreshCcw,
  Loader2,
  ChevronRight,
  Clock,
  Target,
  Award,
} from "lucide-react";
import Button from "../../../../components/AdminLayout/Button";
import Select from "../../../../components/AdminLayout/Select";

/**
 * SmartGenerate - Tính năng Smart Auto-Generate (ZERO USER INPUT)
 * 🎯 Tự động phát hiện events, trends, demand và tạo recipe phù hợp
 */
const SmartGenerate = () => {
  // Get store functions
  const { smartGenerate } = useAdminRecipeStore();

  // Local state
  const [loading, setLoading] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [formData, setFormData] = useState({
    language: "vi",
    targetSegment: "gen_z",
    daysAhead: 0,
  });
  const [contextPreview, setContextPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Language options
  const languageOptions = [
    { value: "vi", label: "🇻🇳 Tiếng Việt" },
    { value: "en", label: "🇺🇸 English" },
  ];

  // User segment options with detailed descriptions
  const segmentOptions = [
    {
      value: "gen_z",
      label: "Gen Z (18-25)",
      icon: "👨‍🎓",
      description: "Năng động, theo trend, thích share Instagram",
    },
    {
      value: "millennials",
      label: "Millennials (26-40)",
      icon: "👔",
      description: "Chất lượng, organic, work-life balance",
    },
    {
      value: "gym",
      label: "Gym/Fitness",
      icon: "💪",
      description: "Protein cao, low-carb, healthy lifestyle",
    },
    {
      value: "kids",
      label: "Gia đình & Trẻ em",
      icon: "👶",
      description: "An toàn, vui nhộn, màu sắc bắt mắt",
    },
    {
      value: "health",
      label: "Sức khỏe",
      icon: "🥗",
      description: "Organic, low-sugar, dinh dưỡng cao",
    },
  ];

  // Days ahead options
  const daysAheadOptions = [
    { value: 0, label: "📅 Hôm nay", description: "Context hiện tại" },
    { value: 7, label: "📆 Tuần sau", description: "Dự đoán 7 ngày" },
    { value: 30, label: "📊 Tháng sau", description: "Dự đoán 30 ngày" },
  ];

  // Load context preview on mount and when params change
  useEffect(() => {
    fetchContextPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.daysAhead]);

  /**
   * Fetch context preview
   */
  const fetchContextPreview = async () => {
    setLoadingPreview(true);
    try {
      const result = await recipeAPIService.getContextPreview({
        days_ahead: formData.daysAhead,
      });

      setContextPreview(result);
      console.log("📊 Context Preview:", result);
    } catch (error) {
      console.error("❌ Failed to fetch context preview:", error);
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoadingPreview(false);
    }
  };

  /**
   * Handle form change
   */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Smart Generate
   */
  const handleSmartGenerate = async () => {
    setLoading(true);
    setCurrentRecipe(null);

    try {
      const result = await smartGenerate({
        language: formData.language,
        target_segment: formData.targetSegment,
        days_ahead: formData.daysAhead,
      });

      if (result) {
        setCurrentRecipe(result);

        toast.success("🎉 Smart Generate thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("❌ Không thể tạo công thức");
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

  const selectedSegment = segmentOptions.find(
    (s) => s.value === formData.targetSegment
  );

  return (
    <div className="space-y-8">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
              <Zap className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-2">Smart Auto-Generate</h2>
              <p className="text-white/90 text-lg">
                🎯 Zero User Input - AI tự động phát hiện trends & tạo recipe
                tối ưu
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-semibold">Auto-Detect Events</span>
              </div>
              <p className="text-sm text-white/80">
                Tự động nhận diện lễ hội, sự kiện đặc biệt
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">ML-Powered Trends</span>
              </div>
              <p className="text-sm text-white/80">
                Dự đoán xu hướng bằng Machine Learning
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Viral Scoring</span>
              </div>
              <p className="text-sm text-white/80">
                Đánh giá khả năng viral trên social media
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Controls */}
        <div className="space-y-6">
          {/* Context Preview Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Context Preview
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchContextPreview}
                disabled={loadingPreview}
              >
                <RefreshCcw
                  className={`w-4 h-4 ${loadingPreview ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            {loadingPreview ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : contextPreview ? (
              <div className="space-y-4">
                {/* Events */}
                {contextPreview.events && contextPreview.events.length > 0 && (
                  <div className="bg-white/80 dark:bg-dark-3/80 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      📅 Sự kiện:
                    </p>
                    <div className="space-y-2">
                      {contextPreview.events.map((event, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                        >
                          <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
                          <span>{event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trends */}
                {contextPreview.trends && contextPreview.trends.length > 0 && (
                  <div className="bg-white/80 dark:bg-dark-3/80 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      🔥 Xu hướng:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {contextPreview.trends.slice(0, 8).map((trend, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium rounded-full"
                        >
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Demand Forecast */}
                {contextPreview.demand_forecast && (
                  <div className="bg-white/80 dark:bg-dark-3/80 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      📊 Dự báo nhu cầu:
                    </p>
                    <div className="text-2xl font-bold text-blue-600">
                      {contextPreview.demand_forecast.level || "Medium"}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Score: {contextPreview.demand_forecast.score || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center py-4">
                No context data
              </p>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4">
            {/* Days Ahead */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Clock className="w-4 h-4 inline mr-2" />
                Thời điểm dự đoán
              </label>
              <div className="space-y-2">
                {daysAheadOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange("daysAhead", option.value)}
                    disabled={loading || loadingPreview}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                      formData.daysAhead === option.value
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-stroke-dark bg-white dark:bg-dark-3 hover:border-purple-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Segment */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Users className="w-4 h-4 inline mr-2" />
                Đối tượng khách hàng
              </label>
              <Select
                value={formData.targetSegment}
                onChange={(e) => handleChange("targetSegment", e.target.value)}
                options={segmentOptions.map((seg) => ({
                  value: seg.value,
                  label: `${seg.icon} ${seg.label}`,
                }))}
                disabled={loading}
              />
              {selectedSegment && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 ml-1">
                  {selectedSegment.description}
                </p>
              )}
            </div>

            {/* Language */}
            <Select
              label="🌐 Ngôn ngữ"
              value={formData.language}
              onChange={(e) => handleChange("language", e.target.value)}
              options={languageOptions}
              disabled={loading}
            />

            {/* Generate Button */}
            <Button
              variant="primary"
              onClick={handleSmartGenerate}
              disabled={loading}
              className="w-full !py-4 !text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AI đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  🚀 Smart Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Content - Result */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px] space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-gray-900 dark:text-white text-2xl font-bold">
                  🤖 AI đang phân tích...
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  • Phát hiện events & trends
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  • Dự đoán nhu cầu thị trường
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  • Tạo recipe tối ưu
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-4">
                  Vui lòng đợi trong giây lát...
                </p>
              </div>
            </div>
          ) : currentRecipe ? (
            <RecipeDisplay recipe={currentRecipe} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-center space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-3 dark:to-dark-4 rounded-3xl p-12">
              <div className="relative">
                <div className="text-9xl">🎯</div>
                <div className="absolute -top-4 -right-4">
                  <Sparkles className="w-12 h-12 text-purple-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Ready to Generate
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg">
                  Chọn thời điểm và đối tượng khách hàng, sau đó nhấn{" "}
                  <strong className="text-purple-600">"Smart Generate"</strong>{" "}
                  để AI tự động tạo recipe phù hợp
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-w-2xl">
                <div className="bg-white dark:bg-dark-3 rounded-xl p-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Zero Input
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Không cần nhập gì, AI tự động phân tích
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-3 rounded-xl p-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Smart Context
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Tự động detect events, trends, demand
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartGenerate;
