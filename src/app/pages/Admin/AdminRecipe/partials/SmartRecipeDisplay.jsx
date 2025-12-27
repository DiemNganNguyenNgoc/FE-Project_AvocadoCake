import React, { useState } from "react";
import {
  ChefHat,
  Clock,
  Users,
  Flame,
  TrendingUp,
  CheckCircle,
  Star,
  Target,
  Sparkles,
  Hash,
  Calendar,
  Megaphone,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Zap,
  Award,
  Instagram,
  Share2,
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
} from "lucide-react";

/**
 * SmartRecipeDisplay - Component hiển thị đầy đủ kết quả Smart Generate
 * Design đẹp, hiển thị tất cả insights: recipe, context, trends, marketing
 */
const SmartRecipeDisplay = ({ data }) => {
  const [expandedSections, setExpandedSections] = useState({
    recipe: true,
    context: false,
    trends: false,
    marketing: false,
    events: false,
  });

  // Debug log
  console.log("🎂 SmartRecipeDisplay - Full Data:", data);
  console.log("🥕 Recipe:", data?.recipe);
  console.log("🧪 Ingredients:", data?.recipe?.ingredients);

  if (!data || !data.recipe) {
    return (
      <div className="bg-white rounded-2xl border-2 border-avocado-brown-30 p-8 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-avocado-brown-100 mb-2">
          Không có dữ liệu
        </h3>
        <p className="text-avocado-brown-50">Chưa có công thức nào được tạo</p>
      </div>
    );
  }

  const {
    recipe,
    context_analysis,
    trend_insights,
    marketing_strategy,
    next_events,
    viral_potential_score,
    recommendation_reason,
  } = data;

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === "easy")
      return "bg-green-100 text-green-700 border-green-300";
    if (difficulty === "medium")
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    return "bg-red-100 text-red-700 border-red-300";
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.5) return "text-yellow-600";
    return "text-orange-600";
  };

  return (
    <div className="space-y-4">
      {/* Hero Section - Recipe Header */}
      <div className="bg-gradient-to-br from-avocado-green-10 to-white rounded-2xl border-2 border-avocado-green-100 p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="text-6xl">🎂</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-avocado-green-100" />
              <span className="text-sm font-medium text-avocado-green-100 uppercase">
                Smart Generated
              </span>
            </div>
            <h2 className="text-3xl font-bold text-avocado-brown-100 mb-3">
              {recipe.title || recipe.name || "Công thức không có tên"}
            </h2>
            <p className="text-xl text-avocado-brown-70 leading-relaxed">
              {recipe.description || "Không có mô tả"}
            </p>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {recipe.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-avocado-green-100 text-white text-sm rounded-full"
                  >
                    <Hash className="w-3 h-3" />
                    {tag.replace("#", "")}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Viral Score Badge */}
          {viral_potential_score && (
            <div className="text-center bg-white rounded-xl p-4 border-2 border-avocado-green-100 shadow-md">
              <Award className="w-8 h-8 text-avocado-green-100 mx-auto mb-2" />
              <div className="text-3xl font-bold text-avocado-green-100">
                {(viral_potential_score * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-avocado-brown-50 mt-1">
                Viral Score
              </div>
            </div>
          )}
        </div>

        {/* Recommendation Reason */}
        {recommendation_reason && (
          <div className="mt-4 bg-white rounded-xl p-4 border-2 border-avocado-green-30">
            <div className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-avocado-brown-70">
                {recommendation_reason}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border-2 border-avocado-brown-30">
          <div className="flex items-center gap-2 text-avocado-brown-50 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Thời gian</span>
          </div>
          <p className="text-lg font-bold text-avocado-brown-100">
            {recipe.prep_time}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-avocado-brown-30">
          <div className="flex items-center gap-2 text-avocado-brown-50 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Khẩu phần</span>
          </div>
          <p className="text-lg font-bold text-avocado-brown-100">
            {recipe.servings}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-avocado-brown-30">
          <div className="flex items-center gap-2 text-avocado-brown-50 mb-1">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">Độ khó</span>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-bold border-2 ${getDifficultyColor(
              recipe.difficulty
            )}`}
          >
            {recipe.difficulty}
          </span>
        </div>

        <div className="bg-white rounded-xl p-4 border-2 border-avocado-brown-30">
          <div className="flex items-center gap-2 text-avocado-brown-50 mb-1">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Segment</span>
          </div>
          <p className="text-lg font-bold text-avocado-brown-100 capitalize">
            {recipe.user_segment || context_analysis?.target_segment}
          </p>
        </div>
      </div>

      {/* Collapsible Sections */}

      {/* 1. RECIPE DETAILS */}
      <CollapsibleSection
        title="Công Thức Chi Tiết"
        icon={ChefHat}
        isExpanded={expandedSections.recipe}
        onToggle={() => toggleSection("recipe")}
      >
        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <div className="mb-6">
            <h4 className="text-lg font-bold text-avocado-brown-100 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-avocado-green-100" />
              Nguyên Liệu ({recipe.ingredients.length} loại)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recipe.ingredients.map((ing, idx) => {
                // Handle both formats: string or object
                const isString = typeof ing === "string";

                if (isString) {
                  // If it's a string, display as-is (don't try to parse)
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-white rounded-lg p-4 border-2 border-green-500 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 text-xl leading-relaxed">
                          {ing}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Object format - display structured
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-white rounded-lg p-4 border-2 border-green-500 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 text-lg leading-tight mb-2">
                        {ing.name || "Không có tên"}
                      </div>
                      <div className="text-gray-600 font-semibold text-xl">
                        📦 {ing.quantity} {ing.unit}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4">
            <p className="text-red-700 font-medium">
              ⚠️ Không có thông tin nguyên liệu
            </p>
          </div>
        )}

        {/* Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-bold text-avocado-brown-100 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-avocado-green-100" />
              Cách Làm
            </h4>
            <ol className="space-y-3">
              {recipe.instructions.map((step, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 bg-white rounded-lg p-4 border-2 border-avocado-brown-30"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-avocado-green-100 text-white rounded-full flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-avocado-brown-70 leading-relaxed flex-1 whitespace-pre-line">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Decoration Tips */}
        {recipe.decoration_tips && (
          <div className="mb-6 bg-purple-50 rounded-xl p-4 border-2 border-purple-300">
            <h4 className="text-lg font-bold text-avocado-brown-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Gợi Ý Trang Trí
            </h4>
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-avocado-brown-70 leading-relaxed whitespace-pre-line">
                {recipe.decoration_tips}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        {recipe.notes && (
          <div className="mb-6 bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
            <h4 className="text-lg font-bold text-avocado-brown-100 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              Lưu Ý Quan Trọng
            </h4>
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <p className="text-avocado-brown-70 leading-relaxed whitespace-pre-line">
                {recipe.notes}
              </p>
            </div>
          </div>
        )}

        {/* Image Prompt for AI Generation */}
        {recipe.image_prompt && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-300">
            <h4 className="text-lg font-bold text-avocado-brown-100 mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              AI Image Prompt (Professional)
            </h4>
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <p className="text-gray-700 leading-relaxed text-sm font-mono whitespace-pre-line">
                {recipe.image_prompt}
              </p>
            </div>
            <p className="text-xs text-blue-600 mt-2 italic flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Dùng prompt này để generate hình ảnh chuyên nghiệp cho recipe
            </p>
          </div>
        )}
      </CollapsibleSection>

      {/* 2. CONTEXT ANALYSIS */}
      {context_analysis && (
        <CollapsibleSection
          title="Phân Tích Context"
          icon={BarChart3}
          isExpanded={expandedSections.context}
          onToggle={() => toggleSection("context")}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <InfoCard
              label="Ngày"
              value={context_analysis.current_date}
              icon={Calendar}
            />
            <InfoCard
              label="Thứ"
              value={context_analysis.day_of_week}
              icon={Calendar}
            />
            <InfoCard
              label="Mùa"
              value={context_analysis.season}
              icon={Sparkles}
            />
            <InfoCard
              label="Nhiệt độ"
              value={context_analysis.temperature}
              icon={Flame}
            />
            <InfoCard
              label="Sự kiện chính"
              value={context_analysis.main_event}
              icon={Star}
            />
            <InfoCard
              label="Demand Factor"
              value={(context_analysis.demand_factor * 100).toFixed(0) + "%"}
              icon={TrendingUp}
              valueColor={getScoreColor(context_analysis.demand_factor)}
            />
          </div>

          {/* Trending Flavors */}
          {context_analysis.trending_flavors &&
            context_analysis.trending_flavors.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-avocado-brown-100 mb-2">
                  Hương vị đang trending:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {context_analysis.trending_flavors.map((flavor, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-avocado-green-10 text-avocado-green-100 rounded-full text-sm font-medium border border-avocado-green-100"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </CollapsibleSection>
      )}

      {/* 3. TREND INSIGHTS */}
      {trend_insights && (
        <CollapsibleSection
          title="Xu Hướng & Dự Đoán ML"
          icon={TrendingUp}
          isExpanded={expandedSections.trends}
          onToggle={() => toggleSection("trends")}
        >
          {trend_insights.ml_predictions && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <ScoreCard
                label="Popularity"
                value={trend_insights.ml_predictions.popularity_score?.toFixed(
                  1
                )}
                icon={Eye}
                color="text-blue-600"
              />
              <ScoreCard
                label="Engagement"
                value={trend_insights.ml_predictions.engagement_score?.toFixed(
                  1
                )}
                icon={Heart}
                color="text-pink-600"
              />
              <ScoreCard
                label="Trend Score"
                value={trend_insights.ml_predictions.trend_score?.toFixed(1)}
                icon={TrendingUp}
                color="text-purple-600"
              />
              <ScoreCard
                label="Overall Strength"
                value={trend_insights.ml_predictions.overall_trend_strength?.toFixed(
                  1
                )}
                icon={Zap}
                color="text-yellow-600"
              />
            </div>
          )}

          {trend_insights.optimal_timing && (
            <div className="bg-avocado-green-10 rounded-xl p-4 border-2 border-avocado-green-100">
              <h5 className="font-semibold text-avocado-brown-100 mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-avocado-green-100" />
                Thời điểm tối ưu
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-avocado-brown-50">Launch Date</p>
                  <p className="font-bold text-avocado-brown-100">
                    {trend_insights.optimal_timing.launch_date}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-avocado-brown-50">Peak Sales</p>
                  <p className="font-bold text-avocado-brown-100">
                    {trend_insights.optimal_timing.peak_sales_date}
                  </p>
                </div>
              </div>
              <p className="text-sm text-avocado-brown-70 mt-2 italic">
                {trend_insights.optimal_timing.reason}
              </p>
            </div>
          )}

          {/* Trending Keywords */}
          {trend_insights.trending_keywords &&
            trend_insights.trending_keywords.length > 0 && (
              <div className="mt-4">
                <h5 className="text-sm font-semibold text-avocado-brown-100 mb-2">
                  Keywords Trending:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {trend_insights.trending_keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-300"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </CollapsibleSection>
      )}

      {/* 4. MARKETING STRATEGY */}
      {(marketing_strategy || recipe.marketing_caption) && (
        <CollapsibleSection
          title="Chiến Lược Marketing"
          icon={Megaphone}
          isExpanded={expandedSections.marketing}
          onToggle={() => toggleSection("marketing")}
        >
          {/* Marketing Caption - PRIORITY DISPLAY */}
          {recipe.marketing_caption && (
            <div className="mb-4 bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 rounded-xl p-5 border-2 border-pink-400">
              <h5 className="font-bold text-lg text-avocado-brown-100 mb-3 flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-pink-600" />
                Caption Marketing (Copy & Post) 🔥
              </h5>
              <div className="bg-white rounded-lg p-5 border-2 border-pink-300">
                <p className="text-avocado-brown-100 text-base leading-relaxed whitespace-pre-line font-medium">
                  {recipe.marketing_caption}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Ready to Post
                </span>
                <span className="text-pink-600 font-medium">
                  📱 Copy caption này để đăng lên social media
                </span>
              </div>
            </div>
          )}

          {/* Caption Style (fallback) */}
          {!recipe.marketing_caption && marketing_strategy?.caption_style && (
            <div className="mb-4 bg-purple-50 rounded-xl p-4 border-2 border-purple-300">
              <h5 className="font-semibold text-avocado-brown-100 mb-2 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-purple-600" />
                Style Caption Gợi Ý
              </h5>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <p className="text-avocado-brown-70 leading-relaxed">
                  {marketing_strategy.caption_style}
                </p>
              </div>
              <p className="text-sm text-purple-600 mt-2 italic">
                💡 Gợi ý: Sử dụng style này làm template cho caption
              </p>
            </div>
          )}

          {/* Primary Channels */}
          {marketing_strategy?.primary_channel && (
            <div className="mb-4">
              <h5 className="font-semibold text-avocado-brown-100 mb-2 flex items-center gap-2">
                <Instagram className="w-5 h-5 text-avocado-green-100" />
                Kênh Chính
              </h5>
              <div className="flex flex-wrap gap-2">
                {marketing_strategy.primary_channel.map((channel, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-avocado-green-100 text-white rounded-lg text-sm font-medium"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Posting Time */}
          {marketing_strategy?.posting_time && (
            <div className="mb-4 bg-white rounded-xl p-4 border-2 border-avocado-brown-30">
              <h5 className="font-semibold text-avocado-brown-100 mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-avocado-green-100" />
                Thời gian đăng bài
              </h5>
              <p className="text-avocado-brown-70 font-medium">
                {marketing_strategy.posting_time}
              </p>
            </div>
          )}

          {/* Hashtags */}
          {marketing_strategy?.hashtags &&
            marketing_strategy.hashtags.length > 0 && (
              <div className="mb-4">
                <h5 className="font-semibold text-avocado-brown-100 mb-2 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-avocado-green-100" />
                  Hashtags đề xuất
                </h5>
                <div className="flex flex-wrap gap-2">
                  {marketing_strategy.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Pricing Strategy */}
          {marketing_strategy?.pricing_strategy && (
            <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300 mb-4">
              <h5 className="font-semibold text-avocado-brown-100 mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                Chiến lược giá
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-avocado-brown-50">
                    Giá đề xuất:
                  </span>
                  <span className="font-bold text-yellow-700">
                    {marketing_strategy.pricing_strategy.price_range}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-avocado-brown-50">
                    Positioning:
                  </span>
                  <span className="font-medium text-avocado-brown-100">
                    {marketing_strategy.pricing_strategy.positioning}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Promotion Ideas */}
          {marketing_strategy?.promotion_ideas &&
            marketing_strategy.promotion_ideas.length > 0 && (
              <div>
                <h5 className="font-semibold text-avocado-brown-100 mb-2 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-avocado-green-100" />Ý tưởng
                  khuyến mãi
                </h5>
                <ul className="space-y-2">
                  {marketing_strategy.promotion_ideas.map((idea, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 bg-white rounded-lg p-3 border-2 border-avocado-brown-30"
                    >
                      <CheckCircle className="w-5 h-5 text-avocado-green-100 flex-shrink-0 mt-0.5" />
                      <span className="text-avocado-brown-70">{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </CollapsibleSection>
      )}

      {/* 5. NEXT EVENTS */}
      {next_events && next_events.length > 0 && (
        <CollapsibleSection
          title="Sự Kiện Sắp Tới"
          icon={Calendar}
          isExpanded={expandedSections.events}
          onToggle={() => toggleSection("events")}
        >
          <div className="space-y-3">
            {next_events.map((event, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border-2 border-avocado-brown-30"
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-bold text-avocado-brown-100 text-lg">
                    {event.event_name}
                  </h5>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      event.impact_level === "very_high"
                        ? "bg-red-100 text-red-700 border-2 border-red-300"
                        : event.impact_level === "high"
                        ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                        : "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                    }`}
                  >
                    {event.impact_level}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-avocado-brown-50">Ngày sự kiện</p>
                    <p className="font-medium text-avocado-brown-100">
                      {event.event_date}
                    </p>
                  </div>
                  <div>
                    <p className="text-avocado-brown-50">Còn lại</p>
                    <p className="font-bold text-avocado-green-100">
                      {event.days_until} ngày
                    </p>
                  </div>
                  <div>
                    <p className="text-avocado-brown-50">Chuẩn bị trước</p>
                    <p className="font-medium text-avocado-brown-100">
                      {event.preparation_deadline}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
};

// Helper Components

const CollapsibleSection = ({
  title,
  icon: Icon,
  isExpanded,
  onToggle,
  children,
}) => (
  <div className="bg-white rounded-2xl border-2 border-avocado-brown-30 overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-avocado-green-10 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-avocado-green-100" />
        <h3 className="text-lg font-bold text-avocado-brown-100">{title}</h3>
      </div>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-avocado-brown-50" />
      ) : (
        <ChevronDown className="w-5 h-5 text-avocado-brown-50" />
      )}
    </button>
    {isExpanded && (
      <div className="p-6 border-t-2 border-avocado-brown-30">{children}</div>
    )}
  </div>
);

const InfoCard = ({ label, value, icon: Icon, valueColor }) => (
  <div className="bg-avocado-green-10 rounded-lg p-3 border border-avocado-brown-30">
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-avocado-green-100" />
      <span className="text-xs text-avocado-brown-50 font-medium">{label}</span>
    </div>
    <p className={`font-bold text-avocado-brown-100 ${valueColor || ""}`}>
      {value}
    </p>
  </div>
);

const ScoreCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg p-4 border-2 border-avocado-brown-30 text-center">
    <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-avocado-brown-50 mt-1">{label}</div>
  </div>
);

export default SmartRecipeDisplay;
