import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";

const NewsTable = ({
  news,
  loading,
  selectedNews,
  currentPage,
  sortBy,
  sortOrder,
  toggleNewsSelection,
  selectAllNews,
  clearSelection,
  setCurrentPage,
  deleteNews,
  deleteMultipleNews,
  getPaginatedNews,
  handleSort,
  onNavigate,
  searchTerm = "",
  onSearch,
  itemsPerPage = 10,
  onItemsPerPageChange,
}) => {
  const navigate = useNavigate();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const checkboxRef = useRef(null);

  const { news: paginatedNews, totalPages, totalItems } = getPaginatedNews();

  const isAllSelected = selectedNews.length === news.length && news.length > 0;
  const isSomeSelected =
    selectedNews.length > 0 && selectedNews.length < news.length;

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isSomeSelected;
    }
  }, [isSomeSelected]);

  const handleSelectAllClick = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      selectAllNews();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleExport = () => {
    const headers = ["No", "Title", "Created At", "Status"];
    const csvData = paginatedNews.map((item, index) => [
      (currentPage - 1) * itemsPerPage + index + 1,
      item.newsTitle,
      formatDate(item.createdAt),
      item.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `news_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const handleEdit = (newsItem) => {
    if (onNavigate) {
      localStorage.setItem(
        "editNewsData",
        JSON.stringify({
          newsId: newsItem._id,
          newsTitle: newsItem.newsTitle,
          newsContent: newsItem.newsContent,
          newsImage: newsItem.newsImage || newsItem.getImageUrl?.(),
          status: newsItem.status,
        })
      );
      onNavigate("update");
    } else {
      navigate("/admin/news/update", {
        state: {
          newsId: newsItem._id,
          newsTitle: newsItem.newsTitle,
          newsContent: newsItem.newsContent,
          newsImage: newsItem.newsImage || newsItem.getImageUrl?.(),
          status: newsItem.status,
        },
      });
    }
  };

  const handleView = (newsItem) => {
    const imageUrl = newsItem.getImageUrl
      ? newsItem.getImageUrl()
      : newsItem.newsImage;
    navigate("/admin/news/detail", {
      state: {
        newsImage: imageUrl,
        newsTitle: newsItem.newsTitle,
        newsContent: newsItem.newsContent,
        _id: newsItem._id,
        status: newsItem.status,
      },
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin tức này?")) {
      try {
        await deleteNews(id);
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedNews.length === 0) {
      alert("Vui lòng chọn ít nhất một tin tức để xóa");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedNews.length} tin tức đã chọn?`
      )
    ) {
      try {
        await deleteMultipleNews(selectedNews);
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Đã xuất bản",
      },
      Draft: {
        bg: "bg-amber-100",
        text: "text-amber-800",
        label: "Bản nháp",
      },
      Inactive: {
        bg: "bg-gray-100",
        text: "text-gray-800",
        label: "Đã ẩn",
      },
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
            Đang tải danh sách tin tức...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-dark rounded-2xl border border-stroke dark:border-stroke-dark overflow-hidden">
      <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm tin tức..."
                value={localSearchTerm}
                onChange={handleSearchChange}
                className="pl-12 pr-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl w-80"
              />
            </div>
            <button
              onClick={() => {}}
              className="flex items-center gap-3 px-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors text-xl"
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={handleExport}
              className="flex items-center gap-3 px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-xl"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xl text-gray-600 dark:text-gray-400">
                Show:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  onItemsPerPageChange &&
                  onItemsPerPageChange(parseInt(e.target.value))
                }
                className="px-4 py-2 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl"
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

      {selectedNews.length > 0 && (
        <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark bg-blue-light-5 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-dark dark:text-white">
              {selectedNews.length} tin tức được chọn
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-2">
            <tr>
              <th className="px-8 py-4 text-left">
                <input
                  ref={checkboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllClick}
                  className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                />
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("_id")}
              >
                <div className="flex items-center gap-2">
                  <span>No</span>
                  {sortBy === "_id" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "" : ""}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ảnh
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("newsTitle")}
              >
                <div className="flex items-center gap-2">
                  <span>Tiêu đề</span>
                  {sortBy === "newsTitle" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "" : ""}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center gap-2">
                  <span>Ngày tạo</span>
                  {sortBy === "createdAt" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "" : ""}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  <span>Trạng thái</span>
                  {sortBy === "status" && (
                    <span className="text-primary">
                      {sortOrder === "asc" ? "" : ""}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-8 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stroke dark:divide-stroke-dark">
            {paginatedNews.map((newsItem, index) => {
              const imageUrl = newsItem.getImageUrl
                ? newsItem.getImageUrl()
                : newsItem.newsImage;
              return (
                <tr
                  key={newsItem._id}
                  className="hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors"
                >
                  <td className="px-8 py-6">
                    <input
                      type="checkbox"
                      checked={selectedNews.includes(newsItem._id)}
                      onChange={() => toggleNewsSelection(newsItem._id)}
                      className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-8 py-6 text-xl text-gray-900 dark:text-white">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-8 py-6">
                    <img
                      src={imageUrl}
                      alt={newsItem.newsTitle}
                      className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64?text=No+Image";
                      }}
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div className="max-w-md">
                      <p className="text-xl font-medium text-gray-900 dark:text-white line-clamp-2">
                        {newsItem.newsTitle}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                        {newsItem.getExcerpt
                          ? newsItem.getExcerpt(80)
                          : newsItem.newsContent?.substring(0, 80) + "..."}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xl text-gray-600 dark:text-gray-400">
                    {formatDate(newsItem.createdAt)}
                  </td>
                  <td className="px-8 py-6">
                    {getStatusBadge(newsItem.status || "Active")}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleView(newsItem)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(newsItem)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(newsItem._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      </div>

      <div className="px-8 py-6 border-t border-stroke dark:border-stroke-dark">
        <div className="flex items-center justify-between">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
            {totalItems} tin tức
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                const showPage =
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1);
                if (!showPage && page === currentPage - 2)
                  return (
                    <span key={page} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                if (!showPage && page === currentPage + 2)
                  return (
                    <span key={page} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                if (!showPage) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-xl font-medium transition-colors ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTable;
