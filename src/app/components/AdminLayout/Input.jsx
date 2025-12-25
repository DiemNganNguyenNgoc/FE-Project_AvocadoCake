import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const Input = forwardRef(
  (
    { label, error, helperText, leftIcon, rightIcon, className = "", ...props },
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
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <div className="text-gray-400">{leftIcon}</div>
            </div>
          )}

          <input
            ref={ref}
            className={`
            block w-full rounded-xl border transition-colors
            ${leftIcon ? "pl-12" : "pl-4"}
            ${rightIcon || error ? "pr-12" : "pr-4"}
            py-3 text-xl
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

          {(rightIcon || error) && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              {error ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <div className="text-gray-400">{rightIcon}</div>
              )}
            </div>
          )}
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

Input.displayName = "Input";

export default Input;
