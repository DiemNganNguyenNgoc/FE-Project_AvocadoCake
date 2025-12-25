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
import * as StatusService from "../../../../api/services/StatusService";

const OrderTable = ({
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  orders,
  selectedOrders,
  loading,
  selectOrder,
  clearSelection,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}) => {
  const checkboxRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState("all");
  const [statusList, setStatusList] = useState([]);

  // Fetch status list from API
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await StatusService.getAllStatus(token);
        if (response.status === "OK" && response.data) {
          setStatusList(response.data);
        }
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    fetchStatuses();
  }, []);

  // Filter orders by search term, status, and price range
  const filteredOrders = orders.filter((order) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        order.orderCode?.toLowerCase().includes(searchLower) ||
        order.userName?.toLowerCase().includes(searchLower) ||
        order.userId?.userName?.toLowerCase().includes(searchLower) ||
        order.shippingAddress?.userName?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== "all") {
      const orderStatus = order.status?.statusName?.toLowerCase() || "";
      if (!orderStatus.includes(statusFilter.toLowerCase())) {
        return false;
      }
    }

    // Price range filter
    if (priceRangeFilter !== "all") {
      const price = order.finalPrice || 0;
      switch (priceRangeFilter) {
        case "under500":
          if (price >= 500000) return false;
          break;
        case "500to1000":
          if (price < 500000 || price >= 1000000) return false;
          break;
        case "1000to2000":
          if (price < 1000000 || price >= 2000000) return false;
          break;
        case "over2000":
          if (price < 2000000) return false;
          break;
        default:
          break;
      }
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredOrders.slice(startIndex, endIndex);

  const allSelected =
    currentData.length > 0 &&
    currentData.every((order) => selectedOrders.includes(order._id));
  const someSelected = selectedOrders.length > 0 && !allSelected;

  // Set indeterminate state for checkbox
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePriceRangeFilterChange = (range) => {
    setPriceRangeFilter(range);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleExport = () => {
    // Export to CSV
    const headers = ["No", "Code", "Client", "Deadline", "Total", "Status"];

    const csvData = filteredOrders.map((order, index) => {
      const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN");
      };

      const formatPrice = (price) => {
        if (!price && price !== 0) return "0 ₫";
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price);
      };

      return [
        index + 1,
        order.orderCode || "N/A",
        order.userName ||
          order.userId?.userName ||
          order.shippingAddress?.userName ||
          "N/A",
        formatDate(order.deliveryDate || order.deadline),
        formatPrice(order.finalPrice),
        order.status?.statusName || "Unknown",
      ];
    });

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn hàng để xóa");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedOrders.length} đơn hàng đã chọn?`
      )
    ) {
      try {
        // Delete multiple orders
        for (const orderId of selectedOrders) {
          const order = orders.find((o) => o._id === orderId);
          if (order && onDeleteOrder) {
            await onDeleteOrder(order);
          }
        }
      } catch (error) {
        console.error("Error deleting orders:", error);
      }
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      // Nếu đang chọn tất cả → bỏ chọn tất cả
      clearSelection();
    } else {
      // Nếu chưa chọn tất cả hoặc chọn một phần → chọn tất cả orders
      const allOrderIds = orders.map((order) => order._id);
      allOrderIds.forEach((orderId) => {
        if (!selectedOrders.includes(orderId)) {
          selectOrder(orderId);
        }
      });
    }
  };

  const handleSelectOrder = (orderId) => {
    selectOrder(orderId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
      {/* Table Header with Controls */}
      <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left side - Search and Filters */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order code or client..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-12 pr-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base w-80"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="pl-10 pr-8 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                {statusList.map((status) => (
                  <option
                    key={status._id}
                    value={status.statusName.toLowerCase()}
                  >
                    {status.statusName}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
              <select
                value={priceRangeFilter}
                onChange={(e) => handlePriceRangeFilterChange(e.target.value)}
                className="pl-10 pr-8 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base appearance-none cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="under500">Under 500K</option>
                <option value="500to1000">500K - 1M</option>
                <option value="1000to2000">1M - 2M</option>
                <option value="over2000">Over 2M</option>
              </select>
            </div>
          </div>

          {/* Right side - Export and Show */}
          <div className="flex items-center gap-4">
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
      {selectedOrders.length > 0 && (
        <div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark bg-blue-light-5 dark:bg-dark-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-dark dark:text-white">
              {selectedOrders.length} đơn hàng được chọn
            </span>
            <div className="flex gap-4">
              <button
                onClick={clearSelection}
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
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-2">
            <tr>
              <th className="px-8 py-4 text-left">
                <input
                  ref={checkboxRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                />
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("_id")}
              >
                <div className="flex items-center gap-2">
                  No
                  {getSortIcon("_id")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("orderCode")}
              >
                <div className="flex items-center gap-2">
                  Code
                  {getSortIcon("orderCode")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("userName")}
              >
                <div className="flex items-center gap-2">
                  Client
                  {getSortIcon("userName")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("deliveryDate")}
              >
                <div className="flex items-center gap-2">
                  Deadline
                  {getSortIcon("deliveryDate")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("finalPrice")}
              >
                <div className="flex items-center gap-2">
                  Total
                  {getSortIcon("finalPrice")}
                </div>
              </th>
              <th
                className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-3 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon("status")}
                </div>
              </th>
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
            {currentData.length > 0 ? (
              currentData.map((order, index) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors"
                >
                  <td className="px-8 py-5">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleSelectOrder(order._id)}
                      className="w-5 h-5 rounded border-stroke dark:border-stroke-dark text-primary focus:ring-primary cursor-pointer"
                    />
                  </td>
                  <td className="px-8 py-5 text-base text-gray-900 dark:text-white font-medium">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-8 py-5 text-base">
                    <span className="text-primary font-semibold">
                      {order.orderCode}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-base text-gray-900 dark:text-white">
                    {order.userName ||
                      order.userId?.userName ||
                      order.shippingAddress?.userName ||
                      "N/A"}
                  </td>
                  <td className="px-8 py-5 text-base text-gray-500 dark:text-gray-400">
                    {order.formatDate(order.deliveryDate || order.deadline)}
                  </td>
                  <td className="px-8 py-5 text-base text-gray-900 dark:text-white font-semibold">
                    {order.formatPrice(order.finalPrice)}
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${order.getStatusColor()}`}
                    >
                      {order.status?.statusName || "Unknown"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="p-2.5 text-green hover:text-green-dark hover:bg-green-light-7 dark:hover:bg-dark-3 rounded-xl transition-all"
                        title="View details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onEditOrder(order)}
                        className="p-2.5 text-primary hover:text-primary/80 hover:bg-blue-light-5 dark:hover:bg-dark-3 rounded-xl transition-all"
                        title="Edit order"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDeleteOrder(order)}
                        className="p-2.5 text-red hover:text-red-dark hover:bg-red-light-6 dark:hover:bg-dark-3 rounded-xl transition-all"
                        title="Delete order"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-8 py-12 text-center text-gray-500 dark:text-gray-400 text-base"
                >
                  No orders found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-6 border-t border-stroke dark:border-stroke-dark">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="text-base text-gray-700 dark:text-gray-300">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredOrders.length)} of{" "}
            {filteredOrders.length} results
          </div>

          <div className="flex items-center gap-3">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
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

            {/* Next Button */}
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

export default OrderTable;
