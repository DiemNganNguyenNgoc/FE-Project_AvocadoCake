import React from "react";
import { ChevronDown } from "lucide-react";
import { useAdminUserStore } from "../adminUserStore";

const FilterBar = () => {
  const {
    filterRole,
    setFilterRole,
    itemsPerPage,
    setItemsPerPage,
    selectedUsers,
    clearSelection,
    deleteMultipleUsers,
    setLoading,
    setError,
  } = useAdminUserStore();

  const handleRoleFilterChange = (e) => {
    setFilterRole(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) {
      alert("Vui lòng chọn ít nhất một người dùng để xóa.");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedUsers.length} người dùng đã chọn?`
      )
    ) {
      try {
        setLoading(true);
        await deleteMultipleUsers(selectedUsers);
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
        {/* Role Filter */}
        <div className="relative">
          <select
            value={filterRole}
            onChange={handleRoleFilterChange}
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
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
            className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
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
        {selectedUsers.length > 0 && (
          <div className="text-sm text-gray-600">
            Đã chọn {selectedUsers.length} người dùng
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center space-x-2">
        {selectedUsers.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
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
