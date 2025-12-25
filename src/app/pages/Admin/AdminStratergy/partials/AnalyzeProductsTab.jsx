import React from "react";
import { BarChart2, Save, Eye } from "lucide-react";
import Button from "../../../../components/AdminLayout/Button";
import Input from "../../../../components/AdminLayout/Input";

/**
 * Tab: Analyze Products
 * Design: AvocadoCake theme
 */
const AnalyzeProductsTab = ({
  productsAnalysis,
  isLoading,
  error,
  analyzePeriod,
  setAnalyzePeriod,
  onAnalyze,
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
              max="90"
              label="Số ngày phân tích"
              value={analyzePeriod}
              onChange={(e) => setAnalyzePeriod(Number(e.target.value))}
              placeholder="30"
              disabled={isLoading}
              className="border-2 border-avocado-brown-30 focus:border-avocado-green-100 focus:ring-avocado-green-30"
            />
          </div>
          <Button
            onClick={onAnalyze}
            disabled={isLoading}
            loading={isLoading}
            icon={<BarChart2 />}
            variant="primary"
          >
            {isLoading ? "Đang phân tích..." : "Phân tích sản phẩm"}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg px-4 py-3 text-red-700 text-xl font-medium">
          {error}
        </div>
      )}

      {/* Actions */}
      {productsAnalysis.length > 0 && (
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

      {/* Results Table */}
      <div className="bg-white rounded-lg border-2 border-avocado-brown-30 overflow-hidden shadow-sm">
        {productsAnalysis.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-avocado-green-10 border-b-2 border-avocado-brown-30">
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Giảm giá đề xuất
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Lý do
                  </th>
                </tr>
              </thead>
              <tbody>
                {productsAnalysis.map((p, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-avocado-brown-30 hover:bg-avocado-green-10 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-avocado-brown-100">
                      {p.product_name || p.name}
                    </td>
                    <td className="px-6 py-4 text-avocado-brown-50">
                      {p.status}
                    </td>
                    <td className="px-6 py-4 text-avocado-brown-50">
                      {p.price || p.current_price}
                    </td>
                    <td className="px-6 py-4 text-avocado-green-100 font-semibold">
                      {p.recommended_discount || p.discount_percent}%
                    </td>
                    <td className="px-6 py-4 text-avocado-brown-50 text-sm">
                      {p.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <BarChart2 className="w-12 h-12 text-avocado-green-100 mx-auto mb-3" />
            <p className="text-xl text-avocado-brown-50">
              Chưa có dữ liệu phân tích.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeProductsTab;
