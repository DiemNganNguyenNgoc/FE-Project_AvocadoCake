import React from "react";
import { Sparkles, Save, Eye } from "lucide-react";
import PromotionCard from "./PromotionCard";
import Button from "../../../../components/AdminLayout/Button";
import Input from "../../../../components/AdminLayout/Input";

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
            <Input
              type="number"
              min="7"
              max="365"
              label="Số ngày tìm kiếm sự kiện"
              value={daysAhead}
              onChange={(e) => setDaysAhead(Number(e.target.value))}
              placeholder="60"
              disabled={isLoading}
              className="border-2 border-avocado-brown-30 focus:border-avocado-green-100 focus:ring-avocado-green-30"
            />
          </div>
          <Button
            onClick={onFetch}
            disabled={isLoading}
            loading={isLoading}
            icon={<Sparkles />}
            // bgColor="avocado-green-100"
            // textColor="avocado-brown-100"
            // hoverBgColor="avocado-green-80"
            // size="md"
            variant="primary"
          >
            {isLoading ? "Đang tải..." : "Lấy khuyến nghị"}
          </Button>
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
          <Button
            onClick={onSave}
            variant="outline"
            icon={<Save />}
            size="md"
            // className="border-2 border-avocado-green-100 text-avocado-green-100 hover:bg-avocado-green-10"
          >
            Lưu kết quả
          </Button>
          <Button
            onClick={onViewSaved}
            variant="outline"
            icon={<Eye />}
            size="md"
            // className="border-2 border-avocado-brown-100 text-avocado-brown-100 hover:bg-avocado-brown-10"
          >
            Xem đã lưu
          </Button>
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
            <Button
              onClick={onViewSaved}
              variant="outline"
              icon={<Eye />}
              size="md"
              // className="mt-4 border-2 border-avocado-brown-100 text-avocado-brown-100 hover:bg-avocado-brown-10"
            >
              Xem dữ liệu đã lưu
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPromotionsTab;
