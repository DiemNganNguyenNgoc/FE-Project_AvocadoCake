import React from "react";
import { Calendar, Package, Sparkles, Plus } from "lucide-react";

/**
 * Component hiển thị từng promotion card
 * Design: AvocadoCake - Đơn giản, sang trọng, thanh lịch
 * Gestalt Principles: Proximity, Similarity, Common Region, Figure/Ground
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
    <div className="bg-white rounded-lg border border-avocado-brown-30 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Header - Event Info - Đơn giản với avocado colors */}
      <div className="bg-avocado-green-10 border-b border-avocado-brown-30 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-avocado-green-100" />
              <span className="text-sm font-medium text-avocado-brown-50">
                {eventType}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-avocado-brown-100 mb-2">
              {eventName}
            </h3>
            <p className="text-base text-avocado-brown-50 leading-relaxed">
              {promotion.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white rounded-lg border border-avocado-brown-30 px-4 py-3 text-center shadow-sm">
              <p className="text-xs text-avocado-brown-50 font-medium mb-1">
                Ngày diễn ra
              </p>
              <p className="text-base font-bold text-avocado-brown-100">
                {eventDate ? formatDate(eventDate) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Period - Clean design */}
      <div className="px-6 py-4 bg-grey9 border-b border-avocado-brown-30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm text-avocado-brown-50 font-medium mb-1">
                Bắt đầu
              </p>
              <p className="text-base font-bold text-avocado-brown-100">
                {startDate ? formatDate(startDate) : "-"}
              </p>
            </div>
            <div className="w-16 h-0.5 bg-avocado-green-100"></div>
            <div>
              <p className="text-sm text-avocado-brown-50 font-medium mb-1">
                Kết thúc
              </p>
              <p className="text-base font-bold text-avocado-brown-100">
                {endDate ? formatDate(endDate) : "-"}
              </p>
            </div>
          </div>
          <div className="bg-avocado-green-10 text-avocado-green-100 px-4 py-2 rounded-lg border border-avocado-green-30">
            <p className="text-sm font-bold">{durationDays} ngày</p>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2 mb-5">
          <Package className="w-5 h-5 text-avocado-green-100" />
          <h4 className="text-lg font-bold text-avocado-brown-100">
            Sản phẩm khuyến mãi ({productList.length})
          </h4>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {productList.map((product, index) => (
            <div
              key={index}
              className="group bg-white border border-avocado-brown-30 rounded-lg p-5 hover:border-avocado-green-100 hover:shadow-sm transition-all duration-200"
            >
              {/* Product Header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h5 className="text-base font-bold text-avocado-brown-100 mb-2">
                    {product.name}
                  </h5>
                  <div className="flex items-center flex-wrap gap-2">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-lg ${getConfidenceColor(
                        product.confidence
                      )}`}
                    >
                      {getConfidenceLabel(product.confidence)}
                    </span>
                    {product.aiMethod && (
                      <span className="text-xs text-avocado-brown-50 bg-grey9 px-3 py-1 rounded-lg">
                        {product.aiMethod}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-avocado-green-100 text-white px-4 py-2 rounded-lg shadow-sm">
                    <p className="text-lg font-bold">
                      -{product.discountPercent ?? 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Info - Simple & Clean */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="bg-grey9 rounded-lg px-4 py-3 border border-avocado-brown-30">
                  <p className="text-xs text-avocado-brown-50 mb-1">Giá gốc</p>
                  <p className="text-base font-bold text-avocado-brown-100">
                    {formatCurrency(product.currentPrice ?? 0)}
                  </p>
                </div>
                <div className="bg-avocado-green-10 rounded-lg px-4 py-3 border border-avocado-green-30">
                  <p className="text-xs text-avocado-green-100 mb-1">Giá KM</p>
                  <p className="text-base font-bold text-avocado-green-100">
                    {product.discountedPrice != null
                      ? formatCurrency(product.discountedPrice)
                      : "-"}
                  </p>
                </div>
                <div className="bg-grey9 rounded-lg px-4 py-3 border border-avocado-brown-30">
                  <p className="text-xs text-avocado-brown-50 mb-1">
                    Doanh thu dự kiến
                  </p>
                  <p className="text-base font-bold text-avocado-brown-100">
                    {product.expectedRevenue != null
                      ? formatCurrency(product.expectedRevenue)
                      : "-"}
                  </p>
                </div>
              </div>

              {/* AI Reasoning - Elegant design */}
              {product.reasoning && (
                <div className="bg-avocado-green-10 rounded-lg px-4 py-3 border border-avocado-green-30">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-avocado-green-100 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs font-semibold text-avocado-brown-100 mb-1">
                        Lý do AI đề xuất:
                      </p>
                      <p className="text-sm text-avocado-brown-50 leading-relaxed">
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

      {/* Action Button - Elegant & Simple */}
      <div className="px-6 py-5 bg-grey9 border-t border-avocado-brown-30">
        <button
          onClick={() => onAddPromotion(promotion)}
          className="w-full bg-avocado-green-100 text-white py-4 px-6 rounded-lg font-semibold text-base hover:bg-avocado-green-80 focus:outline-none focus:ring-2 focus:ring-avocado-green-30 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm khuyến mãi này
        </button>
      </div>
    </div>
  );
};

export default PromotionCard;
