import React from "react";
import clsx from "clsx";

/**
 * AdminStatsCardComponent - Reusable stats card component theo design system AvocadoCake
 * Tuân thủ nguyên tắc Gestalt và responsive design
 *
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value
 * @param {string} props.subtitle - Subtitle or description
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.variant - Card variant: 'default' | 'success' | 'warning' | 'info' | 'danger'
 * @param {string} props.size - Card size: 'sm' | 'md' | 'lg'
 * @param {boolean} props.trending - Show trending indicator
 * @param {string} props.trend - Trend direction: 'up' | 'down' | 'neutral'
 * @param {string} props.trendValue - Trend value (e.g., "+12%")
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 */
const AdminStatsCardComponent = ({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  size = "md",
  trending = false,
  trend = "neutral",
  trendValue,
  className = "",
  onClick,
  ...props
}) => {
  // Base styles theo design system - Bo tròn 16px và font to hơn
  const baseStyles = `
    bg-white rounded-2xl p-6 border border-avocado-brown-30
    shadow-sm hover:shadow-md transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-avocado-green-30
    text-base font-medium
  `;

  // Variant styles - Gestalt Similarity
  const variantStyles = {
    default: `
      border-avocado-brown-30 hover:border-avocado-green-100
    `,
    success: `
      border-avocado-green-100 bg-gradient-to-br from-avocado-green-10 to-white
      hover:shadow-lg hover:shadow-avocado-green-30/20
    `,
    warning: `
      border-yellow-300 bg-gradient-to-br from-yellow-50 to-white
      hover:shadow-lg hover:shadow-yellow-300/20
    `,
    info: `
      border-blue-300 bg-gradient-to-br from-blue-50 to-white
      hover:shadow-lg hover:shadow-blue-300/20
    `,
    danger: `
      border-red-300 bg-gradient-to-br from-red-50 to-white
      hover:shadow-lg hover:shadow-red-300/20
    `,
  };

  // Size styles - Gestalt Proximity với font to hơn
  const sizeStyles = {
    sm: "p-4 text-sm",
    md: "p-6 text-base", // Default theo design system với font to hơn
    lg: "p-8 text-lg",
  };

  // Icon styles
  const iconStyles = {
    default: "text-avocado-brown-100",
    success: "text-avocado-green-100",
    warning: "text-yellow-600",
    info: "text-blue-600",
    danger: "text-red-600",
  };

  // Trend styles
  const trendStyles = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-500",
  };

  // Interactive styles
  const interactiveStyles = onClick
    ? `
    cursor-pointer hover:scale-[1.02] active:scale-[0.98]
  `
    : "";

  // Combined classes
  const combinedClasses = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    interactiveStyles,
    className
  );

  // Trend icon component
  const TrendIcon = () => {
    if (!trending) return null;

    const iconClass = "w-4 h-4";

    switch (trend) {
      case "up":
        return (
          <svg
            className={`${iconClass} ${trendStyles.up}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 17l9.2-9.2M17 17V7H7"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            className={`${iconClass} ${trendStyles.down}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 7l-9.2 9.2M7 7v10h10"
            />
          </svg>
        );
      default:
        return <div className={`w-2 h-2 rounded-full bg-gray-400`} />;
    }
  };

  const CardElement = onClick ? "button" : "div";

  return (
    <CardElement
      className={combinedClasses}
      onClick={onClick}
      type={onClick ? "button" : undefined}
      {...props}
    >
      {/* Header with icon and trend */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              ${variant === "success" ? "bg-avocado-green-100 text-white" : ""}
              ${variant === "warning" ? "bg-yellow-100 text-yellow-600" : ""}
              ${variant === "info" ? "bg-blue-100 text-blue-600" : ""}
              ${variant === "danger" ? "bg-red-100 text-red-600" : ""}
              ${variant === "default" ? "bg-avocado-green-10" : ""}
            `}
            >
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold text-avocado-brown-100">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-avocado-brown-50 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {trending && (
          <div
            className={`
            flex items-center gap-1 text-sm font-medium
            ${trendStyles[trend]}
          `}
          >
            <TrendIcon />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="mb-2">
        <p
          className={`
           text-3xl font-bold
           ${
             variant === "success"
               ? "text-avocado-green-100"
               : "text-avocado-brown-100"
           }
           ${variant === "warning" ? "text-yellow-600" : ""}
           ${variant === "info" ? "text-blue-600" : ""}
           ${variant === "danger" ? "text-red-600" : ""}
         `}
        >
          {value}
        </p>
      </div>
    </CardElement>
  );
};

// Export variants for convenience
export const SuccessStatsCard = (props) => (
  <AdminStatsCardComponent variant="success" {...props} />
);

export const WarningStatsCard = (props) => (
  <AdminStatsCardComponent variant="warning" {...props} />
);

export const InfoStatsCard = (props) => (
  <AdminStatsCardComponent variant="info" {...props} />
);

export const DangerStatsCard = (props) => (
  <AdminStatsCardComponent variant="danger" {...props} />
);

export default AdminStatsCardComponent;
