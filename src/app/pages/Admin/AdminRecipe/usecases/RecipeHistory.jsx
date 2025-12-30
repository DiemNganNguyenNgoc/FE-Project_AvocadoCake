import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  History,
  Trash2,
  ArrowLeft,
  ChefHat,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import useAdminRecipeStore from "../adminRecipeStore";
import RecipeDisplay from "../partials/RecipeDisplay";

/**
 * RecipeHistory Component
 * Hiển thị lịch sử các công thức đã tạo
 */
const RecipeHistory = () => {
  const { recipeHistory, deleteFromHistory, clearHistory } =
    useAdminRecipeStore();

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filterType, setFilterType] = useState("all");

  /**
   * Get type icon
   */
  const getTypeIcon = (type) => {
    switch (type) {
      case "from-ingredients":
        return <ChefHat className="w-4 h-4" />;
      case "from-trend":
        return <TrendingUp className="w-4 h-4" />;
      case "smart-recipe":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <ChefHat className="w-4 h-4" />;
    }
  };

  /**
   * Get type label
   */
  const getTypeLabel = (type) => {
    switch (type) {
      case "from-ingredients":
        return "Từ Nguyên Liệu";
      case "from-trend":
        return "Từ Xu Hướng";
      case "smart-recipe":
        return "Công Thức Thông Minh";
      default:
        return "Khác";
    }
  };

  /**
   * Format date
   */
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  /**
   * Handle delete
   */
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa công thức này?")) {
      deleteFromHistory(id);
      toast.success("✅ Đã xóa công thức");
      if (selectedRecipe?.id === id) {
        setSelectedRecipe(null);
      }
    }
  };

  /**
   * Handle clear all
   */
  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ lịch sử?")) {
      clearHistory();
      setSelectedRecipe(null);
      toast.success("✅ Đã xóa toàn bộ lịch sử");
    }
  };

  /**
   * Filter recipes
   */
  const filteredHistory =
    filterType === "all"
      ? recipeHistory
      : recipeHistory.filter((recipe) => recipe.type === filterType);

  return (
    <div className="space-y-6">
      {!selectedRecipe ? (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <History className="w-6 h-6 text-avocado-green-100" />
                <h2 className="text-2xl font-bold text-avocado-brown-100">
                  Lịch Sử Công Thức
                </h2>
              </div>
              <p className="text-xl text-gray-600">
                Tổng cộng: <strong>{recipeHistory.length}</strong> công thức
              </p>
            </div>
            {recipeHistory.length > 0 && (
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-xl bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Filter */}
          {recipeHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-avocado-brown-30 p-4">
              <label className="block text-xl font-medium text-avocado-brown-100 mb-3">
                Lọc theo loại:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-xl rounded-2xl border transition-colors ${
                    filterType === "all"
                      ? "bg-avocado-green-100 text-avocado-brown-100 border-avocado-green-100"
                      : "bg-white text-gray-700 border-avocado-brown-30 hover:border-avocado-green-100"
                  }`}
                  onClick={() => setFilterType("all")}
                >
                  Tất cả ({recipeHistory.length})
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-xl rounded-2xl border transition-colors ${
                    filterType === "from-ingredients"
                      ? "bg-avocado-green-100 text-avocado-brown-100 border-avocado-green-100"
                      : "bg-white text-gray-700 border-avocado-brown-30 hover:border-avocado-green-100"
                  }`}
                  onClick={() => setFilterType("from-ingredients")}
                >
                  <ChefHat className="w-4 h-4" />
                  Từ Nguyên Liệu
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-xl rounded-2xl border transition-colors ${
                    filterType === "from-trend"
                      ? "bg-avocado-green-100 text-avocado-brown-100 border-avocado-green-100"
                      : "bg-white text-gray-700 border-avocado-brown-30 hover:border-avocado-green-100"
                  }`}
                  onClick={() => setFilterType("from-trend")}
                >
                  <TrendingUp className="w-4 h-4" />
                  Từ Xu Hướng
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 text-xl rounded-2xl border transition-colors ${
                    filterType === "smart-recipe"
                      ? "bg-avocado-green-100 text-avocado-brown-100 border-avocado-green-100"
                      : "bg-white text-gray-700 border-avocado-brown-30 hover:border-avocado-green-100"
                  }`}
                  onClick={() => setFilterType("smart-recipe")}
                >
                  <Sparkles className="w-4 h-4" />
                  Thông Minh
                </button>
              </div>
            </div>
          )}

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div className="bg-avocado-green-10 rounded-2xl border border-avocado-brown-30 p-12 text-center">
              <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-avocado-brown-100 mb-2">
                Chưa có lịch sử
              </h3>
              <p className="text-xl text-gray-600">
                Các công thức bạn tạo sẽ được lưu tại đây
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredHistory.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className="bg-white rounded-2xl border border-avocado-brown-30 hover:border-avocado-green-100 hover:shadow-lg transition-all p-4 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-2 px-3 py-1 bg-avocado-green-10 text-avocado-brown-100 text-xl rounded-2xl">
                      {getTypeIcon(recipe.type)}
                      {getTypeLabel(recipe.type)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(recipe.id);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-avocado-brown-100">
                      {recipe.result?.recipe?.title ||
                        recipe.result?.title ||
                        "Công thức"}
                    </h3>
                    <p className="text-xl text-gray-600 line-clamp-2">
                      {recipe.result?.recipe?.description ||
                        recipe.result?.description ||
                        ""}
                    </p>

                    {/* Input Info */}
                    <div className="space-y-2 text-xl">
                      {recipe.data?.ingredients && (
                        <div className="flex gap-2">
                          <span className="font-medium text-avocado-brown-100">
                            Nguyên liệu:
                          </span>
                          <span className="text-gray-600 line-clamp-1">
                            {recipe.data.ingredients}
                          </span>
                        </div>
                      )}
                      {recipe.data?.trend && (
                        <div className="flex gap-2">
                          <span className="font-medium text-avocado-brown-100">
                            Xu hướng:
                          </span>
                          <span className="text-gray-600">
                            {recipe.data.trend}
                          </span>
                        </div>
                      )}
                      {recipe.data?.user_segment && (
                        <div className="flex gap-2">
                          <span className="font-medium text-avocado-brown-100">
                            Segment:
                          </span>
                          <span className="text-gray-600">
                            {recipe.data.user_segment}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-avocado-brown-30">
                      <span className="text-xl text-gray-500">
                        {formatDate(recipe.timestamp)}
                      </span>
                      <span className="text-xl text-avocado-green-100 font-medium">
                        Nhấn để xem chi tiết →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="flex items-center gap-2 px-4 py-2 text-xl bg-avocado-green-10 text-avocado-brown-100 rounded-lg hover:bg-avocado-green-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại lịch sử
          </button>

          <RecipeDisplay recipe={selectedRecipe.result} />
        </div>
      )}
    </div>
  );
};

export default RecipeHistory;
