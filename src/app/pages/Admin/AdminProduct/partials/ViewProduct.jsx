import React, { useEffect, useState } from "react";
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
  const { currentProduct, setShowEditModal, setShowViewModal, categories } =
    useAdminProductStore();

  // visible controls entry/exit animation
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // small delay to ensure CSS transition triggers on mount
    const id = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(id);
  }, []);

  // close with exit animation
  const closeWithAnimation = () => {
    setVisible(false);
    setTimeout(() => onBack?.(), 220); // match transition duration
  };

  const handleEdit = () => {
    setVisible(false);
    setTimeout(() => {
      setShowViewModal(false);
      setShowEditModal(true);
    }, 220);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm "${currentProduct?.productName}"?`
      )
    ) {
      setVisible(false);
      setTimeout(() => onBack?.(), 220);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

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

  const getCategoryName = (categoryId) => {
    if (!categories || categories.length === 0) return "Đang tải...";
    
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.categoryName : "Không xác định";
  };

  if (!currentProduct) {
    // fallback modal when no product
    return (
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full transform transition-all duration-200 scale-100">
          <p className="text-gray-600">Không tìm thấy thông tin sản phẩm</p>
          <button
            onClick={closeWithAnimation}
            className="mt-6 h-12 min-w-[120px] px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform active:scale-95"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-200 ${
          visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900">
            Chi tiết sản phẩm
          </h2>
          <button
            onClick={closeWithAnimation}
            aria-label="Đóng"
            className="w-12 h-12 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-transform active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-10">
          {/* Image & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Hình ảnh
              </h3>
              <div className="w-full h-72 rounded-xl overflow-hidden bg-gray-50 shadow-inner flex items-center justify-center">
                {currentProduct.productImage ? (
                  <img
                    src={getImageUrl(currentProduct.productImage)}
                    alt={currentProduct.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-16 h-16 text-gray-400" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800">Thông tin</h3>
              <div className="space-y-5">
                <InfoRow
                  icon={<Package />}
                  label="Tên sản phẩm"
                  value={currentProduct.productName}
                />
                <InfoRow
                  icon={<DollarSign />}
                  label="Giá"
                  value={formatPrice(currentProduct.productPrice)}
                  bold
                />
                <InfoRow
                  icon={<Tag />}
                  label="Loại sản phẩm"
                  value={getCategoryName(currentProduct.productCategory)}
                />
                <InfoRow
                  icon={<Ruler />}
                  label="Kích thước"
                  value={currentProduct.productSize}
                />
              </div>
            </div>
          </div>

          {/* Status & Rating */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Trạng thái
              </h3>
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full ${
                    currentProduct.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />
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
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Đánh giá
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
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
            <h3 className="text-lg font-medium text-gray-800 mb-4">Mô tả</h3>
            <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {currentProduct.productDescription}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoRow
              icon={<Calendar />}
              label="Ngày tạo"
              value={formatDate(currentProduct.createdAt)}
            />
            <InfoRow
              icon={<Calendar />}
              label="Cập nhật lần cuối"
              value={formatDate(currentProduct.updatedAt)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-100">
          <button
            onClick={closeWithAnimation}
            className="h-12 min-w-[96px] px-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-transform active:scale-95"
          >
            Đóng
          </button>

          <button
            onClick={handleEdit}
            className="h-12 min-w-[96px] inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-transform active:scale-95"
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </button>

          <button
            onClick={handleDelete}
            className="h-12 min-w-[96px] inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-transform active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, bold }) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-500">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-gray-900 ${bold ? "font-semibold text-lg" : ""}`}>
        {value}
      </p>
    </div>
  </div>
);

export default ViewProduct;
