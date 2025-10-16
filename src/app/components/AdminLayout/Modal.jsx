import React, { useEffect } from "react";
import { createPortal } from "react-dom"; // Thêm import này
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  className = "",
}) => {
  const sizes = {
    sm: "max-w-lg",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
    "2xl": "max-w-7xl",
    full: "max-w-full mx-4",
  };

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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  //  Tạo modal content
  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* ⭐ Tăng z-index lên z-[9999] */}

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-6">
        <div
          className={`relative w-full ${sizes[size]} ${className}`}
          onClick={(e) => e.stopPropagation()} // ⭐ Prevent close when clicking inside modal
        >
          <div className="bg-white dark:bg-gray-dark rounded-xl shadow-xl border border-stroke dark:border-stroke-dark">
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-8 border-b border-stroke dark:border-stroke-dark">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-7 h-7" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal ra ngoài DOM tree, vào document.body
  return createPortal(modalContent, document.body);
};

export default Modal;
