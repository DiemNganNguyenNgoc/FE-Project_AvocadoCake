import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const UpdateModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  icon,
  iconColor = "emerald",
  actions,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = "",
}) => {
  const sizes = {
    sm: "max-w-lg",
    md: "max-w-2xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    "2xl": "max-w-7xl",
    full: "max-w-full mx-4",
  };

  const iconColors = {
    emerald: "from-emerald-500 to-green-600",
    green: "from-green-500 to-green-600",
    teal: "from-teal-500 to-teal-600",
    cyan: "from-cyan-500 to-cyan-600",
    lime: "from-lime-500 to-lime-600",
    blue: "from-blue-500 to-blue-600",
  };

  // Default icon if none provided (Edit icon)
  const defaultIcon = (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen && closeOnEscape) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeOnEscape]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={handleBackdropClick} />

      {/* Modal Container */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header - Emerald/Green Gradient */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 bg-gradient-to-r ${iconColors[iconColor]} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                {icon || defaultIcon}
              </div>

              {/* Title & Subtitle */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Close Button */}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-8 py-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {children}
        </div>

        {/* Modal Footer (Actions) */}
        {actions && (
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex justify-end space-x-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UpdateModal;
