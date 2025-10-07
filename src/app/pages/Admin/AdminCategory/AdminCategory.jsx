import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryTable from "./partials/CategoryTable";
import SearchBar from "./partials/SearchBar";
import Breadcrumb from "./partials/Breadcrumb";
import StatsCards from "./partials/StatsCards";
import { CategoryService } from "./services/CategoryService";

const AdminCategory = ({ onNavigate }) => {
  const navigate = useNavigate();

  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Actions
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCategories = await CategoryService.fetchAllCategories();
      setCategories(fetchedCategories);
    } catch (error) {
      setError(error.message || "Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      setLoading(true);
      setError(null);
      const newCategory = await CategoryService.createNewCategory(categoryData);
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (error) {
      setError(error.message || "Không thể tạo danh mục");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCategory = await CategoryService.updateExistingCategory(
        id,
        categoryData
      );
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? updatedCategory : cat))
      );
      return updatedCategory;
    } catch (error) {
      setError(error.message || "Không thể cập nhật danh mục");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await CategoryService.removeCategory(id);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
      setSelectedCategories((prev) => prev.filter((catId) => catId !== id));
    } catch (error) {
      setError(error.message || "Không thể xóa danh mục");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteMultipleCategories = async (ids) => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all(ids.map((id) => CategoryService.removeCategory(id)));
      setCategories((prev) => prev.filter((cat) => !ids.includes(cat._id)));
      setSelectedCategories([]);
    } catch (error) {
      setError(error.message || "Không thể xóa danh mục");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Selection management
  const toggleCategorySelection = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const selectAllCategories = () => {
    setSelectedCategories(categories.map((cat) => cat._id));
  };

  const clearSelection = () => {
    setSelectedCategories([]);
  };

  // Search and filter
  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  // Get filtered and sorted categories
  const getFilteredCategories = () => {
    let filtered = categories;

    // Apply search filter
    if (searchTerm) {
      filtered = categories.filter(
        (cat) =>
          cat.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.categoryCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  // Get paginated categories
  const getPaginatedCategories = () => {
    const filtered = getFilteredCategories();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      categories: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      totalItems: filtered.length,
    };
  };

  // Navigation handlers
  const handleCreateCategory = () => {
    if (onNavigate) {
      onNavigate("add");
    } else {
      navigate("/admin/category/add");
    }
  };

  const handleRefresh = () => {
    fetchCategories();
  };

  const clearError = () => {
    setError(null);
  };

  // Pass all necessary props to child components
  const storeProps = {
    categories,
    loading,
    error,
    selectedCategories,
    currentPage,
    sortBy,
    sortOrder,
    toggleCategorySelection,
    selectAllCategories,
    clearSelection,
    setCurrentPage,
    deleteCategory,
    deleteMultipleCategories,
    getPaginatedCategories,
    handleSort,
    clearError,
    onNavigate, // Pass onNavigate to CategoryTable
  };

  const {
    categories: paginatedCategories,
    totalPages,
    totalItems,
  } = getPaginatedCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-3 border-b border-gray-100">
            <Breadcrumb />
          </div>

          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản Lý Danh Mục
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Quản lý các danh mục sản phẩm trong hệ thống
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button
                onClick={handleCreateCategory}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-600">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-400 hover:text-red-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards categories={categories} />

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 max-w-md">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">
                Hiển thị {categories.length} danh mục
              </span>
            </div>
          </div>
        </div>

        {/* Category Table */}
        <CategoryTable {...storeProps} />
      </div>
    </div>
  );
};

export default AdminCategory;
