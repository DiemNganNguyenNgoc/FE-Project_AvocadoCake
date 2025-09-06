import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useAdminOrderStore } from "../adminOrderStore";
import * as StatusService from "../../../../api/services/StatusService";
import * as CategoryService from "../../../../api/services/CategoryService";

const FilterBar = () => {
  const { filters, setFilters } = useAdminOrderStore();
  const [statusOptions, setStatusOptions] = useState([
    { value: "", label: "All Status" },
  ]);
  const [categoryOptions, setCategoryOptions] = useState([
    { value: "", label: "All Categories" },
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
          { value: "", label: "All Status" },
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
          { value: "", label: "All Categories" },
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
    { value: "", label: "All Values" },
    { value: "low", label: "Low (< 100k)" },
    { value: "medium", label: "Medium (100k - 500k)" },
    { value: "high", label: "High (> 500k)" },
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value,
    });
  };

  return (
    <div className="flex gap-4">
      <div className="relative">
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          disabled={loading}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={filters.value}
          onChange={(e) => handleFilterChange("value", e.target.value)}
          disabled={loading}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {valueOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          disabled={loading}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default FilterBar;
