import React, { useState, useEffect } from "react";
import { getDetailsDiscount } from "../services/DiscountService";

const ViewDiscount = ({ discountId, onClose, onEdit }) => {
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDiscountDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const accessToken = localStorage.getItem("access_token");
        const response = await getDetailsDiscount(discountId, accessToken);

        if (response && response.data) {
          setDiscount(response.data);
        } else {
          setError("Không thể tải thông tin khuyến mãi");
        }
      } catch (err) {
        setError("Lỗi khi tải thông tin khuyến mãi");
        console.error("Error fetching discount details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (discountId) {
      fetchDiscountDetails();
    }
  }, [discountId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Không có";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const handleEdit = () => {
    onEdit?.(discount);
  };

  if (!discountId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Chi tiết khuyến mãi
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <svg
                  className="animate-spin h-5 w-5 text-brand-500"
                  xmlns="http://www.w3.org/2000/svg"
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
                <span className="text-gray-600">Đang tải...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
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
                {error}
              </div>
            </div>
          )}

          {discount && !loading && (
            <div className="space-y-6">
              {/* Banner Image */}
              {discount.discountImage && (
                <div className="text-center">
                  <img
                    src={discount.discountImage}
                    alt={discount.discountName}
                    className="w-full h-full object-cover rounded-xl mx-auto border border-gray-200"
                  />
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã khuyến mãi
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                    <span className="text-sm font-medium text-gray-900">
                      {discount.discountCode}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá trị khuyến mãi
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {discount.discountValue}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên khuyến mãi
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                  <span className="text-sm text-gray-900">
                    {discount.discountName}
                  </span>
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày bắt đầu
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                    <span className="text-sm text-gray-900">
                      {formatDate(discount.discountStartDate)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày kết thúc
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                    <span className="text-sm text-gray-900">
                      {formatDate(discount.discountEndDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sản phẩm áp dụng
                </label>
                <div className="bg-gray-50 rounded-lg border p-4">
                  {discount.discountProduct &&
                  discount.discountProduct.length > 0 ? (
                    <div className="space-y-2">
                      {discount.discountProduct.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 bg-white rounded-lg border"
                        >
                          <div className="flex-1">
                            <span className="text-sm text-gray-900">
                              {product.productName || product}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Không có sản phẩm nào được áp dụng
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {discount && !loading && (
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleEdit}
              className="flex-1 bg-brand-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
            >
              Chỉnh sửa khuyến mãi
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDiscount;
