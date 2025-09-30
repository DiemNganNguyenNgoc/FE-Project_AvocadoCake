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
    <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Category Filter */}
        <div className="relative min-w-[120px]">
          <select
            value={filterCategory}
            onChange={handleCategoryFilterChange}
            className="appearance-none bg-white border border-gray-300 rounded-full px-5 py-3 pr-12 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="all">Tất cả loại</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
          {/* <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div> */}
        </div>

        {/* Items per page */}
        <div className="relative min-w-[120px]">
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="appearance-none bg-white border border-gray-300 rounded-full px-5 py-3 pr-12 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value={10}>10 / trang</option>
            <option value={25}>25 / trang</option>
            <option value={50}>50 / trang</option>
            <option value={100}>100 / trang</option>
          </select>
          {/* <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div> */}
        </div>

        {/* Selected count */}
        {selectedProducts.length > 0 && (
          <div className="text-base text-gray-700 font-medium ml-2">
            Đã chọn {selectedProducts.length} sản phẩm
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {selectedProducts.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="inline-flex items-center px-5 py-3 bg-rose-600 text-white text-base font-semibold rounded-full shadow hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 transition-all"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Xóa đã chọn
          </button>
        )}
        <button
          onClick={clearSelection}
          className="px-5 py-3 bg-gray-100 text-gray-700 text-base font-semibold rounded-full shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 transition-all"
        >
          Bỏ chọn
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
