import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useAdminRecipeStore from "../adminRecipeStore";
import { USER_SEGMENTS, LANGUAGES } from "../services/RecipeService";
import RecipeDisplay from "../partials/RecipeDisplay";
import Input from "../../../../components/AdminLayout/Input";
import Select from "../../../../components/AdminLayout/Select";
import Button from "../../../../components/AdminLayout/Button";

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

  useEffect(() => {
    loadTrendsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTrendsData = async () => {
    try {
      await Promise.all([fetchCurrentTrends(), fetchTrendingNow()]);
    } catch (error) {
      console.error("Failed to load trends:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.trend.trim()) {
      toast.warning("Vui lòng nhập xu hướng!");
      return;
    }
    try {
      toast.info("Đang tạo công thức từ xu hướng...");
      await generateFromTrend(formData);
      setShowResult(true);
      toast.success("Tạo công thức thành công!");
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  const handleReset = () => {
    setFormData({
      trend: "",
      user_segment: "gen_z",
      occasion: "",
      language: "vi",
    });
    setShowResult(false);
  };

  const applyTrend = (trend) => {
    setFormData((prev) => ({ ...prev, trend: trend }));
    toast.info(`Đã áp dụng xu hướng: ${trend}`);
  };

  return (
    <div className="space-y-10">
      {!showResult ? (
        <>
          <div className="mb-10">
            <h2 className="text-5xl font-semibold text-avocado-brown-100 mb-5">
              Tạo Công Thức Từ Xu Hướng
            </h2>
            <p className="text-3xl text-avocado-brown-50 font-light">
              Tạo công thức dựa trên xu hướng thị trường
            </p>
          </div>

          {trendingNow && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-10 rounded-2xl border-2 border-orange-200">
              <h3 className="text-4xl font-medium text-avocado-brown-100 mb-7">
                Trending Now
              </h3>
              <div className="flex flex-wrap gap-4">
                {trendingNow.top_trends?.slice(0, 10).map((trend, index) => (
                  <button
                    key={index}
                    onClick={() => applyTrend(trend.keyword || trend)}
                    className="px-9 py-5 bg-white hover:bg-orange-50 border-2 border-orange-300 rounded-full text-3xl font-medium text-avocado-brown-100 transition-all hover:border-orange-500"
                  >
                    {trend.keyword || trend}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-9">
            <Input
              label="Xu hướng *"
              name="trend"
              value={formData.trend}
              onChange={handleChange}
              placeholder="Ví dụ: matcha, korean style, healthy dessert..."
              required
            />

            <Select
              label="Phân khúc khách hàng"
              name="user_segment"
              value={formData.user_segment}
              onChange={handleChange}
              options={USER_SEGMENTS}
            />

            <Input
              label="Dịp đặc biệt (tùy chọn)"
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              placeholder="Ví dụ: sinh nhật, valentine, tết..."
            />

            <Select
              label="Ngôn ngữ"
              name="language"
              value={formData.language}
              onChange={handleChange}
              options={LANGUAGES}
            />

            <div className="flex gap-6">
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                size="lg"
                disabled={loading}
              >
                Làm mới
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="flex-1"
              >
                {loading ? "Đang tạo..." : "Tạo Công Thức"}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="space-y-10">
          <Button
            onClick={() => setShowResult(false)}
            variant="ghost"
            size="lg"
          >
            ← Tạo công thức mới
          </Button>
          <RecipeDisplay recipe={currentRecipe} />
        </div>
      )}
    </div>
  );
};

export default GenerateFromTrend;
