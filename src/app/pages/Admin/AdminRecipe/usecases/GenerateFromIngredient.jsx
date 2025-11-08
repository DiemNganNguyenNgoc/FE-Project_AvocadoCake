import { useState } from "react";
import { toast } from "react-toastify";
import useAdminRecipeStore from "../adminRecipeStore";
import RecipeDisplay from "../partials/RecipeDisplay";

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
              <label className="block text-base font-medium text-avocado-brown-100 mb-2">
                Nguyên liệu <span className="text-red-500">*</span>
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Ví dụ: bột mì, đường, trứng, bơ, chocolate, sữa tươi..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-avocado-brown-30 rounded-lg text-avocado-brown-100 placeholder-avocado-brown-50 focus:border-avocado-green-100 focus:outline-none focus:ring-2 focus:ring-avocado-green-30"
                required
              />
              <p className="text-sm text-avocado-brown-50 mt-1">
                Ngăn cách các nguyên liệu bằng dấu phẩy (,)
              </p>
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-base font-medium text-avocado-brown-100 mb-2">
                Ngôn ngữ
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-avocado-brown-30 rounded-lg text-avocado-brown-100 focus:border-avocado-green-100 focus:outline-none focus:ring-2 focus:ring-avocado-green-30"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-6 py-3 border-2 border-avocado-brown-30 text-avocado-brown-100 bg-white rounded-lg font-medium hover:bg-avocado-brown-10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Làm mới
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-avocado-green-100 text-avocado-brown-100 rounded-lg font-medium hover:bg-avocado-green-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-avocado-green-30"
              >
                {loading ? "Đang tạo..." : "Tạo Công Thức"}
              </button>
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
