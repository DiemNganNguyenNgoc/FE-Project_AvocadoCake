import React from "react";
import { Edit, Eye, Trash2, MoreVertical } from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";

const ProductCard = ({ product }) => {
  const {
    setCurrentProduct,
    setShowEditModal,
    setShowViewModal,
    deleteProduct,
    toggleProductSelection,
    selectedProducts,
  } = useAdminProductStore();

  const isSelected = selectedProducts.includes(product._id);

  const handleView = () => {
    setCurrentProduct(product);
    setShowViewModal(true);
  };

  const handleEdit = () => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm "${product.productName}"?`
      )
    ) {
      deleteProduct(product._id);
    }
  };

  const handleSelect = () => {
    toggleProductSelection(product._id);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${imagePath.replace(
      "\\",
      "/"
    )}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={getImageUrl(product.productImage)}
          alt={product.productName}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              product.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.isActive ? "Hoạt động" : "Ẩn"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.productName}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Giá:</span>
            <span className="text-lg font-bold text-blue-600">
              {formatPrice(product.productPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Loại:</span>
            <span className="text-sm text-gray-900">
              {product.productCategory}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Kích thước:</span>
            <span className="text-sm text-gray-900">{product.productSize}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Ngày tạo:</span>
            <span className="text-sm text-gray-900">
              {formatDate(product.createdAt)}
            </span>
          </div>
        </div>

        {/* Rating */}
        {product.averageRating > 0 && (
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.round(product.averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.averageRating.toFixed(1)} ({product.totalRatings})
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={handleView}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Xem chi tiết"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
              title="Chỉnh sửa"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Xóa"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
