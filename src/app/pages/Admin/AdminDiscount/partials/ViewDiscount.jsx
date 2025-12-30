import React, { useState, useEffect } from "react";
import { getDetailsDiscount } from "../services/DiscountService";
import { Modal, Button } from "../../../../components/AdminLayout";

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
    <Modal
      isOpen={!!discountId}
      onClose={onClose}
      title="Chi tiết khuyến mãi"
      subtitle="Xem thông tin đầy đủ về chương trình khuyến mãi"
      size="xl"
      icon={
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      }
      iconColor="purple"
      actions={
        discount && !loading ? (
          <div className="flex gap-3 w-full">
            <Button onClick={handleEdit} className="flex-1">
              Chỉnh sửa khuyến mãi
            </Button>
            <Button onClick={onClose} variant="outline">
              Đóng
            </Button>
          </div>
        ) : null
      }
    >
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
          <div className="p-4 mb-4 text-lg text-red-700 bg-red-50 border border-red-200 rounded-xl">
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
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Mã khuyến mãi
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                  <span className="text-lg font-medium text-gray-900">
                    {discount.discountCode}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Giá trị khuyến mãi
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-green-100 text-green-800">
                    {discount.discountValue}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Tên khuyến mãi
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                <span className="text-lg text-gray-900">
                  {discount.discountName}
                </span>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Ngày bắt đầu
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                  <span className="text-lg text-gray-900">
                    {formatDate(discount.discountStartDate)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Ngày kết thúc
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                  <span className="text-lg text-gray-900">
                    {formatDate(discount.discountEndDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
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
                          <span className="text-lg text-gray-900">
                            {product.productName || product}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg text-gray-500 text-center py-4">
                    Không có sản phẩm nào được áp dụng
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewDiscount;
