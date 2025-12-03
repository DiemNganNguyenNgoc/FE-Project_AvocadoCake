import React from "react";
import { BarChart2, Save, Eye } from "lucide-react";

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
            <label className="block text-base font-semibold text-avocado-brown-100 mb-2">
              Số ngày phân tích
            </label>
            <input
              type="number"
              min="7"
              max="90"
              value={analyzePeriod}
              onChange={(e) => setAnalyzePeriod(Number(e.target.value))}
              className="w-full px-4 py-3 text-base rounded-lg border-2 border-avocado-brown-30 text-avocado-brown-100 placeholder-avocado-brown-50 focus:border-avocado-green-100 focus:outline-none focus:ring-2 focus:ring-avocado-green-30 transition-all"
              placeholder="30"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={onAnalyze}
            disabled={isLoading}
            className="bg-avocado-green-100 text-avocado-brown-100 px-6 py-3 rounded-lg font-semibold text-base hover:bg-avocado-green-80 transition-colors focus:outline-none focus:ring-2 focus:ring-avocado-green-30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <BarChart2 className="w-5 h-5" />
            {isLoading ? "Đang phân tích..." : "Phân tích sản phẩm"}
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
      {productsAnalysis.length > 0 && (
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

      {/* Results Table */}
      <div className="bg-white rounded-lg border-2 border-avocado-brown-30 overflow-hidden shadow-sm">
        {productsAnalysis.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-avocado-green-10 border-b-2 border-avocado-brown-30">
                  <th className="px-6 py-4 text-left text-base font-semibold text-avocado-brown-100">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-avocado-brown-100">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-avocado-brown-100">
                    Giá
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-avocado-brown-100">
                    Giảm giá đề xuất
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-avocado-brown-100">
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
            <p className="text-base text-avocado-brown-50">
              Chưa có dữ liệu phân tích.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyzeProductsTab;
