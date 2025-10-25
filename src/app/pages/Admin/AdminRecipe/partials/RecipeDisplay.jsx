import React from "react";
import {
  ChefHat,
  Clock,
  Users,
  Flame,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
  Award,
  Target,
  Sparkles,
} from "lucide-react";

/**
 * RecipeDisplay - Component hiển thị chi tiết công thức
 * React thuần + TailwindCSS
 */
const RecipeDisplay = ({ recipe }) => {
  if (!recipe || !recipe.recipe) {
    return (
      <div className="bg-gray-50 dark:bg-dark-3 rounded-xl p-8 text-center border border-gray-200 dark:border-stroke-dark">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Không có dữ liệu công thức
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Dữ liệu công thức không hợp lệ hoặc bị thiếu
        </p>
      </div>
    );
  }

  const { recipe: recipeData, analytics } = recipe;

  /**
   * Get score color
   */
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      {/* Recipe Header */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="text-5xl">🍰</div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {recipeData.name || "Công thức không tên"}
            </h2>
            {recipeData.description && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {recipeData.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Info Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {recipeData.prep_time && (
          <div className="bg-white dark:bg-dark-2 rounded-xl p-4 border border-gray-200 dark:border-stroke-dark">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Thời gian</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {recipeData.prep_time} phút
            </p>
          </div>
        )}

        {recipeData.servings && (
          <div className="bg-white dark:bg-dark-2 rounded-xl p-4 border border-gray-200 dark:border-stroke-dark">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Khẩu phần</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {recipeData.servings} người
            </p>
          </div>
        )}

        {recipeData.difficulty && (
          <div className="bg-white dark:bg-dark-2 rounded-xl p-4 border border-gray-200 dark:border-stroke-dark">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">Độ khó</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
              {recipeData.difficulty}
            </p>
          </div>
        )}

        {recipeData.estimated_cost && (
          <div className="bg-white dark:bg-dark-2 rounded-xl p-4 border border-gray-200 dark:border-stroke-dark">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">Chi phí</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {recipeData.estimated_cost}
            </p>
          </div>
        )}
      </div>

      {/* Ingredients */}
      {recipeData.ingredients && recipeData.ingredients.length > 0 && (
        <div className="bg-white dark:bg-dark-2 rounded-xl p-6 border border-gray-200 dark:border-stroke-dark">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-primary" />
            Nguyên liệu
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipeData.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start gap-3 bg-gray-50 dark:bg-dark-3 rounded-lg p-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 dark:text-gray-300">
                  {ingredient}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      {recipeData.instructions && recipeData.instructions.length > 0 && (
        <div className="bg-white dark:bg-dark-2 rounded-xl p-6 border border-gray-200 dark:border-stroke-dark">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Hướng dẫn thực hiện
          </h3>
          <ol className="space-y-4">
            {recipeData.instructions.map((instruction, index) => (
              <li
                key={index}
                className="flex items-start gap-4 bg-gray-50 dark:bg-dark-3 rounded-lg p-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed pt-1">
                  {instruction}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Tips */}
      {recipeData.tips && recipeData.tips.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-600" />
            Mẹo hay
          </h3>
          <ul className="space-y-2">
            {recipeData.tips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
              >
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Analytics Scores */}
      {analytics && Object.keys(analytics).length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Phân tích AI
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.trend_score !== undefined && (
              <div className="bg-white dark:bg-dark-3 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Xu hướng
                </p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(
                    analytics.trend_score
                  )}`}
                >
                  {analytics.trend_score}
                </p>
              </div>
            )}

            {analytics.popularity_score !== undefined && (
              <div className="bg-white dark:bg-dark-3 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Phổ biến
                </p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(
                    analytics.popularity_score
                  )}`}
                >
                  {analytics.popularity_score}
                </p>
              </div>
            )}

            {analytics.health_score !== undefined && (
              <div className="bg-white dark:bg-dark-3 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Sức khỏe
                </p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(
                    analytics.health_score
                  )}`}
                >
                  {analytics.health_score}
                </p>
              </div>
            )}

            {analytics.innovation_score !== undefined && (
              <div className="bg-white dark:bg-dark-3 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Sáng tạo
                </p>
                <p
                  className={`text-2xl font-bold ${getScoreColor(
                    analytics.innovation_score
                  )}`}
                >
                  {analytics.innovation_score}
                </p>
              </div>
            )}
          </div>

          {/* Overall Score */}
          {analytics.overall_score !== undefined && (
            <div className="mt-4 bg-white dark:bg-dark-3 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-purple-600" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Điểm tổng thể
                  </span>
                </div>
                <span
                  className={`text-3xl font-bold ${getScoreColor(
                    analytics.overall_score
                  )}`}
                >
                  {analytics.overall_score}
                </span>
              </div>

              {/* Score bar */}
              <div className="mt-3 h-3 bg-gray-200 dark:bg-dark-4 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    analytics.overall_score >= 80
                      ? "bg-green-500"
                      : analytics.overall_score >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${analytics.overall_score}%` }}
                />
              </div>
            </div>
          )}

          {/* Recommendation */}
          {analytics.recommendation && (
            <div className="mt-4 bg-white dark:bg-dark-3 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Đánh giá:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {analytics.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tags */}
      {recipeData.tags && recipeData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recipeData.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 dark:bg-dark-3 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full border border-gray-200 dark:border-stroke-dark"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Success Badge */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800 text-center">
        <p className="text-green-700 dark:text-green-300 font-semibold flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />✨ Công thức được tạo thành công
          bởi AI
        </p>
      </div>
    </div>
  );
};

export default RecipeDisplay;
