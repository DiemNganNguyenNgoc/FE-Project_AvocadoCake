import React from "react";
import { ChevronDownIcon, TrashIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";

/**
 * FilterbarComponent - Reusable filter bar component with Catalyst UI design
 * 
 * @param {Object} props
 * @param {Array} props.filters - Array of filter configurations
 * @param {Object} props.pagination - Pagination configuration { itemsPerPage, onChange }
 * @param {Object} props.selection - Selection configuration { count, onClear, onDelete }
 * @param {string} props.itemLabel - Label for items (e.g., "người dùng", "quiz", "sản phẩm")
 * @param {string} props.variant - Style variant: 'default' | 'rounded' | 'modern'
 * @param {string} props.className - Additional CSS classes
 */
const FilterbarComponent = ({
  filters = [],
  pagination = null,
  selection = null,
  itemLabel = "mục",
  variant = "default",
  className = "",
}) => {
  // Variant styles
  const variantStyles = {
    default: {
      select: "rounded-md",
      button: "rounded-md",
      deleteButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      clearButton: "bg-gray-200 hover:bg-gray-300 text-gray-700",
    },
    rounded: {
      select: "rounded-full",
      button: "rounded-full shadow",
      deleteButton: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500",
      clearButton: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    },
    modern: {
      select: "rounded-lg shadow-sm",
      button: "rounded-lg shadow-sm",
      deleteButton: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-red-500",
      clearButton: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700",
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  // Base select styles
  const selectBaseStyles = clsx(
    "appearance-none bg-white border border-gray-300",
    "px-4 py-2.5 pr-10 text-sm font-medium",
    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    "transition-all duration-150",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  );

  return (
    <div className={clsx("flex items-center justify-between mb-6", className)}>
      {/* Left side - Filters and Info */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Dynamic Filters */}
        {filters.map((filter, index) => (
          <div key={index} className="relative min-w-[140px]">
            <select
              value={filter.value}
              onChange={filter.onChange}
              disabled={filter.disabled}
              className={clsx(selectBaseStyles, styles.select)}
              aria-label={filter.label}
            >
              {filter.options.map((option, optIndex) => (
                <option key={optIndex} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}

        {/* Items per page selector */}
        {pagination && (
          <div className="relative min-w-[140px]">
            <select
              value={pagination.itemsPerPage}
              onChange={(e) => pagination.onChange(parseInt(e.target.value))}
              className={clsx(selectBaseStyles, styles.select)}
              aria-label="Items per page"
            >
              <option value={10}>10 / trang</option>
              <option value={25}>25 / trang</option>
              <option value={50}>50 / trang</option>
              <option value={100}>100 / trang</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        )}

        {/* Selection count */}
        {selection && selection.count > 0 && (
          <div className="text-sm text-gray-700 font-medium px-2">
            Đã chọn <span className="text-blue-600 font-semibold">{selection.count}</span> {itemLabel}
          </div>
        )}
      </div>

      {/* Right side - Action Buttons */}
      {selection && (
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {selection.count > 0 && selection.onDelete && (
            <button
              onClick={selection.onDelete}
              className={clsx(
                "inline-flex items-center px-4 py-2.5",
                "text-white text-sm font-semibold",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                "transition-all duration-150",
                styles.button,
                styles.deleteButton
              )}
              aria-label={`Xóa ${selection.count} ${itemLabel} đã chọn`}
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Xóa đã chọn
            </button>
          )}

          {/* Clear selection button */}
          {selection.onClear && (
            <button
              onClick={selection.onClear}
              className={clsx(
                "px-4 py-2.5",
                "text-sm font-semibold",
                "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
                "transition-all duration-150",
                styles.button,
                styles.clearButton
              )}
              aria-label="Bỏ chọn tất cả"
            >
              Bỏ chọn
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterbarComponent;
