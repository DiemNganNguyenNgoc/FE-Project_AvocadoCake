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
  // Variant styles - Theo design system AvocadoCake
  const variantStyles = {
    default: {
      select: "rounded-lg",
      button: "rounded-lg",
      deleteButton: "bg-red-500 hover:bg-red-600 focus:ring-red-300",
      clearButton:
        "bg-avocado-green-10 hover:bg-avocado-green-30 text-avocado-brown-100",
    },
    rounded: {
      select: "rounded-full",
      button: "rounded-full shadow",
      deleteButton: "bg-red-500 hover:bg-red-600 focus:ring-red-300",
      clearButton:
        "bg-avocado-green-10 hover:bg-avocado-green-30 text-avocado-brown-100",
    },
    modern: {
      select: "rounded-lg shadow-sm",
      button: "rounded-lg shadow-sm",
      deleteButton:
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-red-300",
      clearButton:
        "bg-white border border-avocado-brown-30 hover:bg-avocado-green-10 text-avocado-brown-100",
    },
  };

  const styles = variantStyles[variant] || variantStyles.default;

  // Base select styles - Theo design system AvocadoCake
  const selectBaseStyles = clsx(
    "appearance-none bg-white border border-avocado-brown-30",
    "px-4 py-2.5 pr-10 text-sm font-medium text-avocado-brown-100",
    "focus:outline-none focus:ring-2 focus:ring-avocado-green-30 focus:border-avocado-green-100",
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
            Đã chọn{" "}
            <span className="text-blue-600 font-semibold">
              {selection.count}
            </span>{" "}
            {itemLabel}
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
