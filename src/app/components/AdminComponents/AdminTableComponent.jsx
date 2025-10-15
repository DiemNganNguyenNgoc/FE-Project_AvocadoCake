import React from "react";
import clsx from "clsx";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";

/**
 * AdminTableComponent - Reusable table component theo design system AvocadoCake
 * Tuân thủ nguyên tắc Gestalt và responsive design
 *
 * @param {Object} props
 * @param {Array} props.columns - Table columns configuration
 * @param {Array} props.data - Table data
 * @param {Object} props.sorting - Sorting configuration { field, order, onSort }
 * @param {Object} props.selection - Selection configuration { selected, onSelect, onSelectAll }
 * @param {boolean} props.loading - Loading state
 * @param {string} props.variant - Table variant: 'default' | 'striped' | 'bordered'
 * @param {string} props.size - Table size: 'sm' | 'md' | 'lg'
 * @param {string} props.className - Additional CSS classes
 */
const AdminTableComponent = ({
  columns = [],
  data = [],
  sorting = null,
  selection = null,
  loading = false,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  // Base styles theo design system - Sử dụng Tailwind Catalyst
  const baseStyles = `
    w-full bg-white rounded-2xl overflow-hidden
    border border-avocado-brown-30 shadow-sm
  `;

  // Variant styles - Gestalt Similarity
  const variantStyles = {
    default: "divide-y divide-avocado-brown-30",
    striped:
      "divide-y divide-avocado-brown-30 [&>tbody>tr:nth-child(even)]:bg-avocado-green-10",
    bordered:
      "border-2 border-avocado-brown-30 [&>tbody>tr]:border-b [&>tbody>tr]:border-avocado-brown-30",
  };

  // Size styles - Gestalt Proximity
  const sizeStyles = {
    sm: "text-sm",
    md: "text-base", // 1.6rem theo design system
    lg: "text-lg",
  };

  // Header styles - Tailwind Catalyst
  const headerStyles = `
    bg-avocado-green-10 text-avocado-brown-100 font-semibold text-base
    border-b-2 border-avocado-green-100
  `;

  // Cell styles - Tailwind Catalyst với alignment tốt hơn
  const cellStyles = `
    px-6 py-4 text-avocado-brown-100 text-base
    border-b border-avocado-brown-30
  `;

  // Sort button styles
  const sortButtonStyles = `
    flex items-center gap-1 text-avocado-brown-100 font-semibold
    hover:text-avocado-green-100 transition-colors
    focus:outline-none focus:ring-2 focus:ring-avocado-green-30 rounded
  `;

  // Loading overlay
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="flex items-center gap-2 text-avocado-brown-100">
        <div className="w-5 h-5 border-2 border-avocado-green-100 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Đang tải...</span>
      </div>
    </div>
  );

  // Sort icon component
  const SortIcon = ({ column }) => {
    if (!sorting || sorting.field !== column.key) {
      return <ChevronUpIcon className="w-4 h-4 opacity-30" />;
    }

    return sorting.order === "asc" ? (
      <ChevronUpIcon className="w-4 h-4 text-avocado-green-100" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 text-avocado-green-100" />
    );
  };

  // Selection checkbox - Fix alignment với Tailwind Catalyst
  const SelectionCheckbox = ({ item, isHeader = false }) => {
    if (!selection) return null;

    if (isHeader) {
      const isAllSelected =
        data.length > 0 &&
        data.every((item) => selection.selected.includes(item.id));
      const isIndeterminate = selection.selected.length > 0 && !isAllSelected;

      return (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(el) => el && (el.indeterminate = isIndeterminate)}
            onChange={selection.onSelectAll}
            className="w-5 h-5 text-avocado-green-100 border-avocado-brown-30 rounded-lg focus:ring-avocado-green-30 focus:ring-2"
          />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={selection.selected.includes(item.id)}
          onChange={() => selection.onSelect(item.id)}
          className="w-5 h-5 text-avocado-green-100 border-avocado-brown-30 rounded-lg focus:ring-avocado-green-30 focus:ring-2"
        />
      </div>
    );
  };

  // Combined classes
  const combinedClasses = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  return (
    <div className="relative">
      {loading && <LoadingOverlay />}

      <div className={combinedClasses} {...props}>
        <table className="w-full">
          <thead>
            <tr className={headerStyles}>
              {selection && (
                <th className="w-16 text-center px-6 py-4">
                  <SelectionCheckbox isHeader />
                </th>
              )}
              {columns.map((column) => (
                <th key={column.key} className="text-left px-6 py-4">
                  {sorting && column.sortable ? (
                    <button
                      onClick={() => sorting.onSort(column.key)}
                      className={sortButtonStyles}
                      aria-label={`Sắp xếp theo ${column.title}`}
                    >
                      <span>{column.title}</span>
                      <SortIcon column={column} />
                    </button>
                  ) : (
                    <span className="text-avocado-brown-100 font-semibold">
                      {column.title}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selection ? 1 : 0)}
                  className="px-6 py-12 text-center text-avocado-brown-50"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-avocado-green-10 rounded-2xl flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-avocado-green-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <span className="text-base font-medium">
                      Không có dữ liệu
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="hover:bg-avocado-green-10 transition-colors"
                >
                  {selection && (
                    <td className="text-center px-6 py-4">
                      <SelectionCheckbox item={item} />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} className={cellStyles}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTableComponent;
