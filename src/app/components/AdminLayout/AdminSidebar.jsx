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
  Ticket,
  Award,
} from "lucide-react";
import { useAdminLanguage } from "../../context/AdminLanguageContext";
import logoImg from "../../assets/img/AVOCADO.png";

const AdminSidebar = ({ isOpen, onToggle }) => {
  const { t } = useAdminLanguage();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);

  // Set dashboard as active on initial load
  useEffect(() => {
    if (location.pathname === "/admin" || location.pathname === "/admin/") {
      window.history.replaceState(null, "", "/admin/dashboard");
    }
  }, [location.pathname]);

  const toggleExpanded = (title) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  const navData = [
    {
      label: t("main"),
      items: [
        {
          title: t("dashboard"),
          icon: Home,
          url: "/admin/dashboard",
        },
        // {
        //   title: t('analytics'),
        //   icon: BarChart3,
        //   url: "/admin/dashboard",
        // },
      ],
    },
    {
      label: t("management"),
      items: [
        {
          title: t("products"),
          icon: Package,
          url: "/admin/product",
        },
        {
          title: t("orders"),
          icon: ShoppingCart,
          url: "/admin/orders",
        },
        {
          title: t("users"),
          icon: Users,
          url: "/admin/users",
        },
        {
          title: t("categories"),
          icon: Tag,
          url: "/admin/category",
        },
        {
          title: t("status"),
          icon: CheckSquare,
          url: "/admin/status",
        },
        {
          title: t("discounts"),
          icon: Tag,
          url: "/admin/discount",
        },
        {
          title: t("vouchers"),
          icon: Ticket,
          url: "/admin/voucher",
        },
        {
          title: t("Ranks"),
          icon: Award,
          url: "/admin/rank",
        },
        {
          title: t("recipe"),
          icon: Cake,
          url: "/admin/recipes",
        },
        {
          title: t("quiz"),
          icon: HelpCircle,
          url: "/admin/quiz",
        },
        {
          title: t("aiStrategy"),
          icon: Sparkles,
          url: "/admin/stratergy",
        },
        {
          title: t("ratings"),
          icon: MessageSquare,
          url: "/admin/ratings",
        },
        {
          title: "News",
          icon: Newspaper,
          url: "/admin/newss",
        },
      ],
    },
    {
      label: t("system"),
      items: [
        {
          title: t("language"),
          icon: Globe,
          url: "/admin/language",
        },
        {
          title: t("settings"),
          icon: Settings,
          url: "/admin/settings",
        },
        {
          title: t("uiDemo"),
          icon: Settings,
          url: "/admin/demo",
        },
        {
          title: t("backToHome"),
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
          className={`flex items-center gap-3 py-3 px-3.5 rounded-lg font-medium transition-all duration-200 ${
            isActive
              ? "bg-avocado-green-10 !text-avocado-green-100"
              : "text-dark-4 hover:bg-gray-100 hover:text-dark"
          } ${className}`}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        onClick={onClick}
        className={`flex w-full items-center gap-3 py-3 px-3.5 rounded-lg font-medium transition-all duration-200 ${
          isActive
            ? "bg-avocado-green-30 !text-avocado-green-100"
            : "text-dark-4 hover:bg-gray-100 hover:text-dark"
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
              <img src={logoImg} alt="AvocadoCake Logo" className="h-24" />
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
