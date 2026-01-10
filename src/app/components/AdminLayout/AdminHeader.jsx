import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Menu,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAdminLanguage } from "../../context/AdminLanguageContext";
import LanguageSelector from "../../pages/Admin/AdminDashboard/partials/LanguageSelector";
import { getRecentOrders } from "../../api/services/OrderService";

const AdminHeader = ({ onToggleSidebar, forceCloseMenus }) => {
  const { t } = useAdminLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const notificationButtonRef = useRef(null);

  // Mock admin data - replace with real data from context/state
  const adminData = {
    name: "Admin User",
    email: "admin@avocadoshop.com",
    avatar: null,
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // TODO: Implement actual dark mode toggle functionality
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all as read when opening
      markAllAsRead();
    }
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification) => {
    // Mark this notification as read
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === notification.id ? { ...notif, isRead: true } : notif
      )
    );

    // Navigate to order detail page
    if (notification.orderId) {
      window.location.href = `/admin/orders/view-detail/${notification.orderId}`;
    }

    setShowNotifications(false);
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return;

      // Call real API to get recent orders
      const response = await getRecentOrders(accessToken, 10);

      if (response && response.data) {
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Transform order data to notification format and filter for today only
        const orderNotifications = response.data
          .filter((order) => {
            const orderDate = new Date(order.createdAt);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === today.getTime();
          })
          .map((order) => ({
            id: order._id,
            type: "new_order",
            orderId: order._id,
            customerName: order.shippingAddress?.fullName || "Khách hàng",
            customerAvatar: null,
            message: "Đã đặt đơn hàng mới",
            amount: `${order.totalPrice?.toLocaleString("vi-VN")}đ`,
            timestamp: new Date(order.createdAt),
            isRead: order.isNotified || false, // Backend cần thêm field này
          }));

        setNotifications(orderNotifications);
        setUnreadCount(orderNotifications.filter((n) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Fetch notifications on mount and every 10 seconds for real-time feel
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);

    if (seconds < 60) return `${seconds} giây trước`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  const handleAccountSettings = () => {
    setShowUserMenu(false);
    // TODO: Navigate to account settings
    console.log("Navigate to account settings");
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // TODO: Implement logout functionality and redirect
    window.location.href = "/login";
  };

  // Đóng menu khi nhận signal từ AdminLayout
  useEffect(() => {
    if (forceCloseMenus > 0) {
      setShowUserMenu(false);
      setShowNotifications(false);
    }
  }, [forceCloseMenus]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }

      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-[1] flex items-center justify-between border-b border-stroke bg-white px-6 py-6 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-8 2xl:px-12">
      {/* ⭐ ĐỔI TỪ z-[5] THÀNH z-[1] */}

      {/* Mobile Menu Button */}
      <button
        onClick={onToggleSidebar}
        className="rounded-xl border px-2 py-2 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <Menu className="w-6 h-6" />
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      {/* Page Title - Hidden on mobile */}
      <div className="max-xl:hidden">
        <h1 className="mb-1 text-2xl font-bold text-dark dark:text-white">
          Dashboard
        </h1>
        <p className="text-lg font-medium">AvocadoCake Admin Panel</p>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-end gap-3 min-[375px]:gap-6">
        {/* Search Box */}
        <div className="relative w-full max-w-[320px]">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-5 py-3 w-full border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-xl"
          />
        </div>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="h-13 w-13 flex items-center justify-center rounded-full border border-stroke bg-white hover:bg-gray-50 transition-colors duration-200 dark:border-stroke-dark dark:bg-dark-2 dark:hover:bg-dark-3"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-dark-5 dark:text-dark-6" />
          ) : (
            <Moon className="w-6 h-6 text-dark-5 dark:text-dark-6" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            ref={notificationButtonRef}
            onClick={toggleNotifications}
            className="relative h-13 w-13 flex items-center justify-center rounded-full border border-stroke bg-white hover:bg-gray-50 transition-colors duration-200 dark:border-stroke-dark dark:bg-dark-2 dark:hover:bg-dark-3"
          >
            <Bell className="w-6 h-6 text-dark-5 dark:text-dark-6" />
            {/* Notification Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-sm text-white flex items-center justify-center font-semibold animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown - Messenger Style */}
          {showNotifications && (
            <div
              ref={notificationMenuRef}
              className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-stroke dark:bg-dark-2 dark:border-stroke-dark z-[2] max-h-[600px] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-stroke dark:border-stroke-dark">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-dark dark:text-white">
                    Thông báo
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                    >
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto flex-1">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-stroke dark:divide-stroke-dark">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`px-6 py-5 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-dark-3 ${
                          !notification.isRead
                            ? "bg-blue-50 dark:bg-blue-900/10"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {notification.customerAvatar ? (
                                <img
                                  src={notification.customerAvatar}
                                  alt={notification.customerName}
                                  className="h-14 w-14 rounded-full object-cover"
                                />
                              ) : (
                                notification.customerName
                                  .charAt(0)
                                  .toUpperCase()
                              )}
                            </div>
                            {/* Order Badge */}
                            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 border-2 border-white dark:border-dark-2 flex items-center justify-center">
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-base text-dark dark:text-white">
                                <span className="font-semibold">
                                  {notification.customerName}
                                </span>{" "}
                                {notification.message}
                              </p>
                              {!notification.isRead && (
                                <div className="h-3 w-3 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                              )}
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                {notification.amount}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                • {notification.orderId}
                              </span>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-dark-3 flex items-center justify-center mb-4">
                      <Bell className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                      Không có thông báo mới
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 text-center">
                      Bạn sẽ nhận được thông báo khi có đơn hàng mới
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-6 py-4 border-t border-stroke dark:border-stroke-dark bg-gray-50 dark:bg-dark-3">
                  <button
                    onClick={() => {
                      window.location.href = "/admin/orders";
                      setShowNotifications(false);
                    }}
                    className="w-full text-center text-base font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    Xem tất cả đơn hàng
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="shrink-0">
          <div className="relative">
            <button
              ref={userButtonRef}
              onClick={toggleUserMenu}
              className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-gray-50 transition-colors duration-200 dark:hover:bg-dark-2"
            >
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                {adminData.avatar ? (
                  <img
                    src={adminData.avatar}
                    alt={adminData.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xl font-medium text-dark dark:text-white">
                  {adminData.name}
                </p>
                <p className="text-sm text-dark-4 dark:text-dark-6">
                  {adminData.email}
                </p>
              </div>
              <ChevronDown className="h-5 w-5 text-dark-4 dark:text-dark-6" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div
                ref={userMenuRef}
                className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-stroke dark:bg-dark-2 dark:border-stroke-dark z-[2]"
              >
                {/* Header with gradient background */}
                <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent rounded-t-2xl border-b border-stroke dark:border-stroke-dark">
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-dark-2">
                        {adminData.avatar ? (
                          <img
                            src={adminData.avatar}
                            alt={adminData.name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white dark:border-dark-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-bold text-dark dark:text-white truncate">
                        {adminData.name}
                      </h4>
                      <p className="text-sm text-dark-4 dark:text-dark-6 truncate">
                        {adminData.email}
                      </p>
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                        Admin
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-3">
                  <div className="space-y-1">
                    <button
                      onClick={handleAccountSettings}
                      className="w-full flex items-center gap-4 px-4 py-3.5 text-left text-dark-5 hover:bg-gray-100 rounded-xl transition-all duration-200 dark:hover:bg-dark-3 dark:text-dark-6 group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-base font-medium">
                          {t("accountSettings")}
                        </span>
                        <span className="block text-xs text-dark-4 dark:text-dark-6">
                          Quản lý tài khoản
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 -rotate-90 text-dark-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-4 py-3.5 text-left text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 dark:hover:bg-red-900/20 group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors dark:bg-red-900/20">
                        <LogOut className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <span className="block text-base font-medium">
                          {t("logout")}
                        </span>
                        <span className="block text-xs text-red-400">
                          Đăng xuất khỏi hệ thống
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 -rotate-90 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
