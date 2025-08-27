import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const RevenueAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");

  const revenueData = [
    { day: "Sun", revenue: 120, pipeline: 180 },
    { day: "Mon", revenue: 150, pipeline: 200 },
    { day: "Tue", revenue: 180, pipeline: 220 },
    { day: "Wed", revenue: 200, pipeline: 240 },
    { day: "Thu", revenue: 160, pipeline: 190 },
    { day: "Fri", revenue: 220, pipeline: 260 },
    { day: "Sat", revenue: 190, pipeline: 230 },
  ];

  const maxValue = Math.max(
    ...revenueData.map((d) => Math.max(d.revenue, d.pipeline))
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Revenue Analytics
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">Total Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Total Pipeline</span>
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
      </div>

      <div className="flex items-end justify-between h-48 mb-4">
        {revenueData.map((data, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 bg-blue-500 rounded-t-sm"
                style={{ height: `${(data.revenue / maxValue) * 120}px` }}
              ></div>
              <div
                className="w-8 bg-green-500 rounded-t-sm"
                style={{ height: `${(data.pipeline / maxValue) * 120}px` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{data.day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-lg font-semibold text-gray-900">
            $
            {revenueData
              .reduce((sum, d) => sum + d.revenue, 0)
              .toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Pipeline</p>
          <p className="text-lg font-semibold text-gray-900">
            $
            {revenueData
              .reduce((sum, d) => sum + d.pipeline, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
