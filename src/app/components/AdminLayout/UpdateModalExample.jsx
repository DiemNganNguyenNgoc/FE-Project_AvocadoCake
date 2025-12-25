import React, { useState } from "react";
import UpdateModal from "./UpdateModal";

/**
 * UpdateModal Component - Reusable Update/Edit Modal
 *
 * Based on UpdateCategory.jsx design with emerald/green color scheme
 * Perfect for update/edit forms across the application
 *
 * Props:
 * - isOpen: boolean - Controls modal visibility
 * - onClose: function - Called when modal should close
 * - title: string - Main title in header
 * - subtitle: string (optional) - Subtitle below title
 * - children: ReactNode - Form content to display
 * - size: string (optional) - Modal size: 'sm', 'md' (default), 'lg', 'xl', '2xl', 'full'
 * - icon: ReactNode (optional) - Custom icon for header (default: edit icon)
 * - iconColor: string (optional) - Icon gradient color: 'emerald' (default), 'green', 'teal', 'cyan', 'lime', 'blue'
 * - actions: ReactNode (optional) - Action buttons in footer (Cancel, Save, etc.)
 * - showCloseButton: boolean (optional) - Show X button in header (default: true)
 * - closeOnBackdrop: boolean (optional) - Close when clicking outside (default: true)
 * - closeOnEscape: boolean (optional) - Close when pressing Escape (default: true)
 * - className: string (optional) - Additional CSS classes
 */

const UpdateModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state example
  const [formData, setFormData] = useState({
    name: "Bánh Kem Dâu",
    code: "C001",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Updated:", formData);
      setLoading(false);
      setIsOpen(false);
    }, 1500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Custom icon example
  const customIcon = (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  // Action buttons for modal footer
  const modalActions = (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="px-8 py-3 text-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
        disabled={loading}
      >
        Hủy
      </button>
      <button
        type="submit"
        form="update-form"
        disabled={loading}
        className="px-8 py-3 text-xl font-semibold bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Đang cập nhật...
          </div>
        ) : (
          "Cập Nhật"
        )}
      </button>
    </>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">UpdateModal Example</h1>
      <p className="text-gray-600 mb-8">
        Reusable modal component for update/edit operations with emerald/green
        theme
      </p>

      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 shadow-lg"
      >
        Open Update Modal
      </button>

      <UpdateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Cập Nhật Danh Mục"
        subtitle="Chỉnh sửa thông tin danh mục"
        size="md"
        icon={customIcon}
        iconColor="emerald"
        actions={modalActions}
      >
        <form id="update-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Name Field */}
          <div className="group">
            <label className="block text-xl font-semibold text-gray-800 mb-3">
              Tên Danh Mục <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-5 py-4 text-xl border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                  errors.name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50 focus:bg-white"
                }`}
                placeholder="VD: Bánh sinh nhật, Bánh mùa đông..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.name}
              </p>
            )}
          </div>

          {/* Code Field */}
          <div className="group">
            <label className="block text-xl font-semibold text-gray-800 mb-3">
              Mã Danh Mục <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className={`w-full px-5 py-4 text-xl border-2 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-200 ${
                  errors.code
                    ? "border-red-300 bg-red-50"
                    : "border-gray-200 bg-gray-50 focus:bg-white"
                }`}
                placeholder="VD: C1, C2, C3..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Status Field */}
          <div className="group">
            <label className="block text-xl font-semibold text-gray-800 mb-3">
              Trạng Thái <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-5 py-4 text-xl border-2 border-gray-200 bg-gray-50 rounded-2xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 focus:bg-white transition-all duration-200 appearance-none"
              >
                <option value="Active">🟢 Hoạt động</option>
                <option value="Inactive">⚪ Không hoạt động</option>
                <option value="Cancel">🔴 Đã hủy</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </form>
      </UpdateModal>
    </div>
  );
};

export default UpdateModalExample;
