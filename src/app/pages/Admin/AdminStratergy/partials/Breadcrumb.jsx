import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <Link
        to="/admin/dashboard"
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Dashboard
      </Link>
      <ChevronRight className="w-4 h-4 text-gray-400" />
      <span className="font-semibold text-gray-900">AI Strategy</span>
    </nav>
  );
};

export default Breadcrumb;
