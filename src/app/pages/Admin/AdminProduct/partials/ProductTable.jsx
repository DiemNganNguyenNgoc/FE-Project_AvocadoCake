import React from "react";
import {
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
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
      <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-1 dark:bg-dark-2 rounded-xl flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-dark dark:text-white mb-3">
            Không có sản phẩm
          </h3>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Chưa có sản phẩm nào được tìm thấy. Hãy thử điều chỉnh bộ lọc của
            bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-2">
            <tr>
              <th className="px-8 py-4 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary"
                />
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>STT</span>
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Hình ảnh</span>
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("productName")}
              >
                <div className="flex items-center gap-2">
                  <span>Tên sản phẩm</span>
                  {getSortIcon("productName")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("productPrice")}
              >
                <div className="flex items-center gap-2">
                  <span>Giá bán</span>
                  {getSortIcon("productPrice")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("productCategory")}
              >
                <div className="flex items-center gap-2">
                  <span>Danh mục</span>
                  {getSortIcon("productCategory")}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Kích thước</span>
                </div>
              </th>
              {/* <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center gap-2">
                  <span>Trạng thái</span>
                  {getSortIcon("isActive")}
                </div>
              </th> */}
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-2">
                  <span>Ngày tạo</span>
                  {getSortIcon("createdAt")}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
            {products.map((product, index) => {
              const isSelected = selectedProducts.includes(product._id);

              return (
                <tr
                  key={product._id}
                  className={`hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors ${
                    isSelected ? "bg-blue-light-5 dark:bg-dark-2" : ""
                  }`}
                >
                  <td className="px-8 py-5 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectProduct(product._id)}
                      className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-primary"
                    />
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-1 dark:bg-dark-2">
                      {product.productImage ? (
                        <img
                          src={getImageUrl(product.productImage)}
                          alt={product.productName}
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-base font-semibold text-gray-900 dark:text-white max-w-xs">
                    <div className="truncate" title={product.productName}>
                      {product.productName}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-bold text-gray-900 dark:text-white">
                    {formatPrice(product.productPrice)}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-medium text-gray-700 dark:text-gray-300">
                    {getCategoryName(product.productCategory)}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-medium text-gray-700 dark:text-gray-300">
                    <span className="px-3 py-1 bg-gray-1 dark:bg-dark-2 rounded-lg text-sm font-semibold text-dark dark:text-white">
                      {product.productSize}
                    </span>
                  </td>
                  {/* <td className="px-8 py-5 whitespace-nowrap">
                    {getStatusBadge(product.isActive)}
                  </td> */}
                  <td className="px-8 py-5 whitespace-nowrap text-base font-medium text-gray-500 dark:text-gray-400">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-medium">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewProduct(product)}
                        className="text-green hover:text-green-dark hover:bg-green-light-7 dark:hover:bg-dark-3 p-2.5 rounded-xl transition-all"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-primary hover:text-primary/80 hover:bg-blue-light-5 dark:hover:bg-dark-3 p-2.5 rounded-xl transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {/* <button
                        onClick={() => handleToggleStatus(product)}
                        className={`p-2.5 rounded-xl transition-all ${
                          product.isActive
                            ? "text-yellow hover:text-yellow-dark hover:bg-yellow-light-4"
                            : "text-green hover:text-green-dark hover:bg-green-light-7"
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
                        className="text-red hover:text-red-dark hover:bg-red-light-6 dark:hover:bg-dark-3 p-2.5 rounded-xl transition-all"
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
