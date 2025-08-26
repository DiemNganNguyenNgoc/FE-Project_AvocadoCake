import React, { useState } from "react";
import ButtonSideMenuAdmin from "../../../components/ButtonSideMenuAdmin/ButtonSideMenuAdmin";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  PackageOpen,
  TicketPercent,
  LibraryBig,
  SquareCheckBig,
  UsersRound,
  Bot,
  Settings,
  Gamepad2,
  LogOut,
} from "lucide-react";
import logo from "../../../assets/img/AVOCADO.svg";
import HeaderAdmin from "../../../components/HeaderAdmin/HeaderAdmin";

const AdminTab = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const tabs = [
    {
      id: "dashboard",
      text: "Dashboard",
      icon: <LayoutDashboard />,
      path: "/admin/dashboard",
    },
    {
      id: "orders",
      text: "Orders",
      icon: <ShoppingBag />,
      path: "/admin/order-list",
    },
    {
      id: "products",
      text: "Products",
      icon: <PackageOpen />,
      path: "/admin/products",
    },
    {
      id: "discount",
      text: "Discount",
      icon: <TicketPercent />,
      path: "/admin/discount-list",
    },
    {
      id: "category",
      text: "Category",
      icon: <LibraryBig />,
      path: "/admin/category-list",
    },
    {
      id: "status",
      text: "Status",
      icon: <SquareCheckBig />,
      path: "/admin/status-list",
    },
    {
      id: "users",
      text: "Users",
      icon: <UsersRound />,
      path: "/admin/user-list",
    },
    {
      id: "strategies",
      text: "Strategies",
      icon: <Bot />,
      path: "/admin/strategies",
    },
    {
      id: "quiz",
      text: "Quizz",
      icon: <Gamepad2 />,
      path: "/admin/quiz-list",
    },
    {
      id: "settings",
      text: "Settings",
      icon: <Settings />,
      path: "/admin/settings",
    },
    { id: "logout", text: "Logout", icon: <LogOut />, path: "/login" },
  ];

  const handleTabClick = (tabId, path) => {
    if (tabId === "logout") {
      localStorage.removeItem("token");
      navigate(path);
      return;
    }
    setActiveTab(tabId);
    if (path) navigate(path);
  };

  return (
    <div className="flex h-screen">
      <div className="w-[250px] bg-white shadow-md p-4 flex flex-col flex-shrink-0 h-full">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Avocado Logo" className="h-20 w-auto" />
        </div>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {tabs.map((item) => (
            <ButtonSideMenuAdmin
              key={item.id}
              icon={item.icon}
              text={item.text}
              isActive={activeTab === item.id}
              onClick={() => handleTabClick(item.id, item.path)}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderAdmin />
        <div className="flex-1 p-8"></div>
      </div>
    </div>
  );
};

export default AdminTab;
