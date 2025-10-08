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

  const getStatusBadge = (statusCode) => {
    // Logic để xác định status badge dựa trên statusCode
    if (statusCode === "CANCEL") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Cancel
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Active
      </span>
    );
  };

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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <SortableHeader sortKey="id" className="w-20 rounded-tl-2xl">
                No
              </SortableHeader>
              <SortableHeader sortKey="statusCode">Code</SortableHeader>
              <SortableHeader sortKey="statusName">Name</SortableHeader>
              <SortableHeader sortKey="createdAt">Created at</SortableHeader>
              {/* <SortableHeader sortKey="status">Status</SortableHeader> */}
              <th className="px-8 py-5 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide w-40 rounded-tr-2xl">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {sortedStatuses.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-8 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
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
                    <p className="text-lg font-medium text-gray-500">
                      Không có dữ liệu trạng thái
                    </p>
                    <p className="text-base text-gray-400">
                      Hãy thêm trạng thái mới để bắt đầu
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedStatuses.map((status, index) => (
                <tr
                  key={status._id || index}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                >
                  <td className="px-8 py-6 whitespace-nowrap text-base font-semibold text-gray-900">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-black-600 font-bold group-hover:bg-blue-200 transition-colors duration-200">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base font-bold text-gray-900">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {status.statusCode || "N/A"}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base font-bold text-gray-800">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {status.statusName || "N/A"}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-base text-gray-600 font-medium">
                    <div className="flex items-center space-x-2">
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
                  {/* <td className="px-8 py-6 whitespace-nowrap">
                    {getStatusBadge(status.statusCode)}
                  </td> */}
                  <td className="px-8 py-6 whitespace-nowrap text-base font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => onEdit(status)}
                        className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 rounded-xl hover:from-green-200 hover:to-emerald-200 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md group"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
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
                        className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-xl hover:from-red-200 hover:to-pink-200 hover:scale-110 transition-all duration-200 shadow-sm hover:shadow-md group"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
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
