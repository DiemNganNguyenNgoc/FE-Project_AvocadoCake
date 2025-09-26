import React, { useState } from "react";
import { AdminDiscountProvider } from "./adminDiscountStore";
import DiscountTable from "./partials/DiscountTable";
import DiscountCalendar from "./partials/DiscountCalendar";

const TabButton = ({ isActive, onClick, children }) => (
  <button
    onClick={onClick}
    className={
      "px-4 py-2 text-sm font-medium rounded-lg transition-colors " +
      (isActive
        ? "bg-brand-500 text-white shadow"
        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50")
    }
  >
    {children}
  </button>
);

const AdminDiscount = () => {
  const [activeTab, setActiveTab] = useState("list");

  return (
    <AdminDiscountProvider>
      <div className="p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Quản lý khuyến mãi
          </h1>
          <div className="flex gap-2">
            <TabButton
              isActive={activeTab === "list"}
              onClick={() => setActiveTab("list")}
            >
              Danh sách
            </TabButton>
            <TabButton
              isActive={activeTab === "calendar"}
              onClick={() => setActiveTab("calendar")}
            >
              Lịch
            </TabButton>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white">
          {activeTab === "list" ? <DiscountTable /> : <DiscountCalendar />}
        </div>
      </div>
    </AdminDiscountProvider>
  );
};

export default AdminDiscount;
