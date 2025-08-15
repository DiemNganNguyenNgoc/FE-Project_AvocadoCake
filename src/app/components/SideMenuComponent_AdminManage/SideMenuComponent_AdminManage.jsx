import React from "react";
import "./SideMenuComponent_AdminManage.css";

const SideMenuComponent_AdminManage = ({ activeTab, handleTabClick }) => {
  const tabs = [
    {
      id: "store-info",
      label: "Thông tin cửa hàng",
      path: "/admin/store-info",
    },
    { id: "order", label: "Đơn hàng", path: "/admin/order-list" },
    { id: "discount", label: "Khuyến mãi", path: "/admin/discount-list" },
    { id: "status", label: "Trạng thái", path: "/admin/status-list" },
    { id: "category", label: "Loại sản phẩm", path: "/admin/category-list" },
    { id: "user", label: "Danh sách người dùng", path: "/admin/user-list" },
    { id: "report", label: "Thống kê", path: "/admin/report" },
    { id: "quiz", label: "Gợi ý", path: "/admin/list-quiz" },
  ];

  return (
    <div className="side-menu sticky-left">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`btn__side-menu ${activeTab === tab.id ? "active" : ""}`}
          role="group"
          aria-label="Vertical button group"
        >
          <button
            className={`btn__component ${
              activeTab === tab.id ? "active-btn" : ""
            }`}
            onClick={() => handleTabClick(tab.id, tab.path)}
          >
            {tab.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SideMenuComponent_AdminManage;
