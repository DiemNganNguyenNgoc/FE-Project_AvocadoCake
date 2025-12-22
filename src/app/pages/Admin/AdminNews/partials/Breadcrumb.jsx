import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const items = [];

    // Home
    items.push({
      label: "Home",
      path: "/",
      isClickable: true,
    });

    // Admin
    if (pathSegments.includes("admin")) {
      items.push({
        label: "Admin",
        path: "/admin",
        isClickable: true,
      });
    }

    // News
    if (pathSegments.includes("news")) {
      items.push({
        label: "Tin Tức",
        path: "/admin/news",
        isClickable: true,
      });
    }

    // Add/Update
    if (pathSegments.includes("add")) {
      items.push({
        label: "Thêm Tin Tức",
        path: null,
        isClickable: false,
      });
    } else if (pathSegments.includes("update")) {
      items.push({
        label: "Cập Nhật Tin Tức",
        path: null,
        isClickable: false,
      });
    }

    return items;
  };

  const handleBreadcrumbClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-6 h-6 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
            {item.isClickable ? (
              <button
                onClick={() => handleBreadcrumbClick(item.path)}
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className="text-sm font-medium text-gray-500">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
