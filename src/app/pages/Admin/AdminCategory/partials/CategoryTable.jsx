import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../../components/AdminLayout/DataTable";

const CategoryTable = ({
  categories,
  loading,
  selectedCategories,
  toggleCategorySelection,
  selectAllCategories,
  clearSelection,
  deleteCategory,
  deleteMultipleCategories,
  onNavigate,
  onSearch,
}) => {
  const navigate = useNavigate();
  const checkboxRef = useRef(null);

  const isAllSelected =
    selectedCategories.length === categories.length && categories.length > 0;
  const isSomeSelected =
    selectedCategories.length > 0 &&
    selectedCategories.length < categories.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const handleSelectAllClick = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllCategories();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleEdit = (category) => {
    if (onNavigate) {
      localStorage.setItem(
        "editCategoryData",
        JSON.stringify({
          categoryId: category._id,
          categoryCode: category.categoryCode,
          categoryName: category.categoryName,
        })
      );
      onNavigate("update");
    } else {
      navigate("/admin/category/update", {
        state: {
          categoryId: category._id,
          categoryCode: category.categoryCode,
          categoryName: category.categoryName,
        },
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCategories.length === 0) {
      alert("Vui lòng chọn ít nhất một danh mục để xóa");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedCategories.length} danh mục đã chọn?`
      )
    ) {
      try {
        await deleteMultipleCategories(selectedCategories);
      } catch (error) {
        console.error("Error deleting categories:", error);
      }
    }
  };

  const handleExport = () => {
    const headers = ["No", "Code", "Name", "Created At", "Status"];
    const csvData = categories.map((cat, index) => [
      index + 1,
      cat.categoryCode,
      cat.categoryName,
      formatDate(cat.createdAt),
      cat.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `categories_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Hoạt động",
      },
      Inactive: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Không hoạt động",
      },
      Cancel: { bg: "bg-pink-100", text: "text-red-800", label: "Đã hủy" },
    };

    const config = statusConfig[status] || statusConfig["Active"];

    return (
      <span
        className={`inline-flex items-center px-4 py-2 rounded-full text-xl font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600">
            Đang tải danh sách danh mục...
          </p>
        </div>
      </div>
    );
  }

  // Define columns for DataTable
  const columns = [
    {
      key: "checkbox",
      header: (
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={isAllSelected}
          onChange={handleSelectAllClick}
          className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary cursor-pointer"
          title={
            isAllSelected
              ? "Bỏ chọn tất cả"
              : isSomeSelected
              ? "Chọn tất cả"
              : "Chọn tất cả"
          }
        />
      ),
      render: (_, category) => (
        <input
          type="checkbox"
          checked={selectedCategories.includes(category._id)}
          onChange={() => toggleCategorySelection(category._id)}
          className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-primary cursor-pointer"
        />
      ),
    },
    {
      key: "no",
      header: "No",
      render: (_, category, index) => (
        <span className="font-medium">{index + 1}</span>
      ),
    },
    {
      key: "categoryCode",
      header: "Code",
      render: (value) => <span className="font-semibold">{value}</span>,
    },
    {
      key: "categoryName",
      header: "Name",
    },
    {
      key: "createdAt",
      header: "Created At",
      render: (value) => (
        <span className="text-gray-500 dark:text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (value) => getStatusBadge(value),
    },
    {
      key: "actions",
      header: "Action",
      render: (_, category) => (
        <div className="flex gap-3">
          <button
            onClick={() => handleEdit(category)}
            className="text-green hover:text-green-dark border border-green rounded-xl p-2.5 hover:bg-green-light-7 transition-all"
            title="Chỉnh sửa"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(category._id)}
            className="text-red hover:text-red-dark border border-red rounded-xl p-2.5 hover:bg-red-light-6 transition-all"
            title="Xóa"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Bulk Actions Header */}
      {selectedCategories.length > 0 && (
        <div className="mb-6 px-8 py-6 border border-stroke dark:border-stroke-dark rounded-xl bg-blue-light-5 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-dark dark:text-white">
              {selectedCategories.length} danh mục được chọn
            </span>
            <div className="flex gap-4">
              <button
                onClick={clearSelection}
                className="px-5 py-3 text-xl font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Bỏ chọn
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-5 py-3 text-xl font-medium bg-red text-white rounded-xl hover:bg-red/90 transition-colors"
              >
                Xóa đã chọn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DataTable Component */}
      <DataTable
        columns={columns}
        data={categories}
        onSearch={onSearch}
        onExport={handleExport}
        searchPlaceholder="Tìm kiếm danh mục..."
        showSearch={true}
        showFilter={false}
        showExport={true}
      />
    </>
  );
};

export default CategoryTable;
