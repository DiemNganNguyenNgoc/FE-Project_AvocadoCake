import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RankTable from "./partials/RankTable";
import Breadcrumb from "./partials/Breadcrumb";
import RankStatsCards from "./partials/RankStatsCards";
import { RankService } from "./services/RankService";
import RankFormModal from "./partials/RankFormModal";

import AdminCardComponent from "../../../components/AdminComponents/AdminCardComponent";
import { Button } from "../../../components/AdminLayout";

const AdminRank = ({ onNavigate }) => {
  const navigate = useNavigate();

  // State management
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRanks, setSelectedRanks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priority");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingRank, setEditingRank] = useState(null);

  // Statistics state
  const [statistics, setStatistics] = useState(null);

  // Fetch ranks and statistics on component mount
  useEffect(() => {
    fetchRanks();
    fetchStatistics();
  }, []);

  // Actions
  const fetchRanks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRanks = await RankService.fetchAllRanks();
      setRanks(fetchedRanks);
    } catch (error) {
      setError(error.message || "Không thể tải danh sách rank");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await RankService.fetchRankStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      // Don't show error to user, just log it
    }
  };

  const createRank = async (rankData) => {
    try {
      setLoading(true);
      setError(null);
      const newRank = await RankService.createNewRank(rankData);
      setRanks((prev) => [...prev, newRank]);
      return newRank;
    } catch (error) {
      setError(error.message || "Không thể tạo rank");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRank = async (id, rankData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedRank = await RankService.updateExistingRank(id, rankData);
      setRanks((prev) =>
        prev.map((rank) => (rank._id === id ? updatedRank : rank))
      );
      return updatedRank;
    } catch (error) {
      setError(error.message || "Không thể cập nhật rank");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteRank = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await RankService.removeRank(id);
      setRanks((prev) => prev.filter((rank) => rank._id !== id));
      setSelectedRanks((prev) => prev.filter((rankId) => rankId !== id));
    } catch (error) {
      setError(error.message || "Không thể xóa rank");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteMultipleRanks = async (ids) => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all(ids.map((id) => RankService.removeRank(id)));
      setRanks((prev) => prev.filter((rank) => !ids.includes(rank._id)));
      setSelectedRanks([]);
    } catch (error) {
      setError(error.message || "Không thể xóa rank");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Selection management
  const toggleRankSelection = (id) => {
    setSelectedRanks((prev) =>
      prev.includes(id) ? prev.filter((rankId) => rankId !== id) : [...prev, id]
    );
  };

  const selectAllRanks = () => {
    setSelectedRanks(ranks.map((rank) => rank._id));
  };

  const clearSelection = () => {
    setSelectedRanks([]);
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

  // Get filtered and sorted ranks
  const getFilteredRanks = () => {
    let filtered = ranks;

    // Apply search filter
    if (searchTerm) {
      filtered = ranks.filter(
        (rank) =>
          rank.rankDisplayName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          rank.rankCode.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Get paginated ranks
  const getPaginatedRanks = () => {
    const filtered = getFilteredRanks();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return {
      ranks: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
      totalItems: filtered.length,
    };
  };

  // Navigation handlers
  const handleCreateRank = () => {
    setEditingRank(null);
    setShowModal(true);
  };

  const handleEditRank = (rank) => {
    console.log("handleEditRank called with:", rank);
    setEditingRank(rank);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRank(null);
  };

  const handleSaveRank = async (rankData) => {
    try {
      if (editingRank) {
        await updateRank(editingRank._id, rankData);
      } else {
        await createRank(rankData);
      }
      handleCloseModal();
      fetchRanks();
    } catch (error) {
      throw error;
    }
  };

  const handleRefresh = () => {
    fetchRanks();
    fetchStatistics();
  };

  const clearError = () => {
    setError(null);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Pass all necessary props to child components
  const storeProps = {
    ranks,
    loading,
    error,
    selectedRanks,
    currentPage,
    sortBy,
    sortOrder,
    toggleRankSelection,
    selectAllRanks,
    clearSelection,
    setCurrentPage,
    deleteRank,
    deleteMultipleRanks,
    getPaginatedRanks,
    handleSort,
    clearError,
    onNavigate,
    searchTerm,
    onSearch: handleSearchChange,
    itemsPerPage,
    onItemsPerPageChange: handleItemsPerPageChange,
    onEdit: handleEditRank,
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-avocado-brown-30">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-3 border-b border-avocado-brown-30">
            <Breadcrumb />
          </div>

          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-avocado-brown-100">
                Quản Lý Rank
              </h1>
              <p className="text-sm text-avocado-brown-50 mt-1">
                Quản lý hệ thống rank và đặc quyền khách hàng
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleRefresh}
                disabled={loading}
                variant="secondary"
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
              <Button
                onClick={handleCreateRank}
                variant="primary"
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
              </Button>
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
        <div className="mb-8">
          {statistics ? (
            <RankStatsCards statistics={statistics} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Đang tải thống kê...
            </div>
          )}
        </div>

        {/* Rank Table */}
        <RankTable {...storeProps} />
      </div>

      {/* Rank Form Modal */}
      {showModal && (
        <RankFormModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSave={handleSaveRank}
          editingRank={editingRank}
          loading={loading}
        />
      )}
    </div>
  );
};

export default AdminRank;
