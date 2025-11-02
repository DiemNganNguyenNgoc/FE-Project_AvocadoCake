import React from "react";
import { Calendar, Package, Sparkles, Plus } from "lucide-react";

/**
 * Component hiển thị từng promotion card
 * Gestalt Principles: Proximity, Similarity, Common Region
 */
const PromotionCard = ({ promotion, onAddPromotion }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return "text-green-600 bg-green-100";
    if (confidence >= 0.5) return "text-yellow-600 bg-yellow-100";
    return "text-orange-600 bg-orange-100";
  };

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 0.7) return "Cao";
    if (confidence >= 0.5) return "Trung bình";
    return "Thấp";
  };

  // Support both products and target_products, map to unified structure
  const productList = (
    promotion.products ||
    promotion.target_products ||
    []
  ).map((product) => {
    const currentPrice = product.currentPrice ?? product.current_price ?? 0;
    const discountPercent =
      product.discountPercent ??
      product.recommended_discount ??
      product.discount_percent ??
      0;
    // Tính giá sau khuyến mãi nếu chưa có
    let discountedPrice = product.discountedPrice ?? product.discounted_price;
    if (discountedPrice == null && currentPrice && discountPercent) {
      discountedPrice = Math.round(currentPrice * (1 - discountPercent / 100));
    }
    return {
      id: product.id || product.product_id,
      name: product.name || product.product_name,
      currentPrice,
      discountPercent,
      discountedPrice,
      expectedRevenue:
        product.expectedRevenue ?? product.expected_revenue ?? null,
      confidence: product.confidence ?? 0,
      aiMethod: product.aiMethod ?? product.ai_optimization_method ?? "",
      reasoning: product.reasoning ?? product.reason ?? "",
    };
  });

  // Map promotion fields for compatibility
  const eventName = promotion.eventName || promotion.promotion_name || "";
  const eventType =
    promotion.eventType ||
    (promotion.event_info && promotion.event_info.event_type) ||
    "";
  const eventDate =
    promotion.eventDate ||
    (promotion.event_info && promotion.event_info.event_date) ||
    "";
  const startDate = promotion.startDate || promotion.start_date || "";
  const endDate = promotion.endDate || promotion.end_date || "";
  const durationDays = promotion.durationDays || promotion.duration_days || "";

  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 animate-fadeIn">
      {/* Header - Event Info */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-blue-100">
                {eventType}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{eventName}</h3>
            <p className="text-blue-100 text-sm">{promotion.description}</p>
          </div>
          <div className="flex-shrink-0 ml-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center">
              <p className="text-xs text-blue-100 font-medium">Ngày diễn ra</p>
              <p className="text-lg font-bold text-white">
                {eventDate ? formatDate(eventDate) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Period */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-xs text-gray-600 font-medium">Bắt đầu</p>
              <p className="text-sm font-bold text-gray-900">
                {startDate ? formatDate(startDate) : "-"}
              </p>
            </div>
            <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Kết thúc</p>
              <p className="text-sm font-bold text-gray-900">
                {endDate ? formatDate(endDate) : "-"}
              </p>
            </div>
          </div>
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
            <p className="text-sm font-bold">{durationDays} ngày</p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Sản phẩm khuyến mãi ({productList.length})
          </h4>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {productList.map((product, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300"
            >
              {/* Product Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h5 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {product.name}
                  </h5>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${getConfidenceColor(
                        product.confidence
                      )}`}
                    >
                      Độ tin cậy: {getConfidenceLabel(product.confidence)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {product.aiMethod}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4 text-right">
                  <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white px-3 py-1 rounded-full inline-block">
                    <p className="text-lg font-bold">
                      -{product.discountPercent ?? 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Info */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="bg-white rounded-xl px-3 py-2 border border-gray-200">
                  <p className="text-xs text-gray-600">Giá gốc</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(product.currentPrice ?? 0)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl px-3 py-2 border border-green-200">
                  <p className="text-xs text-green-700">Giá KM</p>
                  <p className="text-sm font-bold text-green-700">
                    {product.discountedPrice != null
                      ? formatCurrency(product.discountedPrice)
                      : "-"}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl px-3 py-2 border border-blue-200">
                  <p className="text-xs text-blue-700">Doanh thu dự kiến</p>
                  <p className="text-sm font-bold text-blue-700">
                    {product.expectedRevenue != null
                      ? formatCurrency(product.expectedRevenue)
                      : "-"}
                  </p>
                </div>
              </div>

              {/* AI Reasoning */}
              {product.reasoning && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-4 py-3 border border-purple-200">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-purple-900 mb-1">
                        Lý do AI đề xuất:
                      </p>
                      <p className="text-xs text-purple-800 leading-relaxed">
                        {product.reasoning}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200">
        <button
          onClick={() => onAddPromotion(promotion)}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-2xl font-bold text-base hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative z-10 flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" />
            Thêm khuyến mãi này
          </span>
        </button>
      </div>
    </div>
  );
};

export default PromotionCard;
