import React from "react";
import { List, Grid } from "lucide-react";
import { useAdminProductStore } from "../AdminProductContext";

const ViewModeToggle = () => {
  const { viewMode, setViewMode } = useAdminProductStore();

  const buttonBase =
    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 p-1";
  const activeStyles = "bg-white text-blue-600 shadow-sm ring-2 ring-blue-500";
  const inactiveStyles = "text-gray-500 hover:text-gray-700 hover:bg-gray-200";

  return (
    <div className="inline-flex items-center bg-gray-100 rounded-full shadow-inner p-2 mt-1">
      <button
        onClick={() => setViewMode("list")}
        className={`${buttonBase} ${
          viewMode === "list" ? activeStyles : inactiveStyles
        }`}
      >
        <List className="w-6 h-6" />
        Danh sách
      </button>
      <button
        onClick={() => setViewMode("card")}
        className={`${buttonBase} ${
          viewMode === "card" ? activeStyles : inactiveStyles
        }`}
      >
        <Grid className="w-6 h-6" />
        Thẻ
      </button>
    </div>
  );
};

export default ViewModeToggle;
