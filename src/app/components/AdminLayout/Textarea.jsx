import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const Textarea = forwardRef(
  ({ label, error, helperText, rows = 4, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-3">
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            rows={rows}
            className={`
            block w-full rounded-xl border transition-colors resize-none
            px-4 py-3 text-base
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : "border-stroke dark:border-stroke-dark focus:border-primary focus:ring-primary"
            }
            bg-white dark:bg-dark-2 text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
            {...props}
          />

          {error && (
            <div className="absolute top-3 right-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div className="mt-2">
            {error && (
              <p className="text-base text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-base text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
