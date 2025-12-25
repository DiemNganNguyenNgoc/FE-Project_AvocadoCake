import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * PeriodPicker - Time period selector component
 */
const PeriodPicker = ({ value, onChange, options = [] }) => {
  const defaultOptions = options.length
    ? options
    : [
        { label: "Hàng tháng", value: "monthly" },
        { label: "Hàng tuần", value: "weekly" },
        { label: "Hàng ngày", value: "daily" },
      ];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="appearance-none rounded-md border border-stroke bg-white px-4 py-2 pr-10 text-sm font-medium text-dark outline-none transition-colors hover:border-primary focus:border-primary dark:border-dark-3 dark:bg-gray-dark dark:text-white"
      >
        {defaultOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-4 dark:text-dark-6" />
    </div>
  );
};

export default PeriodPicker;
