import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryTable from "./partials/CategoryTable";
import SearchBar from "./partials/SearchBar";
import Breadcrumb from "./partials/Breadcrumb";
import StatsCards from "./partials/StatsCards";
import { CategoryService } from "./services/CategoryService";

// Import AdminComponents theo design system
import AdminCardComponent from "../../../components/AdminComponents/AdminCardComponent";
import AdminButtonComponent from "../../../components/AdminComponents/AdminButtonComponent";
import SearchBarComponent from "../../../components/AdminComponents/SearchBarComponent";
import FilterbarComponent from "../../../components/AdminComponents/FilterbarComponent";
import AdminStatsCardComponent from "../../../components/AdminComponents/AdminStatsCardComponent";
import AdminTableComponent from "../../../components/AdminComponents/AdminTableComponent";

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
    <div className="min-h-screen bg-avocado-green-10">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-avocado-brown-30">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-3 border-b border-avocado-brown-30">
            <Breadcrumb />
          </div>

          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-avocado-brown-100">
                Quản Lý Danh Mục
              </h1>
              <p className="text-sm text-avocado-brown-50 mt-1">
                Quản lý các danh mục sản phẩm trong hệ thống
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <AdminButtonComponent
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
                size="medium"
                icon={
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
                }
              >
                Làm mới
              </AdminButtonComponent>
              <AdminButtonComponent
                onClick={handleCreateCategory}
                variant="primary"
                size="medium"
                icon={
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
              >
                Tạo mới
              </AdminButtonComponent>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <AdminCardComponent
            variant="outlined"
            className="mb-6 border-red-300 bg-red-50"
          >
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
          </AdminCardComponent>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCardComponent
            title="Tổng danh mục"
            value={categories.length}
            subtitle="Tất cả danh mục"
            variant="success"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            }
          />
          <AdminStatsCardComponent
            title="Đã chọn"
            value={selectedCategories.length}
            subtitle="Danh mục được chọn"
            variant="info"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <AdminStatsCardComponent
            title="Trang hiện tại"
            value={currentPage}
            subtitle={`Trang ${currentPage} / ${totalPages}`}
            variant="default"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
          <AdminStatsCardComponent
            title="Tổng mục"
            value={totalItems}
            subtitle="Tất cả mục"
            variant="warning"
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            }
          />
        </div>

        {/* Search and Filters */}
        <AdminCardComponent className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 max-w-md">
              <SearchBarComponent
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm danh mục..."
                variant="default"
                size="md"
              />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-avocado-brown-100">
                Hiển thị {categories.length} danh mục
              </span>
            </div>
          </div>
        </AdminCardComponent>

        {/* Category Table */}
        <CategoryTable {...storeProps} />
      </div>
    </div>
  );
};

export default AdminCategory;
