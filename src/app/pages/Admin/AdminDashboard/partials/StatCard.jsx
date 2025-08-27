import React from "react";

const StatCard = ({ title, value, change, icon, color, progress }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              change >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change}%
          </span>
          <span className="text-sm text-gray-500">↑</span>
        </div>

        {progress && (
          <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${color
                .replace("bg-", "bg-")
                .replace("text-", "bg-")} rounded-full`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
