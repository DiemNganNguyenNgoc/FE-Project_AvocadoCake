import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DashboardService } from "../services/dashboardService";

const periodOptions = [
  { label: "Monthly", value: "Monthly" },
  { label: "Weekly", value: "Weekly" },
  { label: "Daily", value: "Daily" },
];

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
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl border border-gray-100 p-8 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
          Revenue Analytics
        </h3>

        <div className="flex items-center gap-7">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 shadow"></span>
            <span className="text-sm text-gray-500 font-medium">
              Total Revenue
            </span>
          </div>

          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm text-gray-800 shadow transition-all outline-none focus:ring-2 focus:ring-blue-300 hover:border-blue-200"
            >
              {periodOptions.map((option) => (
                <option key={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-6 items-end justify-between h-52 mb-6">
        {revenueData.map((data, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="w-14 rounded-t-2xl bg-gradient-to-t from-blue-500 via-blue-300 to-blue-100 transition-all duration-300 shadow hover:scale-105"
              style={{
                height: `${((data.revenue || 0) / maxValue) * 160}px`,
              }}
              title={`Revenue: $${data.revenue?.toLocaleString() ?? 0}`}
            ></div>
            <span className="text-xs text-gray-400 font-medium mt-1">
              {data.day}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center bg-white/70 rounded-2xl py-6 shadow-inner">
        <div>
          <p className="text-lg text-gray-500 mb-1 font-medium">
            Total Revenue
          </p>
          <p className="text-2xl font-bold text-gray-900 tracking-wide">
            $
            {revenueData
              .reduce((sum, d) => sum + (d.revenue || 0), 0)
              .toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
