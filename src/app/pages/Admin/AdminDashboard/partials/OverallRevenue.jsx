import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const OverallRevenue = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");

  const months = [
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
  ];
  const revenueData = [
    3200, 3780, 2900, 4200, 3800, 4500, 4100, 4800, 5200, 4900, 5500, 5800,
  ];
  const pipelineData = [
    2800, 3200, 2600, 3800, 3400, 4000, 3600, 4200, 4600, 4300, 4800, 5100,
  ];

  const maxValue = Math.max(...revenueData, ...pipelineData);
  const minValue = Math.min(...revenueData, ...pipelineData);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">$35.8K</h3>
          <p className="text-sm text-gray-500">Overall Revenue</p>
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

      <div className="h-64 relative">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={((i + 1) / 5) * 100 + "%"}
              x2="100%"
              y2={((i + 1) / 5) * 100 + "%"}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}

          {/* Revenue line */}
          <polyline
            points={revenueData
              .map(
                (value, index) =>
                  `${(index / (revenueData.length - 1)) * 100},${
                    100 - ((value - minValue) / (maxValue - minValue)) * 80
                  }`
              )
              .join(" ")}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pipeline line */}
          <polyline
            points={pipelineData
              .map(
                (value, index) =>
                  `${(index / (pipelineData.length - 1)) * 100},${
                    100 - ((value - minValue) / (maxValue - minValue)) * 80
                  }`
              )
              .join(" ")}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {revenueData.map((value, index) => (
            <circle
              key={`revenue-${index}`}
              cx={`${(index / (revenueData.length - 1)) * 100}%`}
              cy={`${100 - ((value - minValue) / (maxValue - minValue)) * 80}%`}
              r="4"
              fill="#3b82f6"
            />
          ))}

          {pipelineData.map((value, index) => (
            <circle
              key={`pipeline-${index}`}
              cx={`${(index / (pipelineData.length - 1)) * 100}%`}
              cy={`${100 - ((value - minValue) / (maxValue - minValue)) * 80}%`}
              r="4"
              fill="#10b981"
            />
          ))}
        </svg>

        {/* Month labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
          {months.map((month, index) => (
            <span key={index}>{month}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Pipeline</span>
        </div>
      </div>
    </div>
  );
};

export default OverallRevenue;
