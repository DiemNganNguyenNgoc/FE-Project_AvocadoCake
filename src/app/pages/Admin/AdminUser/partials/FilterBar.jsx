import React from "react";
import { useAdminUserStore } from "../adminUserStore";
import FilterbarComponent from "../../../../components/AdminComponents/FilterbarComponent";

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

  // Filter configuration
  const filters = [
    {
      label: "Vai trò",
      value: filterRole,
      onChange: (e) => setFilterRole(e.target.value),
      options: [
        { value: "all", label: "Tất cả vai trò" },
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
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
    count: selectedUsers.length,
    onClear: clearSelection,
    onDelete: handleDeleteSelected,
  };

  return (
    <FilterbarComponent
      filters={filters}
      pagination={pagination}
      selection={selection}
      itemLabel="người dùng"
      variant="default"
    />
  );
};

export default FilterBar;
