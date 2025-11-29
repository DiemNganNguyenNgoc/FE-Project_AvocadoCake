import React from "react";
import { ChevronRight } from "lucide-react";

const Breadcrumb = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <span className="text-avocado-brown-50">Trang chủ</span>
      <ChevronRight className="w-4 h-4 text-avocado-brown-50" />
      <span className="text-avocado-brown-100 font-medium">Quản lý Rank</span>
    </nav>
  );
};

export default Breadcrumb;
