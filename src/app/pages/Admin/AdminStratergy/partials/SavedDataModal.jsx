import React from "react";
import { X } from "lucide-react";

/**
 * Modal để xem dữ liệu đã lưu
 * Design: AvocadoCake theme
 */
const SavedDataModal = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-avocado-brown-100 bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 border-2 border-avocado-brown-30 overflow-hidden">
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
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <pre className="text-sm text-avocado-brown-100 bg-avocado-green-10 rounded-lg p-4 overflow-x-auto border border-avocado-brown-30">
            {data
              ? typeof data === "object"
                ? JSON.stringify(data, null, 2)
                : String(data)
              : "Không có dữ liệu đã lưu."}
          </pre>
        </div>

        {/* Footer */}
        <div className="bg-avocado-green-10 px-6 py-4 border-t-2 border-avocado-brown-30 flex justify-end">
          <button
            onClick={onClose}
            className="bg-avocado-green-100 text-avocado-brown-100 px-6 py-2 rounded-lg font-medium text-base hover:bg-avocado-green-80 transition-colors focus:outline-none focus:ring-2 focus:ring-avocado-green-30"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedDataModal;
