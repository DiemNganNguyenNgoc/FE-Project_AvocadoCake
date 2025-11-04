import React from "react";
import { Layers, Save, Eye } from "lucide-react";

/**
 * Tab: Discover Combos
 * Design: AvocadoCake theme
 */
const DiscoverCombosTab = ({
  combos,
  isLoading,
  error,
  comboParams,
  setComboParams,
  onDiscover,
  onSave,
  onViewSaved,
}) => {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg border-2 border-avocado-brown-30 p-6 shadow-sm">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-base font-semibold text-avocado-brown-100 mb-2">
              Min Support
            </label>
            <input
              type="number"
              min="0.01"
              max="0.5"
              step="0.01"
              value={comboParams.minSupport}
              onChange={(e) =>
                setComboParams((prev) => ({
                  ...prev,
                  minSupport: Number(e.target.value),
                }))
              }
              className="w-full px-4 py-3 text-base rounded-lg border-2 border-avocado-brown-30 text-avocado-brown-100 focus:border-avocado-green-100 focus:outline-none focus:ring-2 focus:ring-avocado-green-30 transition-all"
              disabled={isLoading}
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-base font-semibold text-avocado-brown-100 mb-2">
              Min Confidence
            </label>
            <input
              type="number"
              min="0.1"
              max="0.9"
              step="0.01"
              value={comboParams.minConfidence}
              onChange={(e) =>
                setComboParams((prev) => ({
                  ...prev,
                  minConfidence: Number(e.target.value),
                }))
              }
              className="w-full px-4 py-3 text-base rounded-lg border-2 border-avocado-brown-30 text-avocado-brown-100 focus:border-avocado-green-100 focus:outline-none focus:ring-2 focus:ring-avocado-green-30 transition-all"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={onDiscover}
            disabled={isLoading}
            className="bg-avocado-green-100 text-avocado-brown-100 px-6 py-3 rounded-lg font-semibold text-base hover:bg-avocado-green-80 transition-colors focus:outline-none focus:ring-2 focus:ring-avocado-green-30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Layers className="w-5 h-5" />
            {isLoading ? "Đang tìm..." : "Phát hiện combo"}
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
      {combos.length > 0 && (
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
        {combos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-avocado-green-10 border-b-2 border-avocado-brown-30">
                  <th className="px-6 py-4 text-left text-base font-semibold text-avocado-brown-100">
                    Combo
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-avocado-brown-100">
                    Tần suất
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-avocado-brown-100">
                    Confidence
                  </th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-avocado-brown-100">
                    Bundle Discount
                  </th>
                </tr>
              </thead>
              <tbody>
                {combos.map((c, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-avocado-brown-30 hover:bg-avocado-green-10 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-avocado-brown-100">
                      {c.combo_name ||
                        (c.product_1_name && c.product_2_name
                          ? `${c.product_1_name} + ${c.product_2_name}`
                          : c.product_1 && c.product_2
                          ? `${c.product_1} + ${c.product_2}`
                          : c.product_1_id && c.product_2_id
                          ? `${c.product_1_id} + ${c.product_2_id}`
                          : "N/A")}
                    </td>
                    <td className="px-6 py-4 text-avocado-brown-50">
                      {c.frequency_together}
                    </td>
                    <td className="px-6 py-4 text-avocado-brown-50">
                      {c.confidence}
                    </td>
                    <td className="px-6 py-4 text-avocado-green-100 font-semibold">
                      {c.recommended_bundle_discount != null
                        ? `${c.recommended_bundle_discount}%`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Layers className="w-12 h-12 text-avocado-green-100 mx-auto mb-3" />
            <p className="text-base text-avocado-brown-50">
              Chưa có dữ liệu combo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverCombosTab;
