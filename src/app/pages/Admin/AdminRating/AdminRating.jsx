import React, { useEffect } from "react";
import { Star, Eye, EyeOff, MessageSquare, TrendingUp } from "lucide-react";
import RatingTable from "./partials/RatingTable";
import Breadcrumb from "./partials/Breadcrumb";
import { useAdminRatingStore } from "./adminRatingStore";

// Import AdminComponents
import AdminCardComponent from "../../../components/AdminComponents/AdminCardComponent";
import AdminButtonComponent from "../../../components/AdminComponents/AdminButtonComponent";
import AdminStatsCardComponent from "../../../components/AdminComponents/AdminStatsCardComponent";
import { Button } from "../../../components/AdminLayout";

const AdminRating = () => {
  // Zustand store
  const {
    ratings,
    loading,
    error,
    selectedRatings,
    currentPage,
    sortBy,
    sortOrder,
    searchTerm,
    itemsPerPage,
    fetchRatings,
    deleteRating,
    deleteMultipleRatings,
    toggleVisibility,
    toggleRatingSelection,
    selectAllRatings,
    clearSelection,
    setCurrentPage,
    setSearchTerm,
    setItemsPerPage,
    getPaginatedRatings,
    getStats,
    clearError,
  } = useAdminRatingStore();

  // Fetch ratings on component mount
  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  // Get statistics
  const stats = getStats();
  const { totalPages, totalItems } = getPaginatedRatings();

  // Actions
  const handleRefresh = () => {
    fetchRatings();
  };

  const handleSearchChange = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleSort = (field) => {
    const { setSortBy, setSortOrder } = useAdminRatingStore.getState();
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
  };

  // Pass all necessary props to table
  const tableProps = {
    ratings,
    loading,
    selectedRatings,
    currentPage,
    sortBy,
    sortOrder,
    toggleRatingSelection,
    selectAllRatings,
    clearSelection,
    setCurrentPage,
    deleteRating,
    deleteMultipleRatings,
    toggleVisibility,
    getPaginatedRatings,
    handleSort,
    searchTerm,
    onSearch: handleSearchChange,
    itemsPerPage,
    onItemsPerPageChange: handleItemsPerPageChange,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <>
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-3 border-b border-gray-200">
            <Breadcrumb />
          </div>

          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản Lý Đánh Giá
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Quản lý các đánh giá và phản hồi của khách hàng
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
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
              </Button>
            </div>
          </div>
        </div>
      </>

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
            title="Tổng đánh giá"
            value={stats.total}
            subtitle="Tất cả đánh giá"
            variant="success"
            icon={<Star className="w-6 h-6" />}
          />
          <AdminStatsCardComponent
            title="Đánh giá trung bình"
            value={stats.average}
            subtitle={`${stats.total} đánh giá`}
            variant="warning"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <AdminStatsCardComponent
            title="Hiển thị"
            value={stats.visible}
            subtitle={`${stats.hidden} đánh giá bị ẩn`}
            variant="info"
            icon={<Eye className="w-6 h-6" />}
          />
          <AdminStatsCardComponent
            title="Có bình luận"
            value={stats.withComments}
            subtitle="Đánh giá có nội dung"
            variant="default"
            icon={<MessageSquare className="w-6 h-6" />}
          />
        </div>

        {/* Rating Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AdminCardComponent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân bố đánh giá
            </h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="font-medium">{star}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full rounded-full transition-all"
                      style={{
                        width: `${
                          stats.total > 0
                            ? (stats.byRating[star] / stats.total) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {stats.byRating[star]}
                  </span>
                </div>
              ))}
            </div>
          </AdminCardComponent>

          <AdminCardComponent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thống kê chi tiết
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-700">
                    Đánh giá hiển thị
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {stats.visible}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-700">
                    Đánh giá bị ẩn
                  </span>
                </div>
                <span className="text-2xl font-bold text-gray-600">
                  {stats.hidden}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">
                    Có bình luận
                  </span>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {stats.withComments}
                </span>
              </div>
            </div>
          </AdminCardComponent>
        </div>

        {/* Rating Table */}
        <RatingTable {...tableProps} />
      </div>
    </div>
  );
};

export default AdminRating;
