import React from "react";
import {
  X,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Tag,
  Ruler,
  Calendar,
  Star,
} from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";

const ViewProduct = ({ onBack }) => {
  const { currentProduct, setShowEditModal, setShowViewModal } =
    useAdminProductStore();

  if (!currentProduct) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <p className="text-gray-600">Không tìm thấy thông tin sản phẩm</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm "${currentProduct.productName}"?`
      )
    ) {
      // Handle delete logic here
      onBack();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${imagePath.replace(
      "\\",
      "/"
    )}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Chi tiết Sản phẩm
          </h2>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Product Image and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Hình ảnh
              </h3>
              <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                {currentProduct.productImage ? (
                  <img
                    src={getImageUrl(currentProduct.productImage)}
                    alt={currentProduct.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Thông tin cơ bản
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Tên sản phẩm
                      </p>
                      <p className="text-gray-900 font-medium">
                        {currentProduct.productName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Giá</p>
                      <p className="text-gray-900 font-medium text-lg">
                        {formatPrice(currentProduct.productPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Loại sản phẩm
                      </p>
                      <p className="text-gray-900">
                        {currentProduct.productCategory}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Ruler className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Kích thước
                      </p>
                      <p className="text-gray-900">
                        {currentProduct.productSize}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Trạng thái
              </h3>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentProduct.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`font-medium ${
                    currentProduct.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {currentProduct.isActive ? "Đang hoạt động" : "Đã ẩn"}
                </span>
              </div>
            </div>

            {(currentProduct.averageRating > 0 ||
              currentProduct.totalRatings > 0) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Đánh giá
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(currentProduct.averageRating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {currentProduct.averageRating.toFixed(1)} (
                    {currentProduct.totalRatings} đánh giá)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Mô tả</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 whitespace-pre-wrap">
                {currentProduct.productDescription}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Ngày tạo</p>
                <p className="text-gray-900">
                  {formatDate(currentProduct.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Cập nhật lần cuối
                </p>
                <p className="text-gray-900">
                  {formatDate(currentProduct.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đóng
          </button>
          <button
            onClick={handleEdit}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Edit className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
