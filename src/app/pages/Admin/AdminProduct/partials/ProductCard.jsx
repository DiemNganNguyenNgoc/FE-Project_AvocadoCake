import React from "react";
import { Edit, Eye, Trash2, MoreVertical, EyeOff } from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";
import { useAdminLanguage } from "../../../../context/AdminLanguageContext";
import ProductService from "../services/ProductService";

const ProductCard = ({ product }) => {
  const {
    setCurrentProduct,
    setShowEditModal,
    setShowViewModal,
    deleteProduct,
    toggleProductSelection,
    selectedProducts,
    categories,
    toggleProductVisibility,
    setLoading,
    setError,
  } = useAdminProductStore();

  const { t } = useAdminLanguage();
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

  const handleToggleVisibility = async (e) => {
    e.stopPropagation();
    const confirmMessage = product.isHidden
      ? t("showProductConfirm")
      : t("hideProductConfirm");

    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        const response = await ProductService.toggleProductVisibility(
          product._id
        );
        toggleProductVisibility(product._id, response.data.isHidden);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelect = () => {
    toggleProductSelection(product._id);
  };

  const handleCardClick = (e) => {
    // Ngăn không cho click card khi click vào checkbox hoặc action buttons
    if (
      e.target.closest(".checkbox-container") ||
      e.target.closest(".action-buttons")
    ) {
      return;
    }
    handleView();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${imagePath.replace(
      "\\",
      "/"
    )}`;
  };

  const getCategoryName = (categoryId) => {
    if (!categories || categories.length === 0) return "Đang tải...";

    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.categoryName : "Không xác định";
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
      onClick={handleCardClick}
      className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden cursor-pointer ${
        isSelected ? "ring-3 ring-blue-400 ring-opacity-60" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative">
        <img
          src={getImageUrl(product.productImage)}
          alt={product.productName}
          className="w-full h-56 object-cover"
        />

        {/* Discount Badge - Top Left */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -15%
          </span>
          {product.isHidden && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <EyeOff className="w-3 h-3" />
              {t("hidden")}
            </span>
          )}
        </div>

        {/* Selection Checkbox - Top Right */}
        <div className="absolute top-4 right-4 checkbox-container">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleSelect}
              className="sr-only"
            />
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 shadow-lg ${
                isSelected
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white bg-opacity-90 border-gray-300 hover:border-blue-400"
              }`}
            >
              {isSelected && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
          {product.productName}
        </h3>

        {/* Product Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Giá:</span>
            <span className="text-xl font-bold text-green-600">
              {formatPrice(product.productPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Loại:</span>
            <span className="text-sm font-medium text-gray-700">
              {getCategoryName(product.productCategory)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Kích thước:</span>
            <span className="text-sm font-medium text-gray-700">
              {product.productSize} cm
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Ngày tạo:</span>
            <span className="text-sm font-medium text-gray-700">
              {formatDate(product.createdAt)}
            </span>
          </div>
        </div>

        {/* Rating */}
        {product.averageRating > 0 && (
          <div className="flex items-center mb-4">
            <span className="text-lg font-semibold text-orange-500 mr-2">
              {product.averageRating.toFixed(1)}
            </span>
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.round(product.averageRating)
                      ? "text-orange-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.totalRatings})
            </span>
          </div>
        )}

        {/* Actions - Giữ nguyên ở dưới cùng */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 action-buttons">
          <button
            onClick={handleToggleVisibility}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm font-medium ${
              product.isHidden
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
            title={product.isHidden ? t("showProduct") : t("hideProduct")}
          >
            {product.isHidden ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>{t("hidden")}</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>{t("visible")}</span>
              </>
            )}
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handleView}
              className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
              title="Xem chi tiết"
            >
              <Eye className="w-5 h-5" />
            </button>
            <button
              onClick={handleEdit}
              className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
              title="Chỉnh sửa"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-110"
              title="Xóa"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
