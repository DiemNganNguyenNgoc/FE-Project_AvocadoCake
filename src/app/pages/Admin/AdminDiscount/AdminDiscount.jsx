import React, { useState } from "react";
import { AdminDiscountProvider, useAdminDiscount } from "./adminDiscountStore";
import DiscountTable from "./partials/DiscountTable";
import DiscountCalendar from "./partials/DiscountCalendar";
import TabButton from "./partials/TabButton";
import AddDiscount from "./usecases/AddDiscount";
import UpdateDiscount from "./usecases/UpdateDiscount";
import { Button } from "../../../components/AdminLayout";

const AdminDiscountContent = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [selectedDiscountId, setSelectedDiscountId] = useState(null);
  const { addDiscount, updateDiscountById, error } = useAdminDiscount();

  const handleAddDiscount = async (newDiscount) => {
    try {
      await addDiscount(newDiscount);
      setActiveTab("list");
    } catch (err) {
      console.error("Failed to add discount:", err);
    }
  };

  const handleUpdateDiscount = async (id, updatedDiscount) => {
    try {
      await updateDiscountById(id, updatedDiscount);
      setActiveTab("list");
      setSelectedDiscountId(null);
    } catch (err) {
      console.error("Failed to update discount:", err);
    }
  };

  const handleEditDiscount = (discount) => {
    setSelectedDiscountId(discount._id);
    setActiveTab("update");
  };

  const handleCancelUpdate = () => {
    setSelectedDiscountId(null);
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Quản lý khuyến mãi
              </h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-3 p-2 rounded-2xl ">
              <Button
                isActive={activeTab === "list"}
                onClick={() => setActiveTab("list")}
                icon={
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                }
              >
                Danh sách
              </Button>
              <Button
                isActive={activeTab === "calendar"}
                onClick={() => setActiveTab("calendar")}
                icon={
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                }
              >
                Lịch
              </Button>
              <Button
                isActive={activeTab === "add"}
                onClick={() => setActiveTab("add")}
                icon={
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                }
              >
                Thêm mới
              </Button>
            </div>
          </div>
        </div>

        {/* Global Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {activeTab === "list" && (
            <DiscountTable onEdit={handleEditDiscount} />
          )}
          {activeTab === "calendar" && (
            <DiscountCalendar onEdit={handleEditDiscount} />
          )}
          {activeTab === "add" && <AddDiscount onSubmit={handleAddDiscount} />}
          {activeTab === "update" && selectedDiscountId && (
            <UpdateDiscount
              discountId={selectedDiscountId} // Pass the selected discount ID
              onSubmit={handleUpdateDiscount}
              onCancel={handleCancelUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDiscount = () => {
  return (
    <AdminDiscountProvider>
      <AdminDiscountContent />
    </AdminDiscountProvider>
  );
};

export default AdminDiscount;
