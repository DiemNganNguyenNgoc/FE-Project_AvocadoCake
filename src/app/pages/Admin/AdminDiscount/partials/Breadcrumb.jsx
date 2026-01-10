import React from "react";
import { ChevronRight, Home } from "lucide-react";

const Breadcrumb = ({ currentPage = "Quiz" }) => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a
            href="#"
            className="inline-flex items-center text-lg font-medium text-gray-700 hover:text-blue-600"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="ml-1 text-lg font-medium text-gray-500 md:ml-2">
              {currentPage}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
