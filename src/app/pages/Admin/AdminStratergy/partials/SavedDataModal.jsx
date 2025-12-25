import React from "react";
import { X } from "lucide-react";
import PromotionCard from "./PromotionCard";

/**
 * Modal để xem dữ liệu đã lưu
 * Design: AvocadoCake theme - Hiển thị data theo format đẹp
 */
const SavedDataModal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;

  // Render content based on data type
  const renderContent = () => {
    if (!data) {
      return (
        <div className="text-center py-12">
          <p className="text-xl text-avocado-brown-50">
            Không có dữ liệu đã lưu.
          </p>
        </div>
      );
    }

    // Event Promotions - render as cards
    if (Array.isArray(data) && data.length > 0 && data[0].eventName) {
      return (
        <div className="space-y-4">
          {data.map((promotion, idx) => (
            <PromotionCard
              key={idx}
              promotion={promotion}
              onAddPromotion={() => {}}
            />
          ))}
        </div>
      );
    }

    // Analyze Products - render as table
    if (Array.isArray(data) && data.length > 0 && data[0].product_name) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-avocado-green-10 border-b-2 border-avocado-brown-30">
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Giá
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Giảm giá đề xuất
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Lý do
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((p, idx) => (
                <tr
                  key={idx}
                  className="border-b border-avocado-brown-30 hover:bg-avocado-green-10"
                >
                  <td className="px-4 py-3 font-medium text-avocado-brown-100">
                    {p.product_name || p.name}
                  </td>
                  <td className="px-4 py-3 text-avocado-brown-50">
                    {p.status}
                  </td>
                  <td className="px-4 py-3 text-avocado-brown-50">
                    {p.price || p.current_price}
                  </td>
                  <td className="px-4 py-3 text-avocado-green-100 font-semibold">
                    {p.recommended_discount || p.discount_percent}%
                  </td>
                  <td className="px-4 py-3 text-avocado-brown-50 text-sm">
                    {p.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Combos - render as table
    if (Array.isArray(data) && data.length > 0 && data[0].product_1_name) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-avocado-green-10 border-b-2 border-avocado-brown-30">
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Combo
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Tần suất
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Bundle Discount
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((c, idx) => (
                <tr
                  key={idx}
                  className="border-b border-avocado-brown-30 hover:bg-avocado-green-10"
                >
                  <td className="px-4 py-3 font-medium text-avocado-brown-100">
                    {c.combo_name ||
                      (c.product_1_name && c.product_2_name
                        ? `${c.product_1_name} + ${c.product_2_name}`
                        : "N/A")}
                  </td>
                  <td className="px-4 py-3 text-avocado-brown-50">
                    {c.frequency_together}
                  </td>
                  <td className="px-4 py-3 text-avocado-brown-50">
                    {c.confidence}
                  </td>
                  <td className="px-4 py-3 text-avocado-green-100 font-semibold">
                    {c.recommended_bundle_discount != null
                      ? `${c.recommended_bundle_discount}%`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Upcoming Events - render as table
    if (Array.isArray(data) && data.length > 0 && data[0].event_type) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-avocado-green-10 border-b-2 border-avocado-brown-30">
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Sự kiện
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Ngày diễn ra
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Còn lại
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-avocado-brown-100">
                  Discount Range
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((e, idx) => (
                <tr
                  key={idx}
                  className="border-b border-avocado-brown-30 hover:bg-avocado-green-10"
                >
                  <td className="px-4 py-3 font-medium text-avocado-brown-100">
                    {e.event_type}
                  </td>
                  <td className="px-4 py-3 text-avocado-brown-50">
                    {e.event_date}
                  </td>
                  <td className="px-4 py-3 text-avocado-brown-50">
                    {e.days_until_event} ngày
                  </td>
                  <td className="px-4 py-3 text-avocado-green-100 font-semibold">
                    {e.recommended_discount_range}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Smart Promotion - single object
    if (data.eventName || data.promotion_name) {
      return (
        <div>
          <PromotionCard promotion={data} onAddPromotion={() => {}} />
        </div>
      );
    }

    // Health Status - render as key-value pairs
    if (data.status || data.version) {
      const renderValue = (value) => {
        // Nếu là array, render list với bullet points
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

        // Nếu là object, render từng key-value bên trong
        if (typeof value === "object" && value !== null) {
          return (
            <div className="space-y-1 mt-2">
              {Object.entries(value).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 text-sm">
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
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div
              key={key}
              className="bg-avocado-green-10 rounded-lg px-4 py-3 border border-avocado-brown-30"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-avocado-brown-100 capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <div className="ml-2">{renderValue(value)}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Fallback: Generic array or object
    if (Array.isArray(data)) {
      return (
        <div className="space-y-2">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="bg-avocado-green-10 rounded-lg px-4 py-3 border border-avocado-brown-30"
            >
              <p className="text-sm text-avocado-brown-100">
                {typeof item === "object"
                  ? JSON.stringify(item, null, 2)
                  : String(item)}
              </p>
            </div>
          ))}
        </div>
      );
    }

    // Last fallback: show formatted JSON
    return (
      <div className="bg-avocado-green-10 rounded-lg p-4 border border-avocado-brown-30">
        <pre className="text-sm text-avocado-brown-100 whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-avocado-brown-100 bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 border-2 border-avocado-brown-30 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-avocado-green-10 px-6 py-4 border-b-2 border-avocado-brown-30 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-avocado-brown-100">
            {title} - Dữ liệu đã lưu
          </h2>
          <button
            onClick={onClose}
            className="text-avocado-brown-50 hover:text-avocado-brown-100 transition-colors focus:outline-none focus:ring-2 focus:ring-avocado-green-30 rounded-lg p-1"
            title="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">{renderContent()}</div>

        {/* Footer */}
        <div className="bg-avocado-green-10 px-6 py-4 border-t-2 border-avocado-brown-30 flex justify-end">
          <button
            onClick={onClose}
            className="bg-avocado-green-100 text-avocado-brown-100 px-6 py-2 rounded-lg font-medium text-xl hover:bg-avocado-green-80 transition-colors focus:outline-none focus:ring-2 focus:ring-avocado-green-30"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedDataModal;
