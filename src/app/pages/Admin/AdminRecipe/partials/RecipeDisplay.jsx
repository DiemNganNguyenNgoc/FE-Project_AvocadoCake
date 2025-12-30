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
  Megaphone,
  Hash,
  Zap,
  Calendar,
} from "lucide-react";

// Import formatting utilities
import { formatMarkdownText, parseStepText } from "../utils/formatText";

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
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Dữ liệu công thức không hợp lệ hoặc bị thiếu
        </p>
      </div>
    );
  }

  const {
    recipe: recipeData,
    analytics,
    marketing,
    context,
    next_events,
  } = recipe;

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
              <span className="text-xl font-medium">Thời gian</span>
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
              <span className="text-xl font-medium">Khẩu phần</span>
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
              <span className="text-xl font-medium">Độ khó</span>
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
              <span className="text-xl font-medium">Chi phí</span>
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

      {/* Instructions - Enhanced */}
      {recipeData.instructions && recipeData.instructions.length > 0 && (
        <div className="bg-white dark:bg-dark-2 rounded-xl p-6 border border-gray-200 dark:border-stroke-dark">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Hướng dẫn thực hiện
          </h3>
          <ol className="space-y-4">
            {recipeData.instructions.map((instruction, index) => {
              const { title, content } = parseStepText(instruction);

              return (
                <li
                  key={index}
                  className="flex items-start gap-4 bg-gray-50 dark:bg-dark-3 rounded-lg p-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    {title && (
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {formatMarkdownText(title)}
                      </h4>
                    )}
                    <div className="text-gray-700 dark:text-gray-300">
                      {content.split("\n").map((line, lineIdx) => {
                        if (!line.trim()) return null;

                        // Check if line contains TIPS (but might have text before it)
                        const tipsMatch = line.match(
                          /(.*)(\*\*TIPS:\*\*|\*\*Tips:\*\*)(.*)/i
                        );

                        if (tipsMatch) {
                          const [, beforeTips, tipsLabel, afterTips] =
                            tipsMatch;

                          return (
                            <div key={lineIdx}>
                              {/* Text before TIPS */}
                              {beforeTips.trim() && (
                                <p className="mb-2">
                                  {formatMarkdownText(beforeTips.trim())}
                                </p>
                              )}

                              {/* TIPS box */}
                              <div className="mt-4 mb-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded">
                                <div className="text-yellow-900 dark:text-yellow-200 font-medium">
                                  {formatMarkdownText(tipsLabel + afterTips)}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <p key={lineIdx} className="mb-2 last:mb-0">
                            {formatMarkdownText(line)}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </li>
              );
            })}
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
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-1">
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
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-1">
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
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-1">
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
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-1">
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
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    Đánh giá:
                  </p>
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
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
              className="px-4 py-2 bg-gray-100 dark:bg-dark-3 text-gray-700 dark:text-gray-300 text-xl font-medium rounded-full border border-gray-200 dark:border-stroke-dark"
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

      {/* Marketing Strategy (NEW - for Smart Generate) */}
      {marketing && Object.keys(marketing).length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-orange-600" />
            Chiến lược Marketing
          </h3>

          <div className="space-y-4">
            {/* Hashtags */}
            {marketing.hashtags && marketing.hashtags.length > 0 && (
              <div className="bg-white dark:bg-dark-3 rounded-lg p-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Hashtags đề xuất:
                </p>
                <div className="flex flex-wrap gap-2">
                  {marketing.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-medium rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Post Caption */}
            {marketing.post_caption && (
              <div className="bg-white dark:bg-dark-3 rounded-lg p-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  📱 Caption đề xuất:
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {marketing.post_caption}
                </p>
              </div>
            )}

            {/* Target Platforms */}
            {marketing.target_platforms &&
              marketing.target_platforms.length > 0 && (
                <div className="bg-white dark:bg-dark-3 rounded-lg p-4">
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    🎯 Nền tảng đề xuất:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {marketing.target_platforms.map((platform, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 dark:bg-dark-4 text-gray-700 dark:text-gray-300 text-xl font-medium rounded-lg"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Viral Potential */}
            {analytics?.viral_potential && (
              <div className="bg-white dark:bg-dark-3 rounded-lg p-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Tiềm năng viral:
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-gray-200 dark:bg-dark-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                      style={{
                        width: `${analytics.viral_potential.score || 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-lg font-bold text-orange-600">
                    {analytics.viral_potential.score || 0}
                  </span>
                </div>
                {analytics.viral_potential.level && (
                  <p className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                    Mức độ: <strong>{analytics.viral_potential.level}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Context Info (NEW - for Smart Generate) */}
      {context && Object.keys(context).length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            Context Phân tích
          </h3>

          <div className="space-y-3">
            {/* Detected Events */}
            {context.detected_events && context.detected_events.length > 0 && (
              <div className="bg-white dark:bg-dark-3 rounded-lg p-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  📅 Sự kiện phát hiện:
                </p>
                <ul className="space-y-1">
                  {context.detected_events.map((event, idx) => (
                    <li
                      key={idx}
                      className="text-xl text-gray-700 dark:text-gray-300 flex items-start gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Active Trends */}
            {context.active_trends && context.active_trends.length > 0 && (
              <div className="bg-white dark:bg-dark-3 rounded-lg p-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  🔥 Xu hướng đang hot:
                </p>
                <div className="flex flex-wrap gap-2">
                  {context.active_trends.map((trend, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-xl font-medium rounded-full"
                    >
                      {trend}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Demand Level */}
            {context.demand_forecast && (
              <div className="bg-white dark:bg-dark-3 rounded-lg p-4">
                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  📊 Dự báo nhu cầu:
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-indigo-600">
                    {context.demand_forecast.level || "N/A"}
                  </div>
                  <div className="text-xl text-gray-600 dark:text-gray-400">
                    Score: {context.demand_forecast.score || "N/A"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Events (NEW - for Smart Generate) */}
      {next_events && next_events.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-600" />
            Sự kiện sắp tới
          </h3>

          <div className="space-y-3">
            {next_events.map((event, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-dark-3 rounded-lg p-4 border-l-4 border-green-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                      {event.event_name || "N/A"}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xl text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.event_date || "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.days_until} ngày nữa
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.impact_level === "high"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : event.impact_level === "medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        Impact: {event.impact_level || "N/A"}
                      </span>
                    </div>
                  </div>
                  {event.suggested_theme && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Theme đề xuất:
                      </p>
                      <p className="text-xl font-medium text-gray-900 dark:text-white">
                        {event.suggested_theme}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDisplay;
