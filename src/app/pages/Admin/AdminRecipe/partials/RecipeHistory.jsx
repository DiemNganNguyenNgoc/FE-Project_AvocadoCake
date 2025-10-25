import React from "react";
import useAdminRecipeStore from "../adminRecipeStore";
import RecipeDisplay from "../partials/RecipeDisplay";

const RecipeHistory = () => {
  const { recipeHistory, clearHistory, deleteFromHistory } =
    useAdminRecipeStore();
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);

  if (selectedRecipe) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => setSelectedRecipe(null)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
        >
          ← Quay lại lịch sử
        </button>
        <RecipeDisplay recipe={selectedRecipe.result} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📚 Lịch Sử Công Thức
          </h2>
          <p className="text-gray-600">
            Xem lại các công thức đã tạo ({recipeHistory.length}/20)
          </p>
        </div>
        {recipeHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
          >
            🗑️ Xóa tất cả
          </button>
        )}
      </div>

      {recipeHistory.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có lịch sử
          </h3>
          <p className="text-gray-600">
            Các công thức bạn tạo sẽ được lưu lại ở đây
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipeHistory.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-primary transition-all cursor-pointer group"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">
                      {recipe.type === "from-ingredients"
                        ? "🥄"
                        : recipe.type === "from-trend"
                        ? "🔥"
                        : "🤖"}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {recipe.type === "from-ingredients"
                        ? "Từ nguyên liệu"
                        : recipe.type === "from-trend"
                        ? "Từ xu hướng"
                        : "Smart Recipe"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {recipe.result?.recipe?.title || "Công thức bánh"}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFromHistory(recipe.id);
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  🗑️
                </button>
              </div>

              <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                {recipe.type === "from-ingredients" &&
                  recipe.data?.ingredients && (
                    <span>Nguyên liệu: {recipe.data.ingredients}</span>
                  )}
                {recipe.type === "from-trend" && recipe.data?.trend && (
                  <span>Xu hướng: {recipe.data.trend}</span>
                )}
              </div>

              <div className="text-xs text-gray-500">
                {new Date(recipe.timestamp).toLocaleString("vi-VN")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeHistory;
