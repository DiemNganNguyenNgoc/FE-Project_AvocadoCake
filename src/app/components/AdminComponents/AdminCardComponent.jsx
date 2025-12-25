import React from "react";
import clsx from "clsx";

/**
 * AdminCardComponent - Reusable card component theo design system AvocadoCake
 * Tuân thủ nguyên tắc Gestalt và UI/UX best practices
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.variant - Card variant: 'default' | 'elevated' | 'outlined' | 'glass'
 * @param {string} props.size - Card size: 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Enable hover effects
 * @param {boolean} props.clickable - Make card clickable
 * @param {Function} props.onClick - Click handler
 * @param {string} props.padding - Custom padding: 'none' | 'sm' | 'md' | 'lg' | 'xl'
 */
const AdminCardComponent = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  hover = false,
  clickable = false,
  onClick,
  padding = "default",
  ...props
}) => {
  // Base styles theo design system - Bo tròn 16px và font to hơn
  const baseStyles = `
    bg-white rounded-2xl transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-avocado-green-30
    text-base font-medium
  `;

  // Variant styles - Gestalt Similarity
  const variantStyles = {
    default: `
      border border-avocado-brown-30 shadow-sm
      hover:shadow-md hover:border-avocado-brown-50
    `,
    elevated: `
      border-0 shadow-lg
      hover:shadow-xl
    `,
    outlined: `
      border-2 border-avocado-green-100
      hover:border-avocado-green-100 hover:bg-avocado-green-10
    `,
    glass: `
      bg-white/80 backdrop-blur-sm border border-white/20
      shadow-xl hover:bg-white/90
    `,
  };

  // Size styles - Gestalt Proximity với font to hơn
  const sizeStyles = {
    sm: "p-4 text-sm",
    md: "p-6 text-base", // Default theo design system với font to hơn
    lg: "p-8 text-lg",
    xl: "p-10 text-xl",
  };

  // Padding overrides
  const paddingStyles = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  // Interactive styles
  const interactiveStyles =
    clickable || onClick
      ? `
    cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]
  `
      : "";

  const hoverStyles = hover
    ? `
    hover:shadow-lg hover:border-avocado-green-100
  `
    : "";

  // Combined classes
  const combinedClasses = clsx(
    baseStyles,
    variantStyles[variant],
    padding !== "default" ? paddingStyles[padding] : sizeStyles[size],
    interactiveStyles,
    hoverStyles,
    className
  );

  const CardElement = clickable || onClick ? "button" : "div";

  return (
    <CardElement
      className={combinedClasses}
      onClick={onClick}
      type={clickable || onClick ? "button" : undefined}
      {...props}
    >
      {children}
    </CardElement>
  );
};

// Export variants for convenience
export const ElevatedCard = (props) => (
  <AdminCardComponent variant="elevated" {...props} />
);

export const OutlinedCard = (props) => (
  <AdminCardComponent variant="outlined" {...props} />
);

export const GlassCard = (props) => (
  <AdminCardComponent variant="glass" {...props} />
);

export const ClickableCard = (props) => (
  <AdminCardComponent clickable hover {...props} />
);

export default AdminCardComponent;
