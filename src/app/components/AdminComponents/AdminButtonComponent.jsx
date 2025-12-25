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

  // Variant styles - Theo design system AvocadoCake
  const variantStyles = {
    primary: `
      bg-avocado-green-100 text-avocado-brown-100 border border-avocado-green-100
      hover:bg-avocado-green-80 hover:border-avocado-green-80
      focus:ring-avocado-green-30
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-transparent text-avocado-green-100 border-2 border-avocado-green-100
      hover:bg-avocado-green-10 hover:border-avocado-green-100
      focus:ring-avocado-green-30
    `,
    success: `
      bg-avocado-green-100 text-avocado-brown-100 border border-avocado-green-100
      hover:bg-avocado-green-80 hover:border-avocado-green-80
      focus:ring-avocado-green-30
      shadow-sm hover:shadow-md
    `,
    warning: `
      bg-yellow-500 text-white border border-yellow-500
      hover:bg-yellow-600 hover:border-yellow-600
      focus:ring-yellow-300
      shadow-sm hover:shadow-md
    `,
    danger: `
      bg-red-500 text-white border border-red-500
      hover:bg-red-600 hover:border-red-600
      focus:ring-red-300
      shadow-sm hover:shadow-md
    `,
    info: `
      bg-blue-500 text-white border border-blue-500
      hover:bg-blue-600 hover:border-blue-600
      focus:ring-blue-300
      shadow-sm hover:shadow-md
    `,
    outline: `
      bg-transparent text-avocado-brown-100 border-2 border-avocado-brown-30
      hover:bg-avocado-green-10 hover:border-avocado-green-100
      focus:ring-avocado-green-30
    `,
    ghost: `
      bg-transparent text-avocado-brown-100 border border-transparent
      hover:bg-avocado-green-10 hover:text-avocado-brown-100
      focus:ring-avocado-green-30
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
