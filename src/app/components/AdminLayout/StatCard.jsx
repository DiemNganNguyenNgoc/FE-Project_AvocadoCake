import React from "react";

/**
 * StatCard - Modern statistics card component
 * Redesigned with Gestalt principles and avocado theme
 */
const StatCard = ({
  title,
  value,
  change,
  icon,
  color = "bg-primary",
  subtitle,
}) => {
  const hasChange = typeof change === "number" && !Number.isNaN(change);
  const isPositive = hasChange && change >= 0;

  // Get icon color based on card color prop
  const getIconColor = () => {
    if (color?.includes("blue")) return "text-blue-500";
    if (color?.includes("green")) return "text-green-500";
    if (color?.includes("purple")) return "text-purple-500";
    if (color?.includes("orange")) return "text-orange-500";
    if (color?.includes("red")) return "text-red-500";
    if (color?.includes("primary")) return "text-primary";
    return "text-gray-500";
  };

  return (
    <div className="group relative bg-white dark:bg-gray-dark rounded-2xl border border-gray-100 dark:border-stroke-dark p-8 min-h-[180px] flex flex-col justify-between transition-all duration-300 hover:bg-avocado-green-10 hover:border-avocado-green-50 hover:shadow-lg shadow-md overflow-hidden">
      {/* Icon and Change Badge Row */}
      <div className="flex items-start justify-between mb-4">
        {/* Large Icon without background */}
        <div className="text-5xl transform transition-transform duration-300 group-hover:scale-110">
          <div className={getIconColor()}>
            {React.cloneElement(icon, {
              className: `w-14 h-14 ${getIconColor()}`,
              strokeWidth: 1.5,
            })}
          </div>
        </div>

        {/* Change Indicator Badge */}
        {hasChange && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
              isPositive
                ? "bg-green-50 dark:bg-green-900/20"
                : "bg-red-50 dark:bg-red-900/20"
            }`}
          >
            <span
              className={`text-sm font-bold ${
                isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span
              className={`text-base ${
                isPositive
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? "↗" : "↘"}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="mt-auto">
        {/* Title */}
        <h3 className="text-base font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
          {title}
        </h3>

        {/* Value and Subtitle */}
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <span className="text-base text-gray-500 dark:text-gray-400">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Bottom indicator text */}
      {/* {hasChange && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          so với kỳ trước
        </p>
      )} */}
    </div>
  );
};

export default StatCard;
