import { useState } from "react";
import { toast } from "react-toastify";
import useAdminRecipeStore from "../adminRecipeStore";
import RecipeDisplay from "../partials/RecipeDisplay";
import Button from "../../../../components/AdminLayout/Button";

/**
 * GenerateFromIngredient - Tạo công thức từ nguyên liệu
 * Redesigned: Simple, Clean, User-friendly (AvocadoCake design system)
 */
const GenerateFromIngredient = () => {
  const { generateFromIngredients, loading, currentRecipe } =
    useAdminRecipeStore();

  const [formData, setFormData] = useState({
    ingredients: "",
    language: "vi",
  });

  const [showResult, setShowResult] = useState(false);

  // Language options
  const LANGUAGES = [
    { value: "vi", label: "Tiếng Việt" },
    { value: "en", label: "English" },
  ];

  // Quick templates
  const ingredientTemplates = [
    {
      name: "Bánh Chocolate",
      ingredients:
        "bột mì, đường, bơ, trứng, bột ca cao, bột nở, sữa tươi, vanilla",
    },
    {
      name: "Bánh Vanilla",
      ingredients: "bột mì, đường, bơ, trứng, sữa tươi, vanilla, bột nở",
    },
    {
      name: "Brownies",
      ingredients: "chocolate đen, bơ, đường, trứng, bột mì, bột ca cao, muối",
    },
    {
      name: "Cookies",
      ingredients:
        "bột mì, đường nâu, bơ, trứng, chocolate chips, bột nở, vanilla",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ingredients.trim()) {
      toast.warning("Vui lòng nhập nguyên liệu!");
      return;
    }

    try {
      await generateFromIngredients(formData);
      setShowResult(true);
      toast.success("Tạo công thức thành công!");
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  const handleReset = () => {
    setFormData({
      ingredients: "",
      language: "vi",
    });
    setShowResult(false);
  };

  const applyTemplate = (template) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: template.ingredients,
    }));
    toast.info(`Đã áp dụng: ${template.name}`);
  };

  return (
    <div className="space-y-6">
      {!showResult ? (
        <>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-avocado-brown-100 mb-2">
              Tạo Công Thức Từ Nguyên Liệu
            </h2>
            <p className="text-base text-avocado-brown-50">
              Nhập danh sách nguyên liệu, AI sẽ tạo công thức hoàn chỉnh
            </p>
          </div>

          {/* Quick Templates */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-avocado-brown-100">
              Templates nhanh
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ingredientTemplates.map((template, index) => (
                <button
                  key={index}
                  className="text-left p-4 border-2 border-avocado-brown-30 rounded-lg hover:border-avocado-green-100 hover:bg-avocado-green-10 transition-all"
                  onClick={() => applyTemplate(template)}
                  type="button"
                >
                  <div className="font-medium text-base text-avocado-brown-100 mb-1">
                    {template.name}
                  </div>
                  <div className="text-sm text-avocado-brown-50 line-clamp-1">
                    {template.ingredients}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Ingredients Input */}
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-avocado-brown-100 mb-3">
                <span className="text-2xl">🥄</span>
                Nguyên liệu <span className="text-red-500">*</span>
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Ví dụ: bột mì, đường, trứng, bơ, chocolate, sữa tươi..."
                rows={4}
                className="w-full min-h-[100px] px-4 py-3 text-base border-2 border-avocado-brown-30 rounded-2xl text-avocado-brown-100 placeholder-avocado-brown-50 focus:border-avocado-green-100 focus:outline-none focus:ring-2 focus:ring-avocado-green-30 transition-all duration-200 hover:border-avocado-brown-50"
                required
              />
              <p className="text-base text-avocado-brown-50 mt-2">
                💡 Ngăn cách các nguyên liệu bằng dấu phẩy (,)
              </p>
            </div>

            {/* Language Selection */}
            <div>
              <label className="flex items-center gap-2 text-lg font-medium text-avocado-brown-100 mb-3">
                <span className="text-2xl">🌐</span>
                Ngôn ngữ
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full h-[44px] min-h-[44px] px-4 py-2 text-base bg-white border-2 border-avocado-brown-30 rounded-2xl text-avocado-brown-100 focus:outline-none focus:border-avocado-green-100 focus:ring-2 focus:ring-avocado-green-30 transition-all duration-200 appearance-none cursor-pointer hover:border-avocado-brown-50"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%233A060E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1.25rem",
                }}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                onClick={handleReset}
                disabled={loading}
                variant="outline"
              >
                Làm mới
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 min-h-[44px] px-6 py-2 bg-avocado-green-100 text-avocado-brown-100 rounded-2xl text-lg font-semibold hover:bg-avocado-green-80 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-avocado-green-30"
              >
                {loading ? "⏳ Đang tạo..." : "Tạo Công Thức"}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setShowResult(false)}
            className="text-base text-avocado-brown-100 hover:text-avocado-green-100 font-medium"
          >
            ← Tạo công thức mới
          </button>

          <RecipeDisplay recipe={currentRecipe} />
        </div>
      )}
    </div>
  );
};

export default GenerateFromIngredient;
