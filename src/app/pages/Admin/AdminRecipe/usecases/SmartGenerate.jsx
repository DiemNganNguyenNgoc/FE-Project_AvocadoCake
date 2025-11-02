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
    <div className="space-y-10">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-3xl p-10 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
              <Zap className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-5xl font-bold mb-3">Smart Auto-Generate</h2>
              <p className="text-white/90 text-3xl">
                AI tự động tạo recipe tối ưu
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6" />
                <span className="font-semibold text-2xl">Auto Events</span>
              </div>
              <p className="text-xl text-white/80">Tự động nhận diện sự kiện</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-6 h-6" />
                <span className="font-semibold text-2xl">ML Trends</span>
              </div>
              <p className="text-xl text-white/80">Dự đoán xu hướng</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6" />
                <span className="font-semibold text-2xl">Viral Score</span>
              </div>
              <p className="text-xl text-white/80">Đánh giá viral potential</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Sidebar - Controls */}
        <div className="space-y-8">
          {/* Context Preview Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Target className="w-7 h-7 text-blue-600" />
                Context
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchContextPreview}
                disabled={loadingPreview}
              >
                <RefreshCcw
                  className={`w-5 h-5 ${loadingPreview ? "animate-spin" : ""}`}
                />
              </Button>
            </div>

            {loadingPreview ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              </div>
            ) : contextPreview ? (
              <div className="space-y-5">
                {/* Events */}
                {contextPreview.events && contextPreview.events.length > 0 && (
                  <div className="bg-white/80 dark:bg-dark-3/80 backdrop-blur-sm rounded-xl p-6">
                    <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Sự kiện
                    </p>
                    <div className="space-y-3">
                      {contextPreview.events.map((event, idx) => (
                        <div
                          key={idx}
                          className="text-xl text-gray-600 dark:text-gray-400 flex items-start gap-2"
                        >
                          <ChevronRight className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-500" />
                          <span>{event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trends */}
                {contextPreview.trends && contextPreview.trends.length > 0 && (
                  <div className="bg-white/80 dark:bg-dark-3/80 backdrop-blur-sm rounded-xl p-6">
                    <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Xu hướng
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {contextPreview.trends.slice(0, 8).map((trend, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-medium rounded-full"
                        >
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Demand Forecast */}
                {contextPreview.demand_forecast && (
                  <div className="bg-white/80 dark:bg-dark-3/80 backdrop-blur-sm rounded-xl p-6">
                    <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Dự báo
                    </p>
                    <div className="text-3xl font-bold text-blue-600">
                      {contextPreview.demand_forecast.level || "Medium"}
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                      Score: {contextPreview.demand_forecast.score || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-2xl text-center py-6">
                No data
              </p>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-6">
            {/* Days Ahead */}
            <div>
              <label className="block text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                <Clock className="w-5 h-5 inline mr-2" />
                Thời điểm
              </label>
              <div className="space-y-3">
                {daysAheadOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange("daysAhead", option.value)}
                    disabled={loading || loadingPreview}
                    className={`w-full text-left px-6 py-5 rounded-2xl border-2 transition-all ${
                      formData.daysAhead === option.value
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-stroke-dark bg-white dark:bg-dark-3 hover:border-purple-300"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="font-semibold text-2xl text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    <div className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Segment */}
            <div>
              <label className="block text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
                <Users className="w-5 h-5 inline mr-2" />
                Khách hàng
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
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-3 ml-1">
                  {selectedSegment.description}
                </p>
              )}
            </div>

            {/* Language */}
            <Select
              label="Ngôn ngữ"
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
              className="w-full !py-6 !text-3xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Smart Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Content - Result */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px] space-y-8">
              <div className="relative">
                <div className="w-28 h-28 border-8 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-purple-600" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="text-gray-900 dark:text-white text-4xl font-bold">
                  AI đang phân tích...
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-2xl">
                  Phát hiện events & trends
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-2xl">
                  Dự đoán nhu cầu
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-2xl">
                  Tạo recipe tối ưu
                </p>
              </div>
            </div>
          ) : currentRecipe ? (
            <RecipeDisplay recipe={currentRecipe} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-center space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-3 dark:to-dark-4 rounded-3xl p-14">
              <div className="relative">
                <div className="text-9xl">🎯</div>
                <div className="absolute -top-4 -right-4">
                  <Sparkles className="w-14 h-14 text-purple-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-5xl font-bold text-gray-900 dark:text-white">
                  Ready
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md text-3xl">
                  Chọn thời điểm và khách hàng, sau đó nhấn{" "}
                  <strong className="text-purple-600">Smart Generate</strong>
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 max-w-2xl">
                <div className="bg-white dark:bg-dark-3 rounded-xl p-6 text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-2xl text-gray-900 dark:text-white mb-2">
                        Zero Input
                      </h4>
                      <p className="text-xl text-gray-600 dark:text-gray-400">
                        AI tự động phân tích
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-3 rounded-xl p-6 text-left">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-2xl text-gray-900 dark:text-white mb-2">
                        Smart Context
                      </h4>
                      <p className="text-xl text-gray-600 dark:text-gray-400">
                        Auto detect trends
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
