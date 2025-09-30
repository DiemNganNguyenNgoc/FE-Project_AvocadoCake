import React from "react";
import {
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
} from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";
import ProductService from "../services/ProductService";

const ProductTable = () => {
  const {
    paginatedProducts,
    selectedProducts,
    sortField,
    sortDirection,
    toggleProductSelection,
    toggleSelectAll,
    setCurrentProduct,
    setShowEditModal,
    setShowViewModal,
    deleteProduct,
    setLoading,
    setError,
    setSort,
    categories,
  } = useAdminProductStore();

  const products = paginatedProducts();
  const allSelected =
    products.length > 0 &&
    products.every((product) => selectedProducts.includes(product._id));
  const someSelected = selectedProducts.length > 0 && !allSelected;

  const handleSelectAll = () => {
    toggleSelectAll();
  };

  const handleSelectProduct = (productId) => {
    toggleProductSelection(productId);
  };

  const handleSort = (field) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSort(field, direction);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <div className="flex flex-col">
          <ChevronUp className="w-4 h-4 text-gray-400 transition-colors" />
          <ChevronDown className="w-4 h-4 text-gray-400 transition-colors" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`w-4 h-4 transition-all duration-200 ${
            sortDirection === "asc" ? "text-indigo-600" : "text-gray-400"
          }`}
        />
        <ChevronDown
          className={`w-4 h-4 transition-all duration-200 ${
            sortDirection === "desc" ? "text-indigo-600" : "text-gray-400"
          }`}
        />
      </div>
    );
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleViewProduct = (product) => {
    setCurrentProduct(product);
    setShowViewModal(true);
  };

  const handleDeleteProduct = async (product) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm "${product.productName}"?`
      )
    ) {
      try {
        setLoading(true);
        await ProductService.deleteProduct(product._id);
        deleteProduct(product._id);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      setLoading(true);
      await ProductService.toggleProductStatus(product._id, !product.isActive);
      const updatedProduct = { ...product, isActive: !product.isActive };
      setCurrentProduct(updatedProduct);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.categoryName : "Không xác định";
  };

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 shadow-sm">
        Hoạt động
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-rose-100 text-rose-700 shadow-sm">
        Ẩn
      </span>
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://res.cloudinary.com/dlyl41lgq/image/upload/v2/${imagePath.replace(
      "\\",
      "/"
    )}`;
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center shadow-inner">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Không có sản phẩm
          </h3>
          <p className="text-base text-gray-500 max-w-sm mx-auto leading-relaxed">
            Chưa có sản phẩm nào được tìm thấy. Hãy thử điều chỉnh bộ lọc của
            bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-8 py-5 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md transition-all duration-200"
                />
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>STT</span>
                </div>
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>Hình ảnh</span>
                </div>
              </th>
              <th
                className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-all duration-200 rounded-lg"
                onClick={() => handleSort("productName")}
              >
                <div className="flex items-center space-x-2">
                  <span>Tên sản phẩm</span>
                  {getSortIcon("productName")}
                </div>
              </th>
              <th
                className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-all duration-200 rounded-lg"
                onClick={() => handleSort("productPrice")}
              >
                <div className="flex items-center space-x-2">
                  <span>Giá bán</span>
                  {getSortIcon("productPrice")}
                </div>
              </th>
              <th
                className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-all duration-200 rounded-lg"
                onClick={() => handleSort("productCategory")}
              >
                <div className="flex items-center space-x-2">
                  <span>Danh mục</span>
                  {getSortIcon("productCategory")}
                </div>
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <span>Kích thước</span>
                </div>
              </th>
              {/* <th
                className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-all duration-200 rounded-lg"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center space-x-2">
                  <span>Trạng thái</span>
                  {getSortIcon("isActive")}
                </div>
              </th> */}
              <th
                className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-all duration-200 rounded-lg"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center space-x-2">
                  <span>Ngày tạo</span>
                  {getSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {products.map((product, index) => {
              const isSelected = selectedProducts.includes(product._id);

              return (
                <tr
                  key={product._id}
                  className={`hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50 transition-all duration-200 ${
                    isSelected
                      ? "bg-gradient-to-r from-indigo-50 to-blue-50 shadow-inner"
                      : ""
                  }`}
                >
                  <td className="px-8 py-6 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectProduct(product._id)}
                      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md transition-all duration-200"
                    />
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base font-semibold text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm">
                      {product.productImage ? (
                        <img
                          src={getImageUrl(product.productImage)}
                          alt={product.productName}
                          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-base font-semibold text-gray-900 max-w-xs">
                    <div className="truncate" title={product.productName}>
                      {product.productName}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base font-bold text-gray-900">
                    {formatPrice(product.productPrice)}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-gray-700">
                    {getCategoryName(product.productCategory)}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-gray-700">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold">
                      {product.productSize}
                    </span>
                  </td>
                  {/* <td className="px-8 py-6 whitespace-nowrap">
                    {getStatusBadge(product.isActive)}
                  </td> */}
                  <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-gray-700">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 p-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {/* <button
                        onClick={() => handleToggleStatus(product)}
                        className={`p-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
                          product.isActive
                            ? "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                            : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                        }`}
                        title={
                          product.isActive ? "Ẩn sản phẩm" : "Hiện sản phẩm"
                        }
                      >
                        {product.isActive ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button> */}
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
