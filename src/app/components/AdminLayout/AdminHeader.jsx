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

const AdminHeader = ({ onToggleSidebar, forceCloseMenus }) => {
  const { t } = useAdminLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef(null);
  const userButtonRef = useRef(null);

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
            className="pl-12 pr-5 py-3 w-full border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base"
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
        <button className="relative h-13 w-13 flex items-center justify-center rounded-full border border-stroke bg-white hover:bg-gray-50 transition-colors duration-200 dark:border-stroke-dark dark:bg-dark-2 dark:hover:bg-dark-3">
          <Bell className="w-6 h-6 text-dark-5 dark:text-dark-6" />
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-sm text-white flex items-center justify-center">
            3
          </span>
        </button>

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
                <p className="text-base font-medium text-dark dark:text-white">
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
                className="absolute right-0 top-full mt-3 w-72 bg-white rounded-xl shadow-lg border border-stroke dark:bg-dark-2 dark:border-stroke-dark z-[2]"
              >
                {/* ⭐ THÊM z-[2] VÀO ĐÂY để dropdown menu cao hơn header nhưng thấp hơn modal */}

                <div className="p-6">
                  {/* User Info */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stroke dark:border-stroke-dark">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      {adminData.avatar ? (
                        <img
                          src={adminData.avatar}
                          alt={adminData.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-7 w-7 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-dark dark:text-white">
                        {adminData.name}
                      </h4>
                      <p className="text-base text-dark-4 dark:text-dark-6">
                        {adminData.email}
                      </p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2">
                    <button
                      onClick={handleAccountSettings}
                      className="w-full flex items-center gap-4 px-4 py-3 text-left text-dark-5 hover:bg-gray-50 rounded-xl transition-colors duration-200 dark:hover:bg-dark-3 dark:text-dark-6 text-base"
                    >
                      <Settings className="h-5 w-5" />
                      <span>{t("accountSettings")}</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-4 py-3 text-left text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200 dark:hover:bg-red-900/20 text-base"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>{t("logout")}</span>
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
