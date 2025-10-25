import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
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
  Cake,
} from "lucide-react";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import AdminCategory from "../AdminCategory/AdminCategory";
import AddCategory from "../AdminCategory/usecases/AddCategory";
import UpdateCategory from "../AdminCategory/usecases/UpdateCategory";
import AdminStatus from "../AdminStatus/AdminStatus";
import AddStatus from "../AdminStatus/usecases/AddStatus";
import UpdateStatus from "../AdminStatus/usecases/UpdateStatus";
import AdminLanguage from "../AdminLanguage/AdminLanguage";
import AddLanguage from "../AdminLanguage/usecases/AddLanguage";
import EditLanguage from "../AdminLanguage/usecases/EditLanguage";
import AdminOrder from "../AdminOrder/AdminOrder";
import UpdateOrderStatus from "../AdminOrder/usecases/UpdateOrderStatus";
import ViewOrderDetail from "../AdminOrder/usecases/ViewOrderDetail";
import AdminUser from "../AdminUser/AdminUser";
import AdminQuiz from "../AdminQuiz/AdminQuiz";
import AdminDiscount from "../AdminDiscount";
import AdminProduct from "../AdminProduct/AdminProduct";
import AdminSetting from "../AdminSetting/AdminSetting";
import StoreInfo from "../AdminSetting/usecases/StoreInfo";
import LogoSettings from "../AdminSetting/usecases/LogoSettings";
import PaymentSettings from "../AdminSetting/usecases/PaymentSettings";
import SEOSettings from "../AdminSetting/usecases/SEOSettings";
import ThemeSettings from "../AdminSetting/usecases/ThemeSettings";
import NotificationSettings from "../AdminSetting/usecases/NotificationSettings";
import ShippingSettings from "../AdminSetting/usecases/ShippingSettings";
import HomeAdminPage from "../HomeAdminPage/HomeAdminPage";
import AdminDemo from "../AdminDemo/AdminDemo";
import AdminRecipe from "../AdminRecipe";

// Configuration cho từng module - dễ mở rộng
const moduleConfigs = {
  category: {
    main: AdminCategory,
    subPages: {
      add: AddCategory,
      update: UpdateCategory,
    },
    basePath: "/admin/category",
  },
  // Dễ dàng thêm module mới
  status: {
    main: AdminStatus,
    subPages: {
      add: AddStatus,
      update: UpdateStatus,
    },
    basePath: "/admin/status",
  },
  language: {
    main: AdminLanguage,
    subPages: {
      add: AddLanguage,
      edit: EditLanguage,
    },
    basePath: "/admin/language",
  },
  orders: {
    main: AdminOrder,
    subPages: {
      "update-status": UpdateOrderStatus,
      "view-detail": ViewOrderDetail,
      "view-detail/:orderId": ViewOrderDetail,
    },
    basePath: "/admin/orders",
  },
  settings: {
    main: AdminSetting,
    subPages: {
      storeInfo: StoreInfo,
      logo: LogoSettings,
      payment: PaymentSettings,
      seo: SEOSettings,
      theme: ThemeSettings,
      notification: NotificationSettings,
      shipping: ShippingSettings,
    },
    basePath: "/admin/settings",
  },
};

const navItems = [
  {
    id: "home",
    text: "Dashboard",
    icon: <LayoutDashboard />,
    path: "/admin/",
    component: HomeAdminPage,
  },
  {
    id: "dashboard",
    text: "Analytics",
    icon: <LayoutDashboard />,
    path: "/admin/dashboard",
    component: AdminDashboard,
  },
  {
    id: "orders",
    text: "Orders",
    icon: <ShoppingBag />,
    path: "/admin/orders",
    component: AdminOrder,
  },
  {
    id: "products",
    text: "Products",
    icon: <PackageOpen />,
    path: "/admin/product",
    component: AdminProduct,
  },
  {
    id: "discount",
    text: "Discount",
    icon: <TicketPercent />,
    path: "/admin/discount",
    component: AdminDiscount,
  },
  {
    id: "category",
    text: "Category",
    icon: <LibraryBig />,
    path: "/admin/category",
    component: AdminCategory,
  },
  {
    id: "status",
    text: "Status",
    icon: <SquareCheckBig />,
    path: "/admin/status",
    component: AdminStatus,
  },
  {
    id: "language",
    text: "Language",
    icon: <LibraryBig />,
    path: "/admin/language",
    component: AdminLanguage,
  },
  {
    id: "users",
    text: "Users",
    icon: <UsersRound />,
    path: "/admin/users",
    component: AdminUser,
  },
  {
    id: "strategies",
    text: "Strategies",
    icon: <Bot />,
    path: "/admin/strategies",
    component: () => <div>Strategies Content</div>,
  },
  {
    id: "recipes",
    text: "Recipes",
    icon: <Cake />,
    path: "/admin/recipes",
    component: AdminRecipe,
  },
  {
    id: "quiz",
    text: "Quiz",
    icon: <Gamepad2 />,
    path: "/admin/quiz",
    component: AdminQuiz,
  },
  {
    id: "settings",
    text: "Settings",
    icon: <Settings />,
    path: "/admin/settings",
    component: AdminSetting,
  },
  {
    id: "demo",
    text: "UI Demo",
    icon: <Settings />,
    path: "/admin/demo",
    component: AdminDemo,
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
  const [currentView, setCurrentView] = useState("main");
  const [currentModule, setCurrentModule] = useState(null);

  const handleTabClick = (path) => {
    if (path === "/login") {
      localStorage.removeItem("token");
      navigate(path);
      return;
    }

    // Reset to main view when clicking main tabs
    setCurrentView("main");
    setCurrentModule(null);
    navigate(path);
  };

  // Generic navigation handler - tái sử dụng cho mọi module
  const handleModuleNavigation = (moduleId, view) => {
    const moduleConfig = moduleConfigs[moduleId];
    if (!moduleConfig) return;

    setCurrentModule(moduleId);
    setCurrentView(view);

    // Update URL
    if (view === "main") {
      navigate(moduleConfig.basePath);
    } else {
      navigate(`${moduleConfig.basePath}/${view}`);
    }
  };

  // Generic back handler - tái sử dụng cho mọi module
  const handleBackToModule = (moduleId) => {
    const moduleConfig = moduleConfigs[moduleId];
    if (!moduleConfig) return;

    setCurrentView("main");
    setCurrentModule(null);
    navigate(moduleConfig.basePath);
  };

  // Render current view based on state - tái sử dụng cho mọi module
  const renderCurrentView = () => {
    // Nếu đang ở sub-page của một module
    if (currentModule && currentView !== "main") {
      const moduleConfig = moduleConfigs[currentModule];
      const SubPageComponent = moduleConfig.subPages[currentView];

      if (SubPageComponent) {
        return (
          <SubPageComponent onBack={() => handleBackToModule(currentModule)} />
        );
      }
    }

    // Render main views
    return (
      <Routes>
        {navItems
          .filter((item) => item.component)
          .map((item) => (
            <Route
              key={item.id}
              path={item.path.replace("/admin", "")}
              element={
                // Nếu là module có config, truyền navigation handler
                moduleConfigs[item.id] ? (
                  <item.component
                    onNavigate={(view) => handleModuleNavigation(item.id, view)}
                  />
                ) : (
                  <item.component />
                )
              }
            />
          ))}

        {/* Dynamic routes for modules */}
        {Object.entries(moduleConfigs).map(([moduleId, config]) =>
          Object.entries(config.subPages).map(([view, Component]) => (
            <Route
              key={`${moduleId}-${view}`}
              path={`${config.basePath.replace("/admin", "")}/${view}`}
              element={
                <Component onBack={() => handleBackToModule(moduleId)} />
              }
            />
          ))
        )}
      </Routes>
    );
  };

  return <AdminLayout>{renderCurrentView()}</AdminLayout>;
};

export default AdminTab;
