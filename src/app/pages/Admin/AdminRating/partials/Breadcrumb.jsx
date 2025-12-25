import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link
        to="/admin/dashboard"
        className="flex items-center text-avocado-brown-50 hover:text-avocado-brown-100 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Dashboard
      </Link>
      <ChevronRight className="w-4 h-4 text-avocado-brown-30" />
      <span className="text-avocado-brown-100 font-medium">
        Quản Lý Đánh Giá
      </span>
    </nav>
  );
};

export default Breadcrumb;
