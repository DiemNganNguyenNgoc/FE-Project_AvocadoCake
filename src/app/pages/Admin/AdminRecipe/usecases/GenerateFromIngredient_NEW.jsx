import React, { useState } from "react";
import { toast } from "react-toastify";
import recipeAPIService from "../services/RecipeService";
import RecipeDisplay from "../components/RecipeDisplay";
import { Sparkles, RotateCcw, Wand2 } from "lucide-react";
import Button from "../../../components/AdminLayout/Button";
import Textarea from "../../../components/AdminLayout/Textarea";
import Select from "../../../components/AdminLayout/Select";

/**
 * GenerateFromIngredient - Tạo công thức từ nguyên liệu
 * React thuần + TailwindCSS + AdminLayout components
 */
const GenerateFromIngredient = ({
  loading,
  setLoading,
  currentRecipe,
  setCurrentRecipe,
  addToHistory,
}) => {
  // State
  const [formData, setFormData] = useState({
    ingredients: "",
    language: "vi",
    userSegment: "gen_z",
    useT5: false,
  });

  // Template ingredients
  const ingredientTemplates = [
    {
      name: "🥑 Bánh Bơ Matcha",
      ingredients:
        "bơ, bột mì, đường, trứng, bột matcha, sữa tươi, baking powder",
    },
    {
      name: "🍫 Bánh Chocolate",
      ingredients:
        "bột mì, đường, trứng, bơ, chocolate, sữa, baking soda, vani",
    },
    {
      name: "🍓 Bánh Red Velvet",
      ingredients:
        "bột mì, đường, trứng, bơ, buttermilk, màu đỏ thực phẩm, cacao, giấm, baking soda",
    },
    {
      name: "🥥 Bánh Dừa",
      ingredients:
        "bột mì, đường, trứng, dừa nạo, nước cốt dừa, bơ, baking powder",
    },
  ];

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

  /**
   * Handle form change
   */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Apply template
   */
  const applyTemplate = (template) => {
    setFormData((prev) => ({ ...prev, ingredients: template.ingredients }));
    toast.info(`📋 Đã áp dụng template: ${template.name}`);
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({
      ingredients: "",
      language: "vi",
      userSegment: "gen_z",
      useT5: false,
    });
    setCurrentRecipe(null);
  };

  /**
   * Generate recipe
   */
  const handleGenerate = async () => {
    // Validation
    if (!formData.ingredients.trim()) {
      toast.warn("⚠️ Vui lòng nhập danh sách nguyên liệu!");
      return;
    }

    setLoading(true);
    setCurrentRecipe(null);

    try {
      const result = await recipeAPIService.generateFromIngredients({
        ingredients: formData.ingredients,
        language: formData.language,
        user_segment: formData.userSegment,
        use_t5: formData.useT5,
      });

      if (result.success) {
        const recipeData = {
          ...result,
          type: "ingredient",
          params: formData,
        };

        setCurrentRecipe(recipeData);
        addToHistory(recipeData);

        toast.success("✅ Tạo công thức thành công!", {
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
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tạo công thức từ Nguyên liệu
        </h2>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Templates */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              📝 Templates nhanh
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ingredientTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => applyTemplate(template)}
                  disabled={loading}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-3 dark:to-dark-4 border border-gray-200 dark:border-stroke-dark rounded-lg hover:shadow-md hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title={template.ingredients}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Ingredients Input */}
          <Textarea
            label="🧺 Danh sách nguyên liệu"
            value={formData.ingredients}
            onChange={(e) => handleChange("ingredients", e.target.value)}
            rows={6}
            placeholder="Ví dụ: bơ, bột mì, đường, trứng, chocolate, sữa..."
            helperText="Nhập các nguyên liệu, phân cách bằng dấu phẩy"
            disabled={loading}
          />

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
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
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
                  <Wand2 className="w-4 h-4" />
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
              disabled={loading || !formData.ingredients.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Tạo công thức
                </>
              )}
            </Button>

            <Button variant="outline" onClick={resetForm} disabled={loading}>
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Right Column - Result */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                🤖 AI đang tạo công thức...
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                Vui lòng đợi trong giây lát
              </p>
            </div>
          ) : currentRecipe ? (
            <RecipeDisplay recipe={currentRecipe} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4">
              <div className="text-8xl">🍰</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chưa có công thức nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Nhập danh sách nguyên liệu và nhấn{" "}
                <strong>"Tạo công thức"</strong> để bắt đầu
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateFromIngredient;
