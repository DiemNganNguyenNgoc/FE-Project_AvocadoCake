import React from "react";
import { HeartPulse, Save, Eye } from "lucide-react";
import Button from "../../../../components/AdminLayout/Button";

/**
 * Tab: Health Check
 * Design: AvocadoCake theme
 */
const HealthCheckTab = ({
  healthStatus,
  isLoading,
  error,
  onCheck,
  onSave,
  onViewSaved,
}) => {
  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg border-2 border-avocado-brown-30 p-6 shadow-sm">
        <Button
          onClick={onCheck}
          disabled={isLoading}
          className="bg-avocado-green-100 text-avocado-brown-100 px-6 py-3 font-semibold text-xl hover:bg-avocado-green-80 transition-colors focus:outline-none focus:ring-2 focus:ring-avocado-green-30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <HeartPulse className="w-5 h-5" />
          {isLoading ? "Đang kiểm tra..." : "Kiểm tra hệ thống"}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg px-4 py-3 text-red-700 text-xl font-medium">
          {error}
        </div>
      )}

      {/* Actions */}
      {healthStatus && (
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="border-2 border-avocado-green-100 text-avocado-green-100 bg-transparent px-5 py-2 rounded-lg font-medium text-xl hover:bg-avocado-green-10 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Lưu kết quả
          </button>
          <button
            onClick={onViewSaved}
            className="border-2 border-avocado-brown-100 text-avocado-brown-100 bg-transparent px-5 py-2 rounded-lg font-medium text-xl hover:bg-avocado-brown-10 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Xem đã lưu
          </button>
        </div>
      )}

      {/* Results */}
      <div className="bg-white rounded-lg border-2 border-avocado-brown-30 p-6 shadow-sm">
        {healthStatus ? (
          <div>
            <h3 className="text-xl font-semibold text-avocado-brown-100 mb-4">
              Trạng thái hệ thống
            </h3>
            <div className="space-y-3">
              {Object.entries(healthStatus).map(([key, value]) => {
                // Render value based on type
                const renderValue = () => {
                  // Array - render as bullet list
                  if (Array.isArray(value)) {
                    return (
                      <ul className="space-y-1 mt-2 list-none">
                        {value.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-avocado-brown-100"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-avocado-green-100"></span>
                            {String(item)}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  // Nested object
                  if (typeof value === "object" && value !== null) {
                    return (
                      <div className="space-y-1 mt-2">
                        {Object.entries(value).map(([k, v]) => (
                          <div
                            key={k}
                            className="flex items-center gap-2 text-sm"
                          >
                            <span className="text-avocado-brown-50 capitalize">
                              {k.replace(/_/g, " ")}:
                            </span>
                            <span className="text-avocado-brown-100 font-medium">
                              {String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  // Primitive value
                  return (
                    <span className="text-sm text-avocado-brown-100 font-medium">
                      {String(value)}
                    </span>
                  );
                };

                return (
                  <div
                    key={key}
                    className="bg-avocado-green-10 rounded-lg px-4 py-3 border border-avocado-brown-30"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-avocado-brown-100 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <div className="ml-2">{renderValue()}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <HeartPulse className="w-12 h-12 text-avocado-green-100 mx-auto mb-3" />
            <p className="text-xl text-avocado-brown-50">
              Chưa kiểm tra trạng thái hệ thống.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheckTab;
