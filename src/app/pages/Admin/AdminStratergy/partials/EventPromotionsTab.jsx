import React from "react";
import { Sparkles, Save, Eye } from "lucide-react";
import PromotionCard from "./PromotionCard";

/**
 * Tab: Event Promotions
 * Design: AvocadoCake theme - Xanh bơ & Nâu bơ
 */
const EventPromotionsTab = ({
  promotions,
  isLoading,
  error,
  daysAhead,
  setDaysAhead,
  onFetch,
  onAddPromotion,
  onSave,
  onViewSaved,
}) => {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg border-2 border-avocado-brown-30 p-6 shadow-sm">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-base font-semibold text-avocado-brown-100 mb-2">
              Số ngày tìm kiếm sự kiện
            </label>
            <input
              type="number"
              min="7"
              max="365"
              value={daysAhead}
              onChange={(e) => setDaysAhead(Number(e.target.value))}
              className="w-full px-4 py-3 text-base rounded-lg border-2 border-avocado-brown-30 text-avocado-brown-100 placeholder-avocado-brown-50 focus:border-avocado-green-100 focus:outline-none focus:ring-2 focus:ring-avocado-green-30 transition-all"
              placeholder="60"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={onFetch}
            disabled={isLoading}
            className="bg-avocado-green-100 text-avocado-brown-100 px-6 py-3 rounded-lg font-semibold text-base hover:bg-avocado-green-80 transition-colors focus:outline-none focus:ring-2 focus:ring-avocado-green-30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {isLoading ? "Đang tải..." : "Lấy khuyến nghị"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg px-4 py-3 text-red-700 text-base font-medium">
          {error}
        </div>
      )}

      {/* Actions */}
      {promotions.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="border-2 border-avocado-green-100 text-avocado-green-100 bg-transparent px-5 py-2 rounded-lg font-medium text-base hover:bg-avocado-green-10 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Lưu kết quả
          </button>
          <button
            onClick={onViewSaved}
            className="border-2 border-avocado-brown-100 text-avocado-brown-100 bg-transparent px-5 py-2 rounded-lg font-medium text-base hover:bg-avocado-brown-10 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Xem đã lưu
          </button>
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {promotions.length > 0 ? (
          promotions.map((promotion, index) => (
            <PromotionCard
              key={index}
              promotion={promotion}
              onAddPromotion={onAddPromotion}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md border-2 border-avocado-brown-30 p-12 text-center">
            <div className="w-20 h-20 bg-avocado-green-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-avocado-green-100" />
            </div>
            <h3 className="text-2xl font-semibold text-avocado-brown-100 mb-3">
              Chưa có khuyến nghị
            </h3>
            <p className="text-base text-avocado-brown-50 max-w-md mx-auto mb-4">
              Nhập số ngày và bấm "Lấy khuyến nghị" để AI phân tích và đề xuất
              các chương trình khuyến mãi phù hợp.
            </p>
            <button
              onClick={onViewSaved}
              className="mt-4 border-2 border-avocado-brown-100 text-avocado-brown-100 bg-transparent px-5 py-2 rounded-lg font-medium text-base hover:bg-avocado-brown-10 transition-colors inline-flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Xem dữ liệu đã lưu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPromotionsTab;
