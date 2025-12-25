import React, { forwardRef } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";

const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={`
            block w-full rounded-xl border transition-colors appearance-none
            pl-4 pr-12 py-3 text-xl
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-stroke dark:border-stroke-dark focus:border-primary focus:ring-primary"
            }
            bg-white dark:bg-dark-2 text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
            ${className}
          `}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {/* Support both options array and children */}
            {children ||
              options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
          </select>

          {/* Dropdown Icon or Error Icon */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            {error ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {(error || helperText) && (
          <div className="mt-2">
            {error && (
              <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-xl text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
