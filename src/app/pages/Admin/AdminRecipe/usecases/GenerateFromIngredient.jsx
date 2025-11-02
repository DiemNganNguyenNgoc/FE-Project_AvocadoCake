import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../../components/AdminLayout/Button";
import Select from "../../../../components/AdminLayout/Select";
import Textarea from "../../../../components/AdminLayout/Textarea";
import useAdminRecipeStore from "../adminRecipeStore";
import RecipeDisplay from "../partials/RecipeDisplay";
import { LANGUAGES } from "../services/RecipeService";

/**
 * GenerateFromIngredient Component
 * Redesigned minimal & elegant
 */
const GenerateFromIngredient = () => {
  const { generateFromIngredients, loading, currentRecipe } =
    useAdminRecipeStore();

  const [formData, setFormData] = useState({
    ingredients: "",
    language: "vi",
    use_t5: false, // Tắt T5 mặc định vì Gemini đang rate limit
  });

  const [showResult, setShowResult] = useState(false);

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Handle form submit
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.ingredients.trim()) {
      toast.warning("Vui lòng nhập nguyên liệu!");
      return;
    }

    try {
      toast.info("Đang tạo công thức...");
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
      use_t5: false,
    });
    setShowResult(false);
  };

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

  const applyTemplate = (template) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: template.ingredients,
    }));
    toast.info(`Đã áp dụng: ${template.name}`);
  };

  return (
    <div className="space-y-10">
      {!showResult ? (
        <>
          {/* Header - Minimal */}
          <div className="mb-10">
            <h2 className="text-5xl font-semibold text-avocado-brown-100 mb-5">
              Tạo Công Thức Từ Nguyên Liệu
            </h2>
            <p className="text-3xl text-avocado-brown-50 font-light">
              Nhập danh sách nguyên liệu, AI sẽ tạo công thức hoàn chỉnh
            </p>
          </div>

          {/* Quick Templates - Elegant Cards */}
          <div className="space-y-6">
            <h3 className="text-4xl font-medium text-avocado-brown-100">
              Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ingredientTemplates.map((template, index) => (
                <button
                  key={index}
                  className="text-left p-9 border-2 border-avocado-brown-30 rounded-2xl hover:border-avocado-green-100 hover:bg-avocado-green-10 transition-all"
                  onClick={() => applyTemplate(template)}
                  type="button"
                >
                  <div className="font-medium text-3xl text-avocado-brown-100 mb-4">
                    {template.name}
                  </div>
                  <div className="text-2xl text-avocado-brown-50 line-clamp-2">
                    {template.ingredients}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form - Clean & Modern */}
          <form onSubmit={handleSubmit} className="space-y-9">
            {/* Ingredients Input */}
            <Textarea
              label="Nguyên liệu *"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="Ví dụ: bột mì, đường, trứng, bơ, chocolate, sữa tươi..."
              rows={6}
              helperText="Ngăn cách các nguyên liệu bằng dấu phẩy (,)"
              required
            />

            {/* Language Selection */}
            <Select
              label="Ngôn ngữ"
              name="language"
              value={formData.language}
              onChange={handleChange}
              options={LANGUAGES}
            />

            {/* T5 Model Toggle */}
            <div className="flex items-start gap-6 p-9 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
              <input
                type="checkbox"
                id="use_t5"
                name="use_t5"
                checked={formData.use_t5}
                onChange={handleChange}
                className="mt-2 w-8 h-8 text-avocado-green-100 border-avocado-brown-30 rounded-lg focus:ring-avocado-green-100"
              />
              <label htmlFor="use_t5" className="flex-1 cursor-pointer">
                <div className="font-medium text-3xl text-avocado-brown-100 mb-3">
                  Sử dụng T5 Model
                </div>
                <div className="text-2xl text-avocado-brown-50">
                  <strong>Tạm thời TẮT</strong> - Gemini đang rate limit
                </div>
              </label>
            </div>

            {/* Action Buttons */}
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
          <div className="pb-8 border-b border-avocado-brown-30">
            <Button
              onClick={() => setShowResult(false)}
              variant="ghost"
              size="lg"
            >
              ← Tạo công thức mới
            </Button>
          </div>

          <RecipeDisplay recipe={currentRecipe} />
        </div>
      )}
    </div>
  );
};

export default GenerateFromIngredient;
