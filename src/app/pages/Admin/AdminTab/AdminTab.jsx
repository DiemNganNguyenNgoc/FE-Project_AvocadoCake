import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import ButtonSideMenuAdmin from "../../../components/ButtonSideMenuAdmin/ButtonSideMenuAdmin";
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
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import HeaderAdmin from "../AdminDashboard/partials/HeaderAdmin";

const navItems = [
  {
    id: "dashboard",
    text: "Dashboard",
    icon: <LayoutDashboard />,
    path: "/admin/dashboard",
    component: AdminDashboard,
  },
  {
    id: "orders",
    text: "Orders",
    icon: <ShoppingBag />,
    path: "/admin/orders",
    component: () => <div>Orders Content</div>,
  },
  {
    id: "products",
    text: "Products",
    icon: <PackageOpen />,
    path: "/admin/products",
    component: () => <div>Products Content</div>,
  },
  {
    id: "discount",
    text: "Discount",
    icon: <TicketPercent />,
    path: "/admin/discount",
    component: () => <div>Discount Content</div>,
  },
  {
    id: "category",
    text: "Category",
    icon: <LibraryBig />,
    path: "/admin/category",
    component: () => <div>Category Content</div>,
  },
  {
    id: "status",
    text: "Status",
    icon: <SquareCheckBig />,
    path: "/admin/status",
    component: () => <div>Status Content</div>,
  },
  {
    id: "users",
    text: "Users",
    icon: <UsersRound />,
    path: "/admin/users",
    component: () => <div>Users Content</div>,
  },
  {
    id: "strategies",
    text: "Strategies",
    icon: <Bot />,
    path: "/admin/strategies",
    component: () => <div>Strategies Content</div>,
  },
  {
    id: "quiz",
    text: "Quiz",
    icon: <Gamepad2 />,
    path: "/admin/quiz",
    component: () => <div>Quiz Content</div>,
  },
  {
    id: "settings",
    text: "Settings",
    icon: <Settings />,
    path: "/admin/settings",
    component: () => <div>Settings Content</div>,
  },
  {
    id: "logout",
    text: "Logout",
    icon: <LogOut />,
    path: "/login",
    component: null,
  },
];

const AdminTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (path) => {
    if (path === "/login") {
      localStorage.removeItem("token");
      navigate(path);
      return;
    }
    navigate(path);
  };

  return (
    <div className="flex h-screen">
      {/* Side Menu */}
      <div className="w-[250px] bg-white shadow-md p-4 flex flex-col flex-shrink-0 h-full">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Avocado Logo" className="h-20 w-auto" />
        </div>
        <div className="space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <ButtonSideMenuAdmin
              key={item.id}
              icon={item.icon}
              text={item.text}
              isActive={location.pathname === item.path}
              onClick={() => handleTabClick(item.path)}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderAdmin />
        <div className="flex-1 overflow-auto">
          <Routes>
            {navItems
              .filter((item) => item.component)
              .map((item) => (
                <Route
                  key={item.id}
                  path={item.path.replace("/admin", "")}
                  element={<item.component />}
                />
              ))}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminTab;
