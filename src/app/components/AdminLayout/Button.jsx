import React from "react";
import { Loader2 } from "lucide-react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  className = "",
  bgColor,
  textColor,
  hoverBgColor,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-avocado-green-100 text-white hover:bg-avocado-green-80 focus:ring-avocado-green-50 hover:text-avocado-brown-100",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-dark-3 dark:text-white dark:hover:bg-dark-4",
    outline:
      "border border-stroke text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-stroke-dark dark:text-white dark:hover:bg-dark-2",
    ghost:
      "text-gray-700 hover:bg-gray-100 focus:ring-gray-500 dark:text-white dark:hover:bg-dark-2",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50",
    success:
      "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500/50",
    warning:
      "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500/50",
  };

  const sizes = {
    sm: "px-4 py-2 text-xl",
    md: "px-5 py-3 text-xl",
    lg: "px-7 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  };

  const iconClass = iconSizes[size];
  const iconElement =
    icon && React.cloneElement(icon, { className: iconClass });

  // Custom color styles
  if (bgColor || textColor || hoverBgColor) {
    const customColorClasses = [
      bgColor && `bg-${bgColor}`,
      textColor && `text-${textColor}`,
      hoverBgColor && `hover:bg-${hoverBgColor}`,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        className={`${baseClasses} ${sizes[size]} ${customColorClasses} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2
            className={`${iconClass} animate-spin ${
              iconPosition === "left" ? "mr-2" : "ml-2"
            }`}
          />
        )}

        {!loading && icon && iconPosition === "left" && (
          <span className="mr-2">{iconElement}</span>
        )}

        {children}

        {!loading && icon && iconPosition === "right" && (
          <span className="ml-2">{iconElement}</span>
        )}
      </button>
    );
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2
          className={`${iconClass} animate-spin ${
            iconPosition === "left" ? "mr-2" : "ml-2"
          }`}
        />
      )}

      {!loading && icon && iconPosition === "left" && (
        <span className="mr-2">{iconElement}</span>
      )}

      {children}

      {!loading && icon && iconPosition === "right" && (
        <span className="ml-2">{iconElement}</span>
      )}
    </button>
  );
};

export default Button;
