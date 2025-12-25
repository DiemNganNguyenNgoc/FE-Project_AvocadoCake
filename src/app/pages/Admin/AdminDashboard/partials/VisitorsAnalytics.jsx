import React, { useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";

const VisitorsAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");

  const visitorsData = {
    total: 2548,
    desktop: 65,
    mobile: 45,
    tablet: 34,
    unknown: 12,
  };

  const colors = ["#3b82f6", "#f97316", "#10b981", "#eab308"];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[2rem] font-semibold text-gray-900 leading-tight">
            Website Visitors
          </h3>
          <p className="text-[1.6rem] text-gray-600">Phân bổ theo thiết bị</p>
        </div>

        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="relative">
          <svg width="220" height="220" className="transform -rotate-90">
            {/* Desktop */}
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke={colors[0]}
              strokeWidth="20"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 80 * 0.65} ${2 * Math.PI * 80}`}
              strokeDashoffset={0}
            />
            {/* Mobile */}
            <circle
              cx="100"
              cy="100"
              r="60"
              stroke={colors[1]}
              strokeWidth="20"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 60 * 0.45} ${2 * Math.PI * 60}`}
              strokeDashoffset={-2 * Math.PI * 60 * 0.65}
            />
            {/* Tablet */}
            <circle
              cx="100"
              cy="100"
              r="40"
              stroke={colors[2]}
              strokeWidth="20"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40 * 0.34} ${2 * Math.PI * 40}`}
              strokeDashoffset={-2 * Math.PI * 40 * 0.79}
            />
            {/* Unknown */}
            <circle
              cx="100"
              cy="100"
              r="20"
              stroke={colors[3]}
              strokeWidth="20"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 20 * 0.12} ${2 * Math.PI * 20}`}
              strokeDashoffset={-2 * Math.PI * 20 * 0.88}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[2rem] font-bold text-gray-900 leading-none">
              {visitorsData.total}
            </span>
            <span className="text-[1.6rem] text-gray-600">Visitors</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-700">Desktop</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {visitorsData.desktop}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm text-gray-700">Mobile</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {visitorsData.mobile}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Tablet</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {visitorsData.tablet}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-700">Unknown</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {visitorsData.unknown}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default VisitorsAnalytics;
