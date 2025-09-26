import {
  ChevronDown,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const HeaderAdmin = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const popoverRef = useRef(null);
  const userButtonRef = useRef(null);

  // Mock admin data - replace with real data
  const adminData = {
    name: "Admin User",
    email: "admin@avocadoshop.com",
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // TODO(stagewise): Implement actual dark mode toggle functionality
  };

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO(stagewise): Implement search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  const handleAccountSettings = () => {
    setShowPopover(false);
    // TODO(stagewise): Navigate to account settings
    console.log("Navigate to account settings");
  };

  const handleLogout = () => {
    setShowPopover(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // TODO(stagewise): Implement logout functionality and redirect
    window.location.href = "/login";
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(event.target)
      ) {
        setShowPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <header className="h-[80px] bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
        {/* Search Box */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-8 h-8" />
              <input
                type="text"
                placeholder="Search or type command"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-w-[400px] h-[44px] pl-12 pr-4 bg-white rounded-[8px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent "
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="h-[44px] w-[44px] flex items-center justify-center rounded-[50%] border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-600" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* User Section */}
          <div className="relative">
            <button
              ref={userButtonRef}
              onClick={togglePopover}
              className="h-[44px] flex items-center gap-3 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <span className="text-gray-700 font-medium">
                {adminData.name}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Popover */}
            {showPopover && (
              <div
                ref={popoverRef}
                className="absolute right-0 top-full mt-2 w-[290px] h-[209px] bg-white rounded-[15px] shadow-lg border border-gray-200 z-50"
                style={{ flexShrink: 0 }}
              >
                <div className="p-6">
                  {/* Admin Info */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {adminData.name}
                      </h4>
                      <p className="text-sm text-gray-500">{adminData.email}</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2">
                    <button
                      onClick={handleAccountSettings}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-[15px] transition-colors duration-200"
                    >
                      <Settings className="w-5 h-5 text-gray-500" />
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-[15px] transition-colors duration-200"
                    >
                      <LogOut className="w-5 h-5 text-red-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default HeaderAdmin;
