import React, { useState, useRef, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
} from "lucide-react";
import { useAdminUserStore } from "../adminUserStore";

const UserTable = () => {
  const checkboxRef = useRef(null);
  const {
    filteredUsers,
    selectedUsers,
    sortField,
    sortDirection,
    toggleUserSelection,
    toggleSelectAll,
    setCurrentUser,
    setShowEditModal,
    setShowViewModal,
    deleteUser,
    setLoading,
    setError,
    setSort,
  } = useAdminUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState("all"); // all, admin, user

  const users = filteredUsers();

  // Filter users by search term and role
  const searchFilteredUsers = users.filter((user) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        user.userName?.toLowerCase().includes(searchLower) ||
        user.familyName?.toLowerCase().includes(searchLower) ||
        user.userEmail?.toLowerCase().includes(searchLower) ||
        user.userPhone?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Role filter
    if (roleFilter === "admin") {
      return user.isAdmin === true;
    } else if (roleFilter === "user") {
      return user.isAdmin === false;
    }

    return true; // "all" - no role filter
  });

  // Pagination
  const totalPages = Math.ceil(searchFilteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = searchFilteredUsers.slice(startIndex, endIndex);

  const allSelected =
    currentData.length > 0 &&
    currentData.every((user) => selectedUsers.includes(user._id));
  const someSelected = selectedUsers.length > 0 && !allSelected;

  // Set indeterminate state for checkbox
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleSelectAll = () => {
    toggleSelectAll();
  };

  const handleSelectUser = (userId) => {
    toggleUserSelection(userId);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      alert("Vui lòng chọn ít nhất một người dùng để xóa");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedUsers.length} người dùng đã chọn?`
      )
    ) {
      try {
        setLoading(true);
        // Delete multiple users
        for (const userId of selectedUsers) {
          await deleteUser(userId);
        }
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExport = () => {
    // Export to CSV
    const headers = [
      "No",
      "Family Name",
      "Name",
      "Phone",
      "Email",
      "Role",
      "Orders",
      "Join On",
    ];

    const csvData = searchFilteredUsers.map((user, index) => [
      index + 1,
      user.familyName || "N/A",
      user.userName || "N/A",
      user.userPhone || "N/A",
      user.userEmail || "N/A",
      user.isAdmin ? "Admin" : "User",
      "0",
      formatDate(user.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleSort = (field) => {
    setSort(field);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <div className="flex flex-col">
          <ChevronUp className="w-3 h-3 text-gray-400" />
          <ChevronDown className="w-3 h-3 text-gray-400" />
        </div>
      );
    }

    return (
      <div className="flex flex-col">
        <ChevronUp
          className={`w-3 h-3 ${
            sortDirection === "asc" ? "text-blue-600" : "text-gray-400"
          }`}
        />
        <ChevronDown
          className={`w-3 h-3 ${
            sortDirection === "desc" ? "text-blue-600" : "text-gray-400"
          }`}
        />
      </div>
    );
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
  };

  const handleViewUser = (user) => {
    setCurrentUser(user);
    setShowViewModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.userName}?`)
    ) {
      try {
        setLoading(true);
        await deleteUser(user._id);
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

  const getRoleBadge = (isAdmin) => {
    return isAdmin ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        User
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
      {/* Table Header with Search, Filter, Export */}
      <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-12 pr-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base w-80"
              />
            </div>

            {/* Role Filter Dropdown */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilterChange(e.target.value)}
                className="flex items-center gap-3 px-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors text-base appearance-none pr-10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-3 px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-base"
            >
              <Download className="w-5 h-5" />
              Export
            </button>

            {/* Show Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-base text-gray-600 dark:text-gray-400">
                Show:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="px-4 py-2 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base"
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
      {selectedUsers.length > 0 && (
        <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark bg-blue-light-5 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-dark dark:text-white">
              {selectedUsers.length} người dùng được chọn
            </span>
            <div className="flex gap-4">
              <button
                onClick={() => toggleSelectAll()}
                className="px-5 py-3 text-base font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Bỏ chọn
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-5 py-3 text-base font-medium bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
              >
                Xóa đã chọn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {currentData.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có người dùng
            </h3>
            <p className="text-gray-500">
              Chưa có người dùng nào được tìm thấy.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
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
                  <div className="flex items-center space-x-1">
                    <span>No</span>
                  </div>
                </th>
                <th
                  className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-2"
                  onClick={() => handleSort("familyName")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Family name</span>
                    {getSortIcon("familyName")}
                  </div>
                </th>
                <th
                  className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-2"
                  onClick={() => handleSort("userName")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {getSortIcon("userName")}
                  </div>
                </th>
                <th
                  className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-2"
                  onClick={() => handleSort("userPhone")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Phone</span>
                    {getSortIcon("userPhone")}
                  </div>
                </th>
                <th
                  className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-2"
                  onClick={() => handleSort("userEmail")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {getSortIcon("userEmail")}
                  </div>
                </th>
                <th
                  className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-2"
                  onClick={() => handleSort("isAdmin")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    {getSortIcon("isAdmin")}
                  </div>
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Orders</span>
                  </div>
                </th>
                <th
                  className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-2"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Join on</span>
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
              {currentData.map((user, index) => {
                const isSelected = selectedUsers.includes(user._id);

                return (
                  <tr
                    key={user._id}
                    className={`hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors ${
                      isSelected ? "bg-green-50 dark:bg-green-900/20" : ""
                    }`}
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectUser(user._id)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white">
                      {user.familyName || "N/A"}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white">
                      {user.userName || "N/A"}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white">
                      {user.userPhone || "N/A"}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white">
                      {user.userEmail || "N/A"}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      {getRoleBadge(user.isAdmin)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white">
                      0
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base text-gray-900 dark:text-white">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-base font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-8 py-6 border-t border-stroke dark:border-stroke-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-base text-gray-700 dark:text-gray-300">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, searchFilteredUsers.length)} of{" "}
            {searchFilteredUsers.length} results
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-xl text-base transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-2"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
