import React from "react";
import { useAdminProductStore } from "../AdminProductContext";
import ProductService from "../services/ProductService";
import FilterbarComponent from "../../../../components/AdminComponents/FilterbarComponent";

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

  // Filter configuration
  const filters = [
    {
      label: "Danh mục",
      value: filterCategory,
      onChange: (e) => setFilterCategory(e.target.value),
      options: [
        { value: "all", label: "Tất cả loại" },
        ...categories.map((category) => ({
          value: category._id,
          label: category.categoryName,
        })),
      ],
    },
  ];

  // Pagination configuration
  const pagination = {
    itemsPerPage,
    onChange: setItemsPerPage,
  };

  // Selection configuration
  const selection = {
    count: selectedProducts.length,
    onClear: clearSelection,
    onDelete: handleDeleteSelected,
  };

  return (
    <FilterbarComponent
      filters={filters}
      pagination={pagination}
      selection={selection}
      itemLabel="sản phẩm"
      variant="rounded"
      className="mb-8"
    />
  );
};

export default FilterBar;
