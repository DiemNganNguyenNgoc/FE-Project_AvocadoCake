import React, { useState } from "react";
import { useAdminDiscount } from "../adminDiscountStore";
import ViewDiscount from "./ViewDiscount";

const DiscountTable = ({ onEdit }) => {
  const { discounts, isLoading, error, removeDiscountById, refreshDiscounts } =
    useAdminDiscount();
  const [viewDiscountId, setViewDiscountId] = useState(null);
  const [editDiscountId, setEditDiscountId] = useState(null);

  const handleView = (discountId) => {
    setViewDiscountId(discountId);
  };

  const handleCloseView = () => {
    setViewDiscountId(null);
  };

  const handleEditModal = (discountId) => {
    setEditDiscountId(discountId);
  };

  const handleCloseEdit = () => {
    setEditDiscountId(null);
  };

  const handleEdit = (discount) => {
    onEdit?.(discount);
  };

  const handleDelete = async (discountId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
      try {
        await removeDiscountById(discountId);
      } catch (e) {
        alert(e?.message || "Xóa khuyến mãi thất bại");
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!date) return "Không có";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              Danh sách khuyến mãi
            </h2>
            <p className="text-sm text-gray-600">
              Quản lý tất cả khuyến mãi trong hệ thống
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refreshDiscounts}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Làm mới
            </button>
          </div>
        </div>

        {isLoading && (
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
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    STT
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Mã khuyến mãi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Tên khuyến mãi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Giá trị
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Sản phẩm áp dụng
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Ngày bắt đầu
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Ngày kết thúc
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {discounts?.length ? (
                  discounts.map((discount, idx) => (
                    <tr
                      key={discount._id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-base text-gray-700">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 text-base font-medium text-gray-900">
                        {discount.discountCode}
                      </td>
                      <td className="px-6 py-4 text-base text-gray-800">
                        {discount.discountName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          {discount.discountValue}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-base text-gray-700 max-w-xs truncate">
                        {Array.isArray(discount.discountProduct) &&
                        discount.discountProduct.length > 0
                          ? discount.discountProduct
                              .map((p) => p.productName || p)
                              .join(", ")
                          : "Không có sản phẩm"}
                      </td>
                      <td className="px-6 py-4 text-base text-gray-600">
                        {formatDate(discount.discountStartDate)}
                      </td>
                      <td className="px-6 py-4 text-base text-gray-600">
                        {formatDate(discount.discountEndDate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <div className="flex items-center justify-center space-x-2">
                            {/* Eye button - View details */}{" "}
                            <button
                              onClick={() => handleView(discount._id)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              {" "}
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {" "}
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />{" "}
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />{" "}
                              </svg>{" "}
                            </button>{" "}
                            {/* Edit button */}{" "}
                            <button
                              onClick={() => handleEdit(discount)}
                              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              {" "}
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {" "}
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />{" "}
                              </svg>{" "}
                            </button>{" "}
                            {/* Delete button */}{" "}
                            <button
                              onClick={() => handleDelete(discount._id)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              {" "}
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {" "}
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />{" "}
                              </svg>{" "}
                            </button>{" "}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        {/* giữ nguyên icon */}
                        <p className="text-gray-600 text-lg font-medium">
                          Chưa có khuyến mãi nào
                        </p>
                        <p className="text-gray-400 text-base mt-1">
                          Hãy thêm khuyến mãi mới để bắt đầu
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {discounts?.length > 0 && (
          <div className="flex items-center justify-between mt-6 text-sm text-gray-600">
            <div>
              Hiển thị <span className="font-medium">{discounts.length}</span>{" "}
              khuyến mãi
            </div>
          </div>
        )}
      </div>

      {/* ViewDiscount Modal */}
      {viewDiscountId && (
        <ViewDiscount
          discountId={viewDiscountId}
          onClose={handleCloseView}
          onEdit={(discount) => {
            handleCloseView();
            handleEdit(discount);
          }}
        />
      )}
    </>
  );
};

export default DiscountTable;
