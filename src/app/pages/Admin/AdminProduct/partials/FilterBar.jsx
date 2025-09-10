import React from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";
import ProductService from "../services/ProductService";

const FilterBar = () => {
  const {
    filterCategory,
    setFilterCategory,
    itemsPerPage,
    setItemsPerPage,
    selectedProducts,
    clearSelection,
    deleteMultipleProducts,
    setLoading,
    setError,
    categories,
  } = useAdminProductStore();

  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để xóa.");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedProducts.length} sản phẩm đã chọn?`
      )
    ) {
      try {
        setLoading(true);
        await ProductService.deleteMultipleProducts(selectedProducts);
        deleteMultipleProducts(selectedProducts);
        clearSelection();
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {/* Category Filter */}
        <div className="relative">
          <select
            value={filterCategory}
            onChange={handleCategoryFilterChange}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả loại</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Items per page */}
        <div className="relative">
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Selected count */}
        {selectedProducts.length > 0 && (
          <div className="text-sm text-gray-600">
            Đã chọn {selectedProducts.length} sản phẩm
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {selectedProducts.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa đã chọn
          </button>
        )}
        <button
          onClick={clearSelection}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Bỏ chọn
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
