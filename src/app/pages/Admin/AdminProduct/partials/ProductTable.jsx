import React, { useState, useEffect, useRef } from "react";
import {
  ChevronUp,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  Package,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  EyeOff,
} from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";
import ProductService from "../services/ProductService";
import { useAdminLanguage } from "../../../../context/AdminLanguageContext";

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
    deleteMultipleProducts,
    setLoading,
    setError,
    setSort,
    categories,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterPriceMin,
    filterPriceMax,
    setFilterPriceMin,
    setFilterPriceMax,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    totalPages,
    sortedProducts,
    clearSelection,
    toggleProductVisibility,
  } = useAdminProductStore();

  const { t } = useAdminLanguage();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const checkboxRef = useRef(null);
  const filterRef = useRef(null);

  const products = paginatedProducts();
  const allProducts = sortedProducts();
  const totalItems = allProducts.length;

  // ⭐ Xử lý trạng thái checkbox select all
  const allSelected =
    products.length > 0 &&
    products.every((product) => selectedProducts.includes(product._id));
  const someSelected = selectedProducts.length > 0 && !allSelected;

  // ⭐ Set indeterminate state cho checkbox
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ⭐ Xử lý click checkbox select all
  const handleSelectAll = () => {
    if (allSelected) {
      clearSelection();
    } else {
      toggleSelectAll();
    }
  };

  const handleSelectProduct = (productId) => {
    toggleProductSelection(productId);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    setSearchTerm(value);
  };

  const handleExport = () => {
    // Export to CSV
    const headers = [
      "STT",
      "Tên sản phẩm",
      "Giá bán",
      "Danh mục",
      "Kích thước",
      "Ngày tạo",
    ];
    const csvData = allProducts.map((product, index) => [
      index + 1,
      product.productName,
      product.productPrice,
      getCategoryName(product.productCategory),
      product.productSize,
      formatDate(product.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để xóa");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`
      )
    ) {
      try {
        setLoading(true);
        await Promise.all(
          selectedProducts.map((id) => ProductService.deleteProduct(id))
        );
        deleteMultipleProducts(selectedProducts);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const applyFilters = () => {
    // Filters are already applied through context
    setShowFilterDropdown(false);
  };

  const clearFilters = () => {
    setFilterCategory("all");
    setFilterPriceMin("");
    setFilterPriceMax("");
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

  const handleToggleVisibility = async (product) => {
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

  return (
    <div className="bg-white dark:bg-gray-dark rounded-2xl border border-stroke dark:border-stroke-dark shadow-card-2 overflow-hidden">
      {/* Table Header - Search, Filter, Export */}
      <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={localSearchTerm}
                onChange={handleSearchChange}
                className="pl-12 pr-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl w-80"
              />
            </div>

            {/* Filter Button with Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-3 px-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors text-xl"
              >
                <Filter className="w-5 h-5" />
                Filter
              </button>

              {/* Filter Dropdown */}
              {showFilterDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-dark border border-stroke dark:border-stroke-dark rounded-xl shadow-lg z-50 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-dark dark:text-white">
                      Bộ lọc
                    </h3>
                    <button
                      onClick={() => setShowFilterDropdown(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Danh mục
                    </label>
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl"
                    >
                      <option value="all">Tất cả danh mục</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Khoảng giá
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        placeholder="Tối thiểu"
                        value={filterPriceMin}
                        onChange={(e) => setFilterPriceMin(e.target.value)}
                        className="w-full px-4 py-2 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        placeholder="Tối đa"
                        value={filterPriceMax}
                        onChange={(e) => setFilterPriceMax(e.target.value)}
                        className="w-full px-4 py-2 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl"
                      />
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-2 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors text-xl"
                    >
                      Xóa bộ lọc
                    </button>
                    <button
                      onClick={applyFilters}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-xl"
                    >
                      Áp dụng
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-3 px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-xl"
            >
              <Download className="w-5 h-5" />
              Export
            </button>

            {/* Items per page */}
            <div className="flex items-center gap-3">
              <span className="text-xl text-gray-600 dark:text-gray-400">
                Show:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="px-4 py-2 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Header */}
      {selectedProducts.length > 0 && (
        <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark bg-blue-light-5 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-dark dark:text-white">
              {selectedProducts.length} sản phẩm được chọn
            </span>
            <div className="flex gap-4">
              <button
                onClick={clearSelection}
                className="px-5 py-3 text-xl font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Bỏ chọn
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-5 py-3 text-xl font-medium bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
              >
                Xóa đã chọn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-2">
            <tr>
              <th className="px-8 py-4 text-left">
                <input
                  ref={checkboxRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                  title={
                    allSelected
                      ? "Bỏ chọn tất cả"
                      : someSelected
                      ? "Chọn tất cả"
                      : "Chọn tất cả"
                  }
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
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("isHidden")}
              >
                <div className="flex items-center gap-2">
                  <span>{t("productVisibility")}</span>
                  {getSortIcon("isHidden")}
                </div>
              </th>
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
            {products.length === 0 ? (
              <tr>
                <td colSpan="10" className="px-8 py-16">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-1 dark:bg-dark-2 rounded-xl flex items-center justify-center">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-dark dark:text-white mb-3">
                      Không có sản phẩm
                    </h3>
                    <p className="text-xl text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                      Chưa có sản phẩm nào được tìm thấy. Hãy thử điều chỉnh bộ
                      lọc của bạn.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product, index) => {
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
                        className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-white">
                      {(currentPage - 1) * itemsPerPage + index + 1}
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
                    <td className="px-8 py-5 text-xl font-semibold text-gray-900 dark:text-white max-w-xs">
                      <div className="truncate" title={product.productName}>
                        {product.productName}
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl font-bold text-gray-900 dark:text-white">
                      {formatPrice(product.productPrice)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl font-medium text-gray-700 dark:text-gray-300">
                      {getCategoryName(product.productCategory)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl font-medium text-gray-700 dark:text-gray-300">
                      <span className="px-3 py-1 bg-gray-1 dark:bg-dark-2 rounded-lg text-sm font-semibold text-dark dark:text-white">
                        {product.productSize}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl font-medium">
                      <button
                        onClick={() => handleToggleVisibility(product)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                          product.isHidden
                            ? "bg-red-light-6 text-red hover:bg-red-light-5"
                            : "bg-green-light-7 text-green hover:bg-green-light-6"
                        }`}
                        title={
                          product.isHidden ? t("showProduct") : t("hideProduct")
                        }
                      >
                        {product.isHidden ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {t("hidden")}
                            </span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              {t("visible")}
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl font-medium text-gray-500 dark:text-gray-400">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-xl font-medium">
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages() > 1 && (
        <div className="px-8 py-6 border-t border-stroke dark:border-stroke-dark">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="text-xl text-gray-700 dark:text-gray-300">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
              {totalItems} sản phẩm
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from(
                  { length: Math.min(5, totalPages()) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-xl rounded-xl transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-2"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages()}
                className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
