import React from "react";

const StatsCards = ({ categories }) => {
  const totalCategories = categories.length;
  const activeCategories = categories.filter(
    (cat) => cat.status === "Active"
  ).length;
  const inactiveCategories = categories.filter(
    (cat) => cat.status === "Inactive"
  ).length;
  const cancelledCategories = categories.filter(
    (cat) => cat.status === "Cancel"
  ).length;

  const statsData = [
    {
      title: "Tổng Danh Mục",
      value: totalCategories,
      icon: (
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "bg-gradient-to-br from-blue-100 to-blue-200",
      borderColor: "border-blue-200/50",
      shadowColor: "shadow-blue-100/50",
    },
    {
      title: "Đang Hoạt Động",
      value: activeCategories,
      icon: (
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgGradient: "from-green-50 to-green-100",
      iconBg: "bg-gradient-to-br from-green-100 to-green-200",
      borderColor: "border-green-200/50",
      shadowColor: "shadow-green-100/50",
    },
    {
      title: "Không Hoạt Động",
      value: inactiveCategories,
      icon: (
        <svg
          className="w-8 h-8 text-amber-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.124 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      ),
      bgGradient: "from-amber-50 to-amber-100",
      iconBg: "bg-gradient-to-br from-amber-100 to-amber-200",
      borderColor: "border-amber-200/50",
      shadowColor: "shadow-amber-100/50",
    },
    {
      title: "Đã Hủy",
      value: cancelledCategories,
      icon: (
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgGradient: "from-red-50 to-red-100",
      iconBg: "bg-gradient-to-br from-red-100 to-red-200",
      borderColor: "border-red-200/50",
      shadowColor: "shadow-red-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className={`
            group relative overflow-hidden
            bg-gradient-to-br ${stat.bgGradient}
            rounded-3xl shadow-lg ${stat.shadowColor}
            border ${stat.borderColor}
            p-8 
            hover:shadow-xl hover:scale-[1.02]
            transition-all duration-300 ease-out
            backdrop-blur-sm
          `}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 opacity-5">
            <div className="w-full h-full rounded-full bg-current transform rotate-45"></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col space-y-4">
            {/* Icon Container */}
            <div
              className={`
              self-start p-4 rounded-2xl ${stat.iconBg} 
              shadow-lg backdrop-blur-sm
              group-hover:shadow-xl group-hover:scale-110
              transition-all duration-300 ease-out
            `}
            >
              {stat.icon}
            </div>

            {/* Text Content */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide leading-tight">
                {stat.title}
              </h3>
              <p className="text-4xl font-bold text-gray-800 leading-none group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </p>
            </div>
          </div>

          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
