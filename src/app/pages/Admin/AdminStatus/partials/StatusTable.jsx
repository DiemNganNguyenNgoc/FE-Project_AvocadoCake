import React, { useState } from "react";
import { Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";

const StatusTable = ({ statuses, loading, onEdit, onDelete }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedStatuses = React.useMemo(() => {
    if (!sortConfig.key) return statuses;

    return [...statuses].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle date sorting
      if (sortConfig.key === "createdAt") {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      // Handle string sorting
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [statuses, sortConfig]);

  const formatDate = (dateString) => {
    if (!dateString) return "05/01/2025"; // Default date for demo
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const SortableHeader = ({ children, sortKey, className = "" }) => (
    <th
      className={`px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center space-x-2">
        <span className="text-base">{children}</span>
        <div className="flex flex-col">
          <ChevronUp
            className={`w-4 h-4 transition-colors duration-200 ${
              sortConfig.key === sortKey && sortConfig.direction === "asc"
                ? "text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          />
          <ChevronDown
            className={`w-4 h-4 transition-colors duration-200 ${
              sortConfig.key === sortKey && sortConfig.direction === "desc"
                ? "text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          />
        </div>
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <span className="ml-4 text-lg text-gray-600 font-medium">
            Đang tải dữ liệu...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-dark rounded-xl border border-stroke dark:border-stroke-dark shadow-card-2">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-dark-2">
            <tr>
              <SortableHeader sortKey="id" className="w-20">
                No
              </SortableHeader>
              <SortableHeader sortKey="statusCode">Code</SortableHeader>
              <SortableHeader sortKey="statusName">Name</SortableHeader>
              <SortableHeader sortKey="createdAt">Created at</SortableHeader>
              {/* <SortableHeader sortKey="status">Status</SortableHeader> */}
              <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-40">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-dark divide-y divide-stroke dark:divide-stroke-dark">
            {sortedStatuses.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-8 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-1 dark:bg-dark-2 rounded-full flex items-center justify-center">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      Không có dữ liệu trạng thái
                    </p>
                    <p className="text-base text-gray-400 dark:text-gray-500">
                      Hãy thêm trạng thái mới để bắt đầu
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedStatuses.map((status, index) => (
                <tr
                  key={status._id || index}
                  className="hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors"
                >
                  <td className="px-8 py-5 whitespace-nowrap text-base font-semibold text-gray-900 dark:text-white">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full text-dark dark:text-white font-bold">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-bold text-primary">
                    {status.statusCode || "N/A"}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base font-bold text-gray-900 dark:text-white">
                    {status.statusName || "N/A"}
                  </td>
                  <td className="px-8 py-5 whitespace-nowrap text-base text-gray-500 dark:text-gray-400 font-medium">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatDate(status.createdAt)}</span>
                    </div>
                  </td>
                  {/* <td className="px-8 py-5 whitespace-nowrap">
                    {getStatusBadge(status.statusCode)}
                  </td> */}
                  <td className="px-8 py-5 whitespace-nowrap text-base font-medium">
                    <div className="flex gap-3">
                      <button
                        onClick={() => onEdit(status)}
                        className="inline-flex items-center justify-center w-11 h-11 bg-green-light-7 dark:bg-dark-3 text-green hover:text-green-dark rounded-xl hover:scale-105 transition-all"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Bạn có chắc chắn muốn xóa trạng thái này?"
                            )
                          ) {
                            onDelete(status._id);
                          }
                        }}
                        className="inline-flex items-center justify-center w-11 h-11 bg-red-light-6 dark:bg-dark-3 text-red hover:text-red-dark rounded-xl hover:scale-105 transition-all"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatusTable;
