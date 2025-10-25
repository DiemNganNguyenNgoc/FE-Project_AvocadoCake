import React, { useState } from "react";
import { History, Trash2, Eye, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import RecipeDisplay from "../components/RecipeDisplay";
import Button from "../../../components/AdminLayout/Button";
import Select from "../../../components/AdminLayout/Select";

/**
 * RecipeHistory - Lịch sử công thức
 * React thuần + TailwindCSS + AdminLayout components
 */
const RecipeHistory = ({
  loading,
  setLoading,
  currentRecipe,
  setCurrentRecipe,
  recipeHistory,
  deleteFromHistory,
  clearHistory,
}) => {
  // State
  const [filterType, setFilterType] = useState("all");
  const [viewingRecipe, setViewingRecipe] = useState(null);

  // Filter options
  const filterOptions = [
    { value: "all", label: "🗂️ Tất cả" },
    { value: "ingredient", label: "🧺 Từ Nguyên liệu" },
    { value: "trend", label: "📈 Từ Xu hướng" },
    { value: "forecast", label: "🔮 Dự báo" },
  ];

  /**
   * Filter recipes by type
   */
  const filteredHistory =
    filterType === "all"
      ? recipeHistory
      : recipeHistory.filter((recipe) => recipe.type === filterType);

  /**
   * View recipe
   */
  const handleViewRecipe = (recipe) => {
    setViewingRecipe(recipe);
    setCurrentRecipe(recipe);
    toast.info("👁️ Đang xem công thức từ lịch sử");
  };

  /**
   * Delete recipe
   */
  const handleDeleteRecipe = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa công thức này?")) {
      deleteFromHistory(id);
      toast.success("🗑️ Đã xóa công thức");

      if (viewingRecipe?.id === id) {
        setViewingRecipe(null);
        setCurrentRecipe(null);
      }
    }
  };

  /**
   * Clear all history
   */
  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc muốn xóa TẤT CẢ lịch sử công thức?")) {
      clearHistory();
      setViewingRecipe(null);
      setCurrentRecipe(null);
      toast.success("🗑️ Đã xóa toàn bộ lịch sử");
    }
  };

  /**
   * Get type label
   */
  const getTypeLabel = (type) => {
    switch (type) {
      case "ingredient":
        return {
          label: "Từ Nguyên liệu",
          emoji: "🧺",
          color:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        };
      case "trend":
        return {
          label: "Từ Xu hướng",
          emoji: "📈",
          color:
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        };
      case "forecast":
        return {
          label: "Dự báo",
          emoji: "🔮",
          color:
            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        };
      default:
        return {
          label: "Khác",
          emoji: "📝",
          color:
            "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <History className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Lịch sử công thức
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tổng cộng: <strong>{filteredHistory.length}</strong> công thức
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={filterOptions}
            className="min-w-[180px]"
          />

          {recipeHistory.length > 0 && (
            <Button variant="danger" onClick={handleClearAll}>
              <Trash2 className="w-5 h-5" />
              Xóa tất cả
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recipe List */}
        <div className="lg:col-span-1">
          {filteredHistory.length === 0 ? (
            <div className="bg-gray-50 dark:bg-dark-3 rounded-xl p-8 text-center border border-gray-200 dark:border-stroke-dark">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Chưa có lịch sử
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filterType === "all"
                  ? "Bạn chưa tạo công thức nào"
                  : `Không có công thức loại "${
                      filterOptions.find((opt) => opt.value === filterType)
                        ?.label
                    }"`}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredHistory.map((recipe) => {
                const typeInfo = getTypeLabel(recipe.type);
                const isViewing = viewingRecipe?.id === recipe.id;

                return (
                  <div
                    key={recipe.id}
                    className={`
                      bg-white dark:bg-dark-2 rounded-xl p-4 border-2 transition-all cursor-pointer
                      ${
                        isViewing
                          ? "border-primary shadow-lg shadow-primary/20"
                          : "border-gray-200 dark:border-stroke-dark hover:border-primary/50 hover:shadow-md"
                      }
                    `}
                    onClick={() => handleViewRecipe(recipe)}
                  >
                    {/* Recipe Title */}
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {recipe.recipe?.name || "Công thức không tên"}
                    </h3>

                    {/* Type Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${typeInfo.color}`}
                      >
                        {typeInfo.emoji} {typeInfo.label}
                      </span>
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <Calendar className="w-3 h-3" />
                      {new Date(recipe.timestamp).toLocaleString("vi-VN")}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewRecipe(recipe);
                        }}
                        className="flex-1 px-3 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Xem
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRecipe(recipe.id);
                        }}
                        className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column - Recipe Display */}
        <div className="lg:col-span-2">
          {viewingRecipe ? (
            <RecipeDisplay recipe={viewingRecipe} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center bg-gray-50 dark:bg-dark-3 rounded-xl border border-gray-200 dark:border-stroke-dark space-y-4">
              <div className="text-8xl">👈</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chọn công thức để xem
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Nhấn vào một công thức bên trái để xem chi tiết
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeHistory;
