import React from "react";

const AdminButtonComponent = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = "left",
  className = "",
  type = "button",
  ...props
}) => {
  // Base styles theo nguyên tắc Gestalt
  const baseStyles = `
    relative inline-flex items-center justify-center
    h-12 px-6 text-base font-medium
    rounded-xl transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
    transform hover:scale-[1.02] active:scale-[0.98]
    shadow-sm hover:shadow-md
  `;

  // Variant styles - Proximity và Similarity
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-500 to-blue-600
      text-white border border-blue-600
      hover:from-blue-600 hover:to-blue-700
      focus:ring-blue-500
      shadow-blue-500/25 hover:shadow-blue-500/40
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200
      text-gray-700 border border-gray-300
      hover:from-gray-200 hover:to-gray-300
      focus:ring-gray-500
      shadow-gray-500/25 hover:shadow-gray-500/40
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600
      text-white border border-green-600
      hover:from-green-600 hover:to-green-700
      focus:ring-green-500
      shadow-green-500/25 hover:shadow-green-500/40
    `,
    warning: `
      bg-gradient-to-r from-yellow-500 to-yellow-600
      text-white border border-yellow-600
      hover:from-yellow-600 hover:to-yellow-700
      focus:ring-yellow-500
      shadow-yellow-500/25 hover:shadow-yellow-500/40
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      text-white border border-red-600
      hover:from-red-600 hover:to-red-700
      focus:ring-red-500
      shadow-red-500/25 hover:shadow-red-500/40
    `,
    info: `
      bg-gradient-to-r from-cyan-500 to-cyan-600
      text-white border border-cyan-600
      hover:from-cyan-600 hover:to-cyan-700
      focus:ring-cyan-500
      shadow-cyan-500/25 hover:shadow-cyan-500/40
    `,
    outline: `
      bg-transparent text-gray-700 border-2 border-gray-300
      hover:bg-gray-50 hover:border-gray-400
      focus:ring-gray-500
    `,
    ghost: `
      bg-transparent text-gray-700 border border-transparent
      hover:bg-gray-100 hover:text-gray-900
      focus:ring-gray-500
    `,
  };

  // Size styles - Proximity
  const sizeStyles = {
    small: "h-10 px-4 text-sm",
    medium: "h-12 px-6 text-base", // Default - 48px height, 1.6rem = 1rem * 1.6 = 16px
    large: "h-14 px-8 text-lg",
    xl: "h-16 px-10 text-xl",
  };

  // Loading spinner component - Closure
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Icon rendering - Figure/Ground
  const renderIcon = () => {
    if (!icon) return null;
    return (
      <span className="flex items-center justify-center w-4 h-4">{icon}</span>
    );
  };

  // Combined classes - Gestalt principles applied
  const combinedClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.medium}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
      {...props}
    >
      {/* Loading state - Continuity */}
      {loading && <LoadingSpinner />}

      {/* Icon before text - Common Fate */}
      {!loading && icon && iconPosition === "left" && (
        <span className="mr-2">{renderIcon()}</span>
      )}

      {/* Button text - Figure/Ground */}
      <span className={`${loading ? "opacity-70" : ""}`}>{children}</span>

      {/* Icon after text - Common Fate */}
      {!loading && icon && iconPosition === "right" && (
        <span className="ml-2">{renderIcon()}</span>
      )}
    </button>
  );
};

// Export additional utility variants
export const PrimaryButton = (props) => (
  <AdminButtonComponent variant="primary" {...props} />
);

export const SecondaryButton = (props) => (
  <AdminButtonComponent variant="secondary" {...props} />
);

export const SuccessButton = (props) => (
  <AdminButtonComponent variant="success" {...props} />
);

export const WarningButton = (props) => (
  <AdminButtonComponent variant="warning" {...props} />
);

export const DangerButton = (props) => (
  <AdminButtonComponent variant="danger" {...props} />
);

export const InfoButton = (props) => (
  <AdminButtonComponent variant="info" {...props} />
);

export const OutlineButton = (props) => (
  <AdminButtonComponent variant="outline" {...props} />
);

export const GhostButton = (props) => (
  <AdminButtonComponent variant="ghost" {...props} />
);

export default AdminButtonComponent;
