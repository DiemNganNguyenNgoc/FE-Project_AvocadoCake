import React from "react";

const StatCard = ({
  title,
  value,
  change,
  icon,
  color,
  progress,
  subtitle,
  hideProgress,
}) => {
  const hasChange = typeof change === "number" && !Number.isNaN(change);
  const isPositive = hasChange && change >= 0;

  // Extract color name for dynamic styling
  const getColorClasses = (colorClass) => {
    if (colorClass?.includes("blue")) return "from-blue-500 to-blue-600";
    if (colorClass?.includes("green")) return "from-green-500 to-green-600";
    if (colorClass?.includes("purple")) return "from-purple-500 to-purple-600";
    if (colorClass?.includes("orange")) return "from-orange-500 to-orange-600";
    if (colorClass?.includes("red")) return "from-red-500 to-red-600";
    return "from-gray-500 to-gray-600";
  };

  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-50 to-transparent rounded-full transform translate-x-16 -translate-y-16 opacity-50"></div>

      {/* Header section */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-4 rounded-2xl bg-gradient-to-br ${getColorClasses(
            color
          )} shadow-lg transform group-hover:scale-105 transition-transform duration-200`}
        >
          <div className="text-white text-2xl">{icon}</div>
        </div>

        <div className="text-right flex-1 ml-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900 leading-none">
            {value}
          </p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>

      {/* Progress bar */}
      {!hideProgress && typeof progress === "number" && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-gray-700">
              {Math.min(progress, 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${getColorClasses(
                color
              )} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Change indicator */}
      {hasChange && (
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
              isPositive
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isPositive ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span
              className={`text-sm font-semibold ${
                isPositive ? "text-green-700" : "text-red-700"
              }`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span
              className={`text-lg ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? "↗" : "↘"}
            </span>
          </div>

          <div className="text-xs text-gray-400">vs last period</div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
