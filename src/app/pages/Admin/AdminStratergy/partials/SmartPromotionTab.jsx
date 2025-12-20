import React from "react";
import { Zap, Save, Eye } from "lucide-react";
import PromotionCard from "./PromotionCard";
import Button from "../../../../components/AdminLayout/Button";
import Select from "../../../../components/AdminLayout/Select";

/**
 * Tab: Smart Promotion
 * Design: AvocadoCake theme
 */
const SmartPromotionTab = ({
  smartPromotion,
  isLoading,
  error,
  smartFocus,
  setSmartFocus,
  onGenerate,
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
            <Select
              label="Chiến lược"
              value={smartFocus}
              onChange={(e) => setSmartFocus(e.target.value)}
              disabled={isLoading}
              className="border-2 border-avocado-brown-30 focus:border-avocado-green-100 focus:ring-avocado-green-30"
              options={[
                { value: "revenue", label: "Tối ưu doanh thu" },
                { value: "clearance", label: "Xả hàng tồn" },
                { value: "balanced", label: "Cân bằng" },
              ]}
            />
          </div>
          <Button
            onClick={onGenerate}
            disabled={isLoading}
            loading={isLoading}
            icon={<Zap />}
            // bgColor="avocado-green-100"
            // textColor="avocado-brown-100"
            // hoverBgColor="avocado-green-80"
            // size="md"
            variant="primary"
          >
            {isLoading ? "Đang tạo..." : "Tạo khuyến mãi"}
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
      {smartPromotion && (
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
        {smartPromotion ? (
          <PromotionCard
            promotion={smartPromotion}
            onAddPromotion={onAddPromotion}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-md border-2 border-avocado-brown-30 p-12 text-center">
            <div className="w-20 h-20 bg-avocado-green-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-avocado-green-100" />
            </div>
            <h3 className="text-2xl font-semibold text-avocado-brown-100 mb-3">
              Chưa có khuyến mãi thông minh
            </h3>
            <p className="text-base text-avocado-brown-50 max-w-md mx-auto">
              Chọn chiến lược và bấm "Tạo khuyến mãi" để AI đề xuất.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartPromotionTab;
