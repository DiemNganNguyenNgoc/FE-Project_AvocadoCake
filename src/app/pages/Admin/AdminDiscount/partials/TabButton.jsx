import React from "react";

const TabButton = ({ isActive, onClick, children, icon, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative flex items-center gap-3 px-6 py-3 h-12
        text-lg font-semibold rounded-xl transition-all duration-300 ease-out
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        transform active:scale-95 select-none
        ${
          isActive
            ? // Active State - Gestalt: Figure/Ground principle
              `bg-gradient-to-br from-blue-500 to-blue-600 text-white 
               shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/20
               hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/30
               focus:ring-blue-500`
            : // Inactive State - Gestalt: Proximity and Similarity principles
              `bg-white text-gray-700 border-2 border-gray-200
               hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:shadow-gray-200/50
               focus:ring-gray-300 hover:-translate-y-0.5`
        }
        ${
          disabled
            ? "opacity-50 cursor-not-allowed transform-none"
            : "cursor-pointer"
        }
      `}
    >
      {/* Icon Container - Gestalt: Closure principle */}
      <div
        className={`
          flex items-center justify-center w-5 h-5 transition-all duration-300
          ${
            isActive
              ? "text-blue-100 scale-110"
              : "text-gray-500 group-hover:text-gray-700 group-hover:scale-105"
          }
        `}
      >
        {icon}
      </div>

      {/* Text Container - Gestalt: Good Continuation */}
      <span
        className={`
          relative transition-all duration-300
          ${
            isActive
              ? "text-white font-bold tracking-wide"
              : "text-gray-700 group-hover:text-gray-900"
          }
        `}
      >
        {children}
      </span>

      {/* Active Indicator - Gestalt: Emphasis and Focal Point */}
      {isActive && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}

      {/* Ripple Effect on Hover - Gestalt: Movement principle */}
      {!disabled && (
        <div
          className={`
            absolute inset-0 rounded-xl transition-all duration-500 pointer-events-none
            ${
              isActive
                ? "bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100"
                : "bg-gradient-to-br from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100"
            }
          `}
        />
      )}
    </button>
  );
};

export default TabButton;
