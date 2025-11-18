import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Sparkles,
  Calendar,
  TrendingUp,
  Users,
  Zap,
  RefreshCcw,
  Loader2,
  Clock,
  Target,
} from "lucide-react";
import recipeAPIService from "../services/RecipeService";
import RecipeDisplay from "../partials/RecipeDisplay";
import GenerateImage from "../partials/GenerateImage";
import useAdminRecipeStore from "../adminRecipeStore";

/**
 * SmartGenerate - Tính năng Smart Auto-Generate (ZERO USER INPUT)
 * 🎯 Tự động phát hiện events, trends, demand và tạo recipe phù hợp
 */
const SmartGenerate = () => {
  const { smartGenerate } = useAdminRecipeStore();

  const [loading, setLoading] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [formData, setFormData] = useState({
    language: "vi",
    targetSegment: "gen_z",
    daysAhead: 0,
  });
  const [contextPreview, setContextPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const languageOptions = [
    { value: "vi", label: "Tiếng Việt" },
    { value: "en", label: "English" },
  ];

  const segmentOptions = [
    {
      value: "gen_z",
      label: "Gen Z (18-25)",
      description: "Năng động, theo trend, thích share",
    },
    {
      value: "millennials",
      label: "Millennials (26-40)",
      description: "Chất lượng, organic, work-life balance",
    },
    {
      value: "gym",
      label: "Gym/Fitness",
      description: "Protein cao, low-carb, healthy",
    },
    {
      value: "kids",
      label: "Gia đình & Trẻ em",
      description: "An toàn, vui nhộn, màu sắc bắt mắt",
    },
    {
      value: "health",
      label: "Sức khỏe",
      description: "Organic, low-sugar, dinh dưỡng cao",
    },
  ];

  const daysAheadOptions = [
    { value: 0, label: "Hôm nay", description: "Context hiện tại" },
    { value: 7, label: "Tuần sau", description: "Dự đoán 7 ngày" },
    { value: 30, label: "Tháng sau", description: "Dự đoán 30 ngày" },
  ];

  useEffect(() => {
    fetchContextPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.daysAhead]);

  const fetchContextPreview = async () => {
    setLoadingPreview(true);
    try {
      const result = await recipeAPIService.getContextPreview({
        days_ahead: formData.daysAhead,
      });
      setContextPreview(result);
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSmartGenerate = async () => {
    setLoading(true);
    setCurrentRecipe(null);
    setGeneratedImage(null); // Reset image when generating new recipe

    try {
      const result = await smartGenerate({
        language: formData.language,
        target_segment: formData.targetSegment,
        days_ahead: formData.daysAhead,
      });

      if (result) {
        setCurrentRecipe(result);
        toast.success("🎉 Smart Generate thành công!");
      } else {
        toast.error("❌ Không thể tạo công thức");
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageGenerated = (imageData) => {
    setGeneratedImage(imageData);
    console.log("Image generated:", imageData);
  };

  const selectedSegment = segmentOptions.find(
    (s) => s.value === formData.targetSegment
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-avocado-green-10 rounded-lg border border-avocado-brown-30 p-6">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-6 h-6 text-avocado-green-100" />
          <h2 className="text-2xl font-bold text-avocado-brown-100">
            Smart Auto-Generate
          </h2>
        </div>
        <p className="text-base text-gray-600 mb-4">
          AI tự động tạo recipe tối ưu từ events, trends và demand forecast
        </p>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-avocado-green-100" />
              <span className="font-medium text-sm text-avocado-brown-100">
                Auto Events
              </span>
            </div>
            <p className="text-sm text-gray-600">Tự động nhận diện sự kiện</p>
          </div>

          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-avocado-green-100" />
              <span className="font-medium text-sm text-avocado-brown-100">
                ML Trends
              </span>
            </div>
            <p className="text-sm text-gray-600">Dự đoán xu hướng</p>
          </div>

          <div className="bg-white rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-avocado-green-100" />
              <span className="font-medium text-sm text-avocado-brown-100">
                Viral Score
              </span>
            </div>
            <p className="text-sm text-gray-600">Đánh giá viral potential</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Controls */}
        <div className="space-y-6">
          {/* Context Preview */}
          <div className="bg-white rounded-lg border border-avocado-brown-30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-avocado-brown-100 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Context
              </h3>
              <button
                onClick={fetchContextPreview}
                disabled={loadingPreview}
                className="p-2 hover:bg-avocado-green-10 rounded-lg transition-colors"
              >
                <RefreshCcw
                  className={`w-4 h-4 text-avocado-green-100 ${
                    loadingPreview ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>

            {loadingPreview ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-avocado-green-100" />
              </div>
            ) : contextPreview ? (
              <div className="space-y-4">
                {/* Events */}
                {contextPreview.events && contextPreview.events.length > 0 && (
                  <div className="bg-avocado-green-10 rounded-lg p-3">
                    <p className="text-sm font-medium text-avocado-brown-100 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Sự kiện
                    </p>
                    <div className="space-y-2">
                      {contextPreview.events.map((event, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-700 flex items-start gap-2"
                        >
                          <span className="text-avocado-green-100 mt-0.5">
                            •
                          </span>
                          <span>{event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trends */}
                {contextPreview.trends && contextPreview.trends.length > 0 && (
                  <div className="bg-avocado-green-10 rounded-lg p-3">
                    <p className="text-sm font-medium text-avocado-brown-100 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Xu hướng
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {contextPreview.trends.slice(0, 6).map((trend, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-avocado-green-100 text-white text-xs rounded-lg"
                        >
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Demand Forecast */}
                {contextPreview.demand_forecast && (
                  <div className="bg-avocado-green-10 rounded-lg p-3">
                    <p className="text-sm font-medium text-avocado-brown-100 mb-2">
                      Dự báo nhu cầu
                    </p>
                    <div className="text-lg font-bold text-avocado-green-100">
                      {contextPreview.demand_forecast.level || "Medium"}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Score: {contextPreview.demand_forecast.score || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                Không có dữ liệu
              </p>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg border border-avocado-brown-30 p-4 space-y-4">
            {/* Days Ahead */}
            <div>
              <label className="block text-base font-medium text-avocado-brown-100 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Thời điểm
              </label>
              <div className="space-y-2">
                {daysAheadOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange("daysAhead", option.value)}
                    disabled={loading || loadingPreview}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                      formData.daysAhead === option.value
                        ? "border-avocado-green-100 bg-avocado-green-10"
                        : "border-avocado-brown-30 bg-white hover:border-avocado-green-100"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="font-medium text-base text-avocado-brown-100">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Segment */}
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-avocado-brown-100 mb-3">
                <Users className="w-5 h-5" />
                Khách hàng
              </label>
              <select
                value={formData.targetSegment}
                onChange={(e) => handleChange("targetSegment", e.target.value)}
                disabled={loading}
                className="w-full h-[44px] min-h-[44px] px-4 py-2 text-base bg-white border-2 border-avocado-brown-30 rounded-2xl text-avocado-brown-100 focus:outline-none focus:border-avocado-green-100 focus:ring-2 focus:ring-avocado-green-30 transition-all duration-200 appearance-none cursor-pointer hover:border-avocado-brown-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%233A060E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.25rem",
                }}
              >
                {segmentOptions.map((seg) => (
                  <option key={seg.value} value={seg.value}>
                    {seg.label}
                  </option>
                ))}
              </select>
              {selectedSegment && (
                <p className="text-base text-avocado-brown-50 mt-2">
                  💡 {selectedSegment.description}
                </p>
              )}
            </div>

            {/* Language */}
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-avocado-brown-100 mb-3">
                <span className="text-2xl">🌐</span>
                Ngôn ngữ
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleChange("language", e.target.value)}
                disabled={loading}
                className="w-full h-[44px] min-h-[44px] px-4 py-2 text-base bg-white border-2 border-avocado-brown-30 rounded-2xl text-avocado-brown-100 focus:outline-none focus:border-avocado-green-100 focus:ring-2 focus:ring-avocado-green-30 transition-all duration-200 appearance-none cursor-pointer hover:border-avocado-brown-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%233A060E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.25rem",
                }}
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleSmartGenerate}
              disabled={loading}
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-6 py-2 text-base font-semibold bg-avocado-green-100 text-avocado-brown-100 rounded-2xl hover:bg-avocado-green-80 hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-avocado-green-30"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Smart Generate
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Content - Result */}
        <div className="lg:col-span-2 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center bg-avocado-green-10 rounded-lg border border-avocado-brown-30 p-12 min-h-[400px]">
              <Loader2 className="w-12 h-12 text-avocado-green-100 animate-spin mb-4" />
              <p className="text-lg font-semibold text-avocado-brown-100 mb-2">
                AI đang phân tích...
              </p>
              <div className="text-sm text-gray-600 space-y-1 text-center">
                <p>Phát hiện events & trends</p>
                <p>Dự đoán nhu cầu</p>
                <p>Tạo recipe tối ưu</p>
              </div>
            </div>
          ) : currentRecipe ? (
            <>
              <RecipeDisplay recipe={currentRecipe} />

              {/* Generate Image Section */}
              <GenerateImage
                recipe={currentRecipe.recipe}
                onImageGenerated={handleImageGenerated}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-avocado-brown-30 p-12 min-h-[400px] text-center">
              <Target className="w-16 h-16 text-avocado-green-100 mb-4" />
              <h3 className="text-2xl font-bold text-avocado-brown-100 mb-2">
                Sẵn sàng tạo recipe
              </h3>
              <p className="text-base text-gray-600 max-w-md mb-6">
                Chọn thời điểm và khách hàng, sau đó nhấn{" "}
                <strong className="text-avocado-green-100">
                  Smart Generate
                </strong>
              </p>

              <div className="grid md:grid-cols-2 gap-4 max-w-lg">
                <div className="bg-avocado-green-10 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-avocado-green-100 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-base text-avocado-brown-100 mb-1">
                        Zero Input
                      </h4>
                      <p className="text-sm text-gray-600">
                        AI tự động phân tích
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-avocado-green-10 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-avocado-green-100 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-base text-avocado-brown-100 mb-1">
                        Smart Context
                      </h4>
                      <p className="text-sm text-gray-600">
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
