import React from "react";
import { List, Grid } from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";

const ViewModeToggle = () => {
  const { viewMode, setViewMode } = useAdminProductStore();

  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setViewMode("list")}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === "list"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <List className="w-4 h-4 mr-2" />
        Danh sách
      </button>
      <button
        onClick={() => setViewMode("card")}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode === "card"
            ? "bg-white text-blue-600 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <Grid className="w-4 h-4 mr-2" />
        Thẻ
      </button>
    </div>
  );
};

export default ViewModeToggle;
