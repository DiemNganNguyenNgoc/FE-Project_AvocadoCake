import React, { useState, useEffect } from "react";
import { useAdminOrderStore } from "../adminOrderStore";
import FilterbarComponent from "../../../../components/AdminComponents/FilterbarComponent";
import * as StatusService from "../../../../api/services/StatusService";
import * as CategoryService from "../../../../api/services/CategoryService";

const FilterBar = () => {
  const { filters, setFilters } = useAdminOrderStore();
  const [statusOptions, setStatusOptions] = useState([
    { value: "", label: "Tất cả trạng thái" },
  ]);
  const [categoryOptions, setCategoryOptions] = useState([
    { value: "", label: "Tất cả danh mục" },
  ]);
  const [loading, setLoading] = useState(false);

  // Fetch statuses from database
  const fetchStatuses = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");
      const response = await StatusService.getAllStatus(accessToken);
      const statusData = response.data || response;

      if (Array.isArray(statusData)) {
        const options = [
          { value: "", label: "Tất cả trạng thái" },
          ...statusData.map((status) => ({
            value: status.statusName,
            label: status.statusName,
          })),
        ];
        setStatusOptions(options);
      }
    } catch (error) {
      console.error("Failed to fetch statuses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await CategoryService.getAllCategory();
      const categoryData = response.data || response;

      if (Array.isArray(categoryData)) {
        const options = [
          { value: "", label: "Tất cả danh mục" },
          ...categoryData.map((category) => ({
            value: category.categoryName,
            label: category.categoryName,
          })),
        ];
        setCategoryOptions(options);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
    fetchCategories();
  }, []);

  const valueOptions = [
    { value: "", label: "Tất cả giá trị" },
    { value: "low", label: "Thấp (< 100k)" },
    { value: "medium", label: "Trung bình (100k - 500k)" },
    { value: "high", label: "Cao (> 500k)" },
  ];

  // Filter configuration
  const filterConfigs = [
    // Uncomment if needed
    // {
    //   label: "Danh mục",
    //   value: filters.category,
    //   onChange: (e) => setFilters({ ...filters, category: e.target.value }),
    //   options: categoryOptions,
    //   disabled: loading,
    // },
    {
      label: "Giá trị",
      value: filters.value,
      onChange: (e) => setFilters({ ...filters, value: e.target.value }),
      options: valueOptions,
      disabled: loading,
    },
    {
      label: "Trạng thái",
      value: filters.status,
      onChange: (e) => setFilters({ ...filters, status: e.target.value }),
      options: statusOptions,
      disabled: loading,
    },
  ];

  return (
    <FilterbarComponent
      filters={filterConfigs}
      pagination={null}
      selection={null}
      variant="default"
    />
  );
};

export default FilterBar;
