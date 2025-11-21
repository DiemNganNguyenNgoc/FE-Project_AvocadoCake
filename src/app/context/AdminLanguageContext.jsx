import React, { createContext, useContext, useState, useEffect } from "react";

// Translations
const translations = {
  en: {
    // Header
    search: "Search or type command",
    accountSettings: "Account Settings",
    logout: "Log Out",

    // Sidebar - Main
    main: "MAIN",
    dashboard: "Dashboard",
    analytics: "Analytics",

    // Sidebar - Management
    management: "MANAGEMENT",
    products: "Products",
    orders: "Orders",
    users: "Users",
    categories: "Categories",
    status: "Status",
    discounts: "Discounts",
    vouchers: "Vouchers",
    recipe: "Recipe",
    quiz: "Quiz",
    aiStrategy: "AI Strategy",

    // Sidebar - System
    system: "SYSTEM",
    language: "Language",
    settings: "Settings",
    uiDemo: "UI Demo",
    backToHome: "Back to home",

    // Dashboard
    dashboardTitle: "Dashboard",
    dashboardSubtitle: "Overview of business activities this week",

    // Stats Cards
    newOrdersThisWeek: "New Orders This Week",
    newCustomersThisWeek: "New Customers This Week",
    newProductsThisWeek: "New Products This Week",
    totalUsers: "Total Users",
    totalOrders: "Total Orders",
    productsSold: "Products Sold",
    totalRevenue: "Total Revenue",
    lastWeek: "Last week",
    progress: "Progress",
    vsLastPeriod: "vs last period",

    // Charts
    revenueOverview: "Revenue Overview",
    recentOrders: "Recent Orders",
    recentOrdersSubtitle: "List of latest orders",
    topProducts: "Top Products",
    topProductsSubtitle: "Top selling products",

    // Orders
    orderCode: "Order Code",
    customer: "Customer",
    value: "Value",
    statusLabel: "Status",
    all: "All",
    delivered: "Delivered",
    processing: "Processing",
    cancelled: "Cancelled",
    pending: "Pending",
    viewAll: "View All",

    // Products
    sold: "Sold",
    revenue: "Revenue",
    noData: "No data available",

    // Business Overview
    businessPerformance: "Business Performance Overview",
    trackKeyMetrics: "Track important business metrics",
    compareMonth: "Compare Month",
    compareYear: "Compare Year",
    sales: "Sales",
    quantity: "Quantity",
    profit: "Profit",

    // Language Selector
    selectLanguage: "Select Language",
    english: "English",
    vietnamese: "Vietnamese",

    // Product Visibility
    productVisibility: "Visibility",
    visible: "Visible",
    hidden: "Hidden",
    hideProduct: "Hide from customers",
    showProduct: "Show to customers",
    hideProductConfirm:
      "Are you sure you want to hide this product from customers?",
    showProductConfirm:
      "Are you sure you want to show this product to customers?",
  },
  vi: {
    // Header
    search: "Tìm kiếm hoặc nhập lệnh",
    accountSettings: "Cài đặt tài khoản",
    logout: "Đăng xuất",

    // Sidebar - Main
    main: "CHÍNH",
    dashboard: "Bảng điều khiển",
    analytics: "Phân tích",

    // Sidebar - Management
    management: "QUẢN LÝ",
    products: "Sản phẩm",
    orders: "Đơn hàng",
    users: "Người dùng",
    categories: "Danh mục",
    status: "Trạng thái",
    discounts: "Giảm giá",
    vouchers: "Voucher",
    recipe: "Công thức",
    quiz: "Câu đố",
    aiStrategy: "Chiến lược AI",

    // Sidebar - System
    system: "HỆ THỐNG",
    language: "Ngôn ngữ",
    settings: "Cài đặt",
    uiDemo: "Demo UI",
    backToHome: "Về trang chủ",

    // Dashboard
    dashboardTitle: "Bảng điều khiển",
    dashboardSubtitle: "Tổng quan về hoạt động kinh doanh tuần này",

    // Stats Cards
    newOrdersThisWeek: "Đơn hàng mới tuần này",
    newCustomersThisWeek: "Khách hàng mới tuần này",
    newProductsThisWeek: "Sản phẩm mới tuần này",
    totalUsers: "Tổng người dùng",
    totalOrders: "Tổng đơn hàng",
    productsSold: "Sản phẩm đã bán",
    totalRevenue: "Tổng doanh thu",
    lastWeek: "Tuần trước",
    progress: "Tiến độ",
    vsLastPeriod: "so với kỳ trước",

    // Charts
    revenueOverview: "Tổng quan doanh thu",
    recentOrders: "Đơn hàng gần đây",
    recentOrdersSubtitle: "Danh sách đơn hàng mới nhất",
    topProducts: "Sản phẩm bán chạy",
    topProductsSubtitle: "Top sản phẩm có doanh số cao nhất",

    // Orders
    orderCode: "Mã đơn hàng",
    customer: "Khách hàng",
    value: "Giá trị",
    statusLabel: "Trạng thái",
    all: "Tất cả",
    delivered: "Đã giao",
    processing: "Đang xử lý",
    cancelled: "Đã hủy",
    pending: "Chờ xử lý",
    viewAll: "Xem tất cả",

    // Products
    sold: "Đã bán",
    revenue: "Doanh thu",
    noData: "Không có dữ liệu",

    // Business Overview
    businessPerformance: "Toàn cảnh hiệu suất kinh doanh",
    trackKeyMetrics: "Theo dõi các chỉ số kinh doanh quan trọng",
    compareMonth: "So sánh tháng",
    compareYear: "So sánh năm",
    sales: "Doanh thu",
    quantity: "Số lượng bán",
    profit: "Lợi nhuận",

    // Language Selector
    selectLanguage: "Chọn ngôn ngữ",
    english: "Tiếng Anh",
    vietnamese: "Tiếng Việt",

    // Product Visibility
    productVisibility: "Hiển thị",
    visible: "Hiển thị",
    hidden: "Ẩn",
    hideProduct: "Ẩn khỏi khách hàng",
    showProduct: "Hiển thị cho khách hàng",
    hideProductConfirm:
      "Bạn có chắc chắn muốn ẩn sản phẩm này khỏi khách hàng?",
    showProductConfirm:
      "Bạn có chắc chắn muốn hiển thị sản phẩm này cho khách hàng?",
  },
};

// Create context
const AdminLanguageContext = createContext();

// Custom hook to use the language context
export const useAdminLanguage = () => {
  const context = useContext(AdminLanguageContext);
  if (!context) {
    throw new Error(
      "useAdminLanguage must be used within AdminLanguageProvider"
    );
  }
  return context;
};

// Provider component
export const AdminLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Get from localStorage or default to 'vi'
    return localStorage.getItem("adminLanguage") || "vi";
  });

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem("adminLanguage", language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
    }
  };

  const value = {
    language,
    changeLanguage,
    t,
  };

  return (
    <AdminLanguageContext.Provider value={value}>
      {children}
    </AdminLanguageContext.Provider>
  );
};

export default AdminLanguageContext;
