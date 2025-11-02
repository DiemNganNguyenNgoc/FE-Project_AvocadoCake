import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FileText,
  Settings,
  BarChart3,
  Gift,
  HelpCircle,
  Globe,
  CheckSquare,
  Store,
  MessageSquare,
  Newspaper,
  ArrowLeft,
  ChevronUp,
  Cake,
  Sparkles,
  LogOut,
} from "lucide-react";

const AdminSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleExpanded = (title) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  const navData = [
    {
      label: "MAIN",
      items: [
        {
          title: "Dashboard",
          icon: Home,
          url: "/admin/dashboard ",
        },
        // {
        //   title: "Analytics",
        //   icon: BarChart3,
        //   url: "/admin/dashboard",
        // },
      ],
    },
    {
      label: "MANAGEMENT",
      items: [
        {
          title: "Products",
          icon: Package,
          url: "/admin/product",
        },
        {
          title: "Orders",
          icon: ShoppingCart,
          url: "/admin/orders",
        },
        {
          title: "Users",
          icon: Users,
          url: "/admin/users",
        },
        {
          title: "Categories",
          icon: Tag,
          url: "/admin/category",
        },
        {
          title: "Status",
          icon: CheckSquare,
          url: "/admin/status",
        },
        {
          title: "Discounts",
          icon: Tag,
          url: "/admin/discount",
        },
        {
          title: "Recipe",
          icon: Cake,
          url: "/admin/recipes",
        },
        {
          title: "Quiz",
          icon: HelpCircle,
          url: "/admin/quiz",
        },
        {
          title: "AI Strategy",
          icon: Sparkles,
          url: "/admin/stratergy",
        },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        {
          title: "Language",
          icon: Globe,
          url: "/admin/language",
        },
        {
          title: "Settings",
          icon: Settings,
          url: "/admin/settings",
        },
        {
          title: "UI Demo",
          icon: Settings,
          url: "/admin/demo",
        },
        {
          title: "Back to home",
          icon: LogOut,
          url: "/",
        },
      ],
    },
  ];

  const isActive = (url) => {
    return location.pathname === url;
  };

  const MenuItem = ({ item, isActive, onClick, children, className = "" }) => {
    if (item.url) {
      return (
        <Link
          to={item.url}
          onClick={onClick}
          className={`flex items-center gap-3 py-3 px-3.5 rounded-lg font-medium text-dark-4 transition-all duration-200 hover:bg-gray-100 hover:text-dark ${
            isActive ? "bg-[rgba(87,80,241,0.07)] text-primary" : ""
          } ${className}`}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 py-3 px-3.5 rounded-lg font-medium text-dark-4 transition-all duration-200 hover:bg-gray-100 hover:text-dark ${
          isActive ? "bg-[rgba(87,80,241,0.07)] text-primary" : ""
        } ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear ${
          isOpen ? "w-full" : "w-0"
        } ${
          window.innerWidth < 1024
            ? "fixed bottom-0 top-0 z-40"
            : "sticky top-0 h-screen"
        }`}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          {/* Logo */}
          <div className="relative pr-4.5">
            <Link
              to="/admin/dashboard"
              onClick={() => window.innerWidth < 1024 && onToggle()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-dark">AvocadoCake</span>
              </div>
            </Link>

            {window.innerWidth < 1024 && (
              <button
                onClick={onToggle}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>
                <ArrowLeft className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {navData.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-dark-4">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(({ url }) =>
                                isActive(url)
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              <item.icon
                                className="size-6 shrink-0"
                                aria-hidden="true"
                              />
                              <span>{item.title}</span>
                              <ChevronUp
                                className={`ml-auto rotate-180 transition-transform duration-200 ${
                                  expandedItems.includes(item.title)
                                    ? "rotate-0"
                                    : ""
                                }`}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul
                                className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                role="menu"
                              >
                                {item.items.map((subItem) => (
                                  <li key={subItem.title} role="none">
                                    <MenuItem
                                      item={subItem}
                                      isActive={isActive(subItem.url)}
                                    >
                                      <span>{subItem.title}</span>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <MenuItem
                            item={item}
                            isActive={isActive(item.url)}
                            className="flex items-center gap-3 py-3"
                          >
                            <item.icon
                              className="size-6 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{item.title}</span>
                          </MenuItem>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
