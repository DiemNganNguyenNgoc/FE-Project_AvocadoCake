import React, { forwardRef } from "react";

const Checkbox = forwardRef(
  ({ label, description, className = "", ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex items-center h-6">
          <input
            ref={ref}
            type="checkbox"
            className={`
            w-5 h-5 rounded border-2 transition-all
            border-stroke dark:border-stroke-dark
            text-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50
            bg-white dark:bg-dark-2
            checked:bg-primary checked:border-primary
            hover:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            cursor-pointer
            ${className}
          `}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label className="text-base font-medium text-gray-700 dark:text-white cursor-pointer select-none">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
