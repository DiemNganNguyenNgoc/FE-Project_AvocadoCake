import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const RevenueAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");

  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await DashboardService.getDashboardData();
        setWeekly(data.revenue.weekly || []);
      } catch (e) {
        setWeekly([]);
      }
    };
    load();
  }, []);

  const revenueData = useMemo(() => weekly, [weekly]);
  const maxValue = Math.max(
    1,
    ...revenueData.map((d) => Math.max(d.revenue || 0, d.pipeline || 0))
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[2rem] font-semibold text-gray-900 leading-tight">
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

      <div className="flex items-end justify-between h-48 mb-3">
        {revenueData.map((data, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-8 bg-blue-500 rounded-t-sm"
                style={{
                  height: `${((data.revenue || 0) / maxValue) * 120}px`,
                }}
              ></div>
              <div
                className="w-8 bg-green-500 rounded-t-sm"
                style={{
                  height: `${((data.pipeline || 0) / maxValue) * 120}px`,
                }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">{data.day}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-[1.6rem] text-gray-600 mb-1">Total Revenue</p>
          <p className="text-[2rem] font-semibold text-gray-900">
            $
            {revenueData
              .reduce((sum, d) => sum + d.revenue, 0)
              .toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[1.6rem] text-gray-600 mb-1">Total Pipeline</p>
          <p className="text-[2rem] font-semibold text-gray-900">
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
