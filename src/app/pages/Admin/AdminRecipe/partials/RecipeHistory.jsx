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
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-5xl font-semibold text-avocado-brown-100 mb-4">
            Lịch Sử Công Thức
          </h2>
          <p className="text-3xl text-avocado-brown-50 font-light">
            Xem lại các công thức đã tạo ({recipeHistory.length}/20)
          </p>
        </div>
        {recipeHistory.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-8 py-5 text-3xl bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl font-medium transition-colors"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {recipeHistory.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="text-9xl mb-6">📚</div>
          <h3 className="text-4xl font-semibold text-gray-900 mb-4">
            Chưa có lịch sử
          </h3>
          <p className="text-3xl text-gray-600">
            Các công thức bạn tạo sẽ được lưu lại ở đây
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipeHistory.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-avocado-green-100 transition-all cursor-pointer group"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">
                      {recipe.type === "from-ingredients"
                        ? "🥄"
                        : recipe.type === "from-trend"
                        ? "🔥"
                        : "🤖"}
                    </span>
                    <span className="text-2xl font-medium px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                      {recipe.type === "from-ingredients"
                        ? "Từ nguyên liệu"
                        : recipe.type === "from-trend"
                        ? "Từ xu hướng"
                        : "Smart Recipe"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-3xl text-gray-900 line-clamp-1">
                    {recipe.result?.recipe?.title || "Công thức bánh"}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFromHistory(recipe.id);
                  }}
                  className="text-3xl text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  🗑️
                </button>
              </div>

              <div className="text-2xl text-gray-600 mb-4 line-clamp-2">
                {recipe.type === "from-ingredients" &&
                  recipe.data?.ingredients && (
                    <span>Nguyên liệu: {recipe.data.ingredients}</span>
                  )}
                {recipe.type === "from-trend" && recipe.data?.trend && (
                  <span>Xu hướng: {recipe.data.trend}</span>
                )}
              </div>

              <div className="text-2xl text-gray-500">
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
