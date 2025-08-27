import React from "react";

const MonthlyTarget = ({
  progress = 75.55,
  target = 20000,
  revenue = 20000,
  today = 20000,
}) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Monthly Target
        </h3>
        <p className="text-sm text-gray-500">
          Target you've set for each month
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg width="140" height="140" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#3b82f6"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {progress}%
            </span>
            <span className="text-sm text-green-600 font-medium">+10%</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          You earn ${today.toLocaleString()} today, it's higher than last month.
          Keep up your good work!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Target</p>
          <p className="text-lg font-semibold text-gray-900">
            ${target.toLocaleString()} ↓
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Revenue</p>
          <p className="text-lg font-semibold text-gray-900">
            ${revenue.toLocaleString()} ↑
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            ${today.toLocaleString()} ↑
          </p>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTarget;
