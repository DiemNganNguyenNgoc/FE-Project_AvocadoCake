import React, { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-2 dark:bg-[#020d1a]">
      <AdminSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <AdminHeader onToggleSidebar={toggleSidebar} />

        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-6 md:p-8 2xl:p-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
