import React from "react";
import { Layers, Save, Eye } from "lucide-react";
import Button from "../../../../components/AdminLayout/Button";
import Input from "../../../../components/AdminLayout/Input";

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
            <Input
              type="number"
              min="0.01"
              max="0.5"
              step="0.01"
              label="Min Support"
              value={comboParams.minSupport}
              onChange={(e) =>
                setComboParams((prev) => ({
                  ...prev,
                  minSupport: Number(e.target.value),
                }))
              }
              disabled={isLoading}
              className="border-2 border-avocado-brown-30 focus:border-avocado-green-100 focus:ring-avocado-green-30"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <Input
              type="number"
              min="0.1"
              max="0.9"
              step="0.01"
              label="Min Confidence"
              value={comboParams.minConfidence}
              onChange={(e) =>
                setComboParams((prev) => ({
                  ...prev,
                  minConfidence: Number(e.target.value),
                }))
              }
              disabled={isLoading}
              className="border-2 border-avocado-brown-30 focus:border-avocado-green-100 focus:ring-avocado-green-30"
            />
          </div>
          <Button
            onClick={onDiscover}
            disabled={isLoading}
            loading={isLoading}
            icon={<Layers />}
            bgColor="avocado-green-100"
            textColor="avocado-brown-100"
            hoverBgColor="avocado-green-80"
            size="md"
          >
            {isLoading ? "Đang tìm..." : "Phát hiện combo"}
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
      {combos.length > 0 && (
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
        {combos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-avocado-green-10 border-b-2 border-avocado-brown-30">
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Combo
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Tần suất
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Confidence
                  </th>
                  <th className="px-6 py-4 text-left text-xl font-semibold text-avocado-brown-100">
                    Giảm giá nhóm
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
            <p className="text-xl text-avocado-brown-50">
              Chưa có dữ liệu combo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverCombosTab;
