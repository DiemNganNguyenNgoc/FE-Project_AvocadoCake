import React, { useState, useRef, useEffect } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";

//  * @param {Object} props - Component props
//  * @param {string} props.value - Current search value
//  * @param {Function} props.onChange - Search value change handler
//  * @param {Function} props.onSearch - Search submit handler
//  * @param {Function} props.onClear - Clear search handler
//  * @param {string} props.placeholder - Input placeholder text
//  * @param {Array} props.suggestions - Search suggestions array
//  * @param {Function} props.onSuggestionClick - Suggestion click handler
//  * @param {Object} props.style - Custom styling options
//  * @param {Object} props.filters - Filter configuration
//  * @param {boolean} props.showFilters - Show filter button
//  * @param {boolean} props.disabled - Disable component
//  * @param {boolean} props.loading - Show loading state
//  * @param {string} props.size - Component size (sm, md, lg, xl)
//  * @param {string} props.variant - Visual variant (default, minimal, glass, solid)
//  * @param {Function} props.onFocus - Focus event handler
//  * @param {Function} props.onBlur - Blur event handler
//  * @param {number} props.debounceMs - Debounce delay for onChange
//  * @param {boolean} props.autoFocus - Auto focus on mount
//  * @param {number} props.maxLength - Maximum input length
//  * @param {string} props.searchMode - Search mode (instant, onEnter, onSubmit)

const SearchBarComponent = ({
  // Core Props
  value = "",
  onChange,
  onSearch,
  onClear,
  placeholder = "Tìm kiếm...",

  // Advanced Features
  suggestions = [],
  onSuggestionClick,
  filters = {},
  showFilters = false,

  // State Props
  disabled = false,
  loading = false,
  autoFocus = false,

  // Styling Props
  size = "md",
  variant = "default",
  style = {},

  // Behavior Props
  searchMode = "instant", // instant, onEnter, onSubmit
  debounceMs = 300,
  maxLength = 100,

  // Event Handlers
  onFocus,
  onBlur,
  onFilterToggle,

  // Custom Classes
  className = "",
  containerClassName = "",
  inputClassName = "",
}) => {
  // Internal State
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Refs
  const inputRef = useRef(null);
  const suggestionRefs = useRef([]);
  const debounceRef = useRef(null);

  // Auto focus effect
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Debounced onChange
  useEffect(() => {
    if (debounceMs > 0 && onChange) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (searchMode === "instant") {
          onSearch?.(value);
        }
      }, debounceMs);

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }
  }, [value, onChange, onSearch, debounceMs, searchMode]);

  // Size configurations - Updated for flex layout
  const sizeConfig = {
    sm: {
      container: "h-12 min-w-[144px] px-2 gap-2", // 20px gap
      input: "text-sm py-2 flex-1",
      icon: "w-5 h-5 flex-shrink-0",
      button: "w-7 h-7 p-1 flex-shrink-0",
      suggestion: "px-3 py-2 text-sm",
    },
    md: {
      container: "h-14 min-w-[180px] px-4 gap-2", // 20px gap
      input: "text-base py-3 flex-1",
      icon: "w-6 h-6 flex-shrink-0",
      button: "w-8 h-8 p-1.5 flex-shrink-0",
      suggestion: "px-4 py-3 text-base",
    },
    lg: {
      container: "h-16 min-w-[216px] px-5 gap-2", // 20px gap
      input: "text-lg py-4 flex-1",
      icon: "w-7 h-7 flex-shrink-0",
      button: "w-9 h-9 p-2 flex-shrink-0",
      suggestion: "px-5 py-3.5 text-lg",
    },
    xl: {
      container: "h-18 min-w-[240px] px-6 gap-2", // 20px gap
      input: "text-xl py-5 flex-1",
      icon: "w-8 h-8 flex-shrink-0",
      button: "w-10 h-10 p-2 flex-shrink-0",
      suggestion: "px-6 py-4 text-xl",
    },
  };

  // Variant configurations - Theo design system AvocadoCake (Optimized shadows)
  const variantConfig = {
    default: {
      container:
        "bg-white border-2 border-avocado-brown-30 shadow-sm hover:border-avocado-brown-50 focus-within:border-avocado-green-100 focus-within:ring-2 focus-within:ring-avocado-green-30",
      input:
        "bg-transparent text-avocado-brown-100 placeholder:text-avocado-brown-50",
      suggestions: "bg-white border border-avocado-brown-30 shadow-md",
    },
    minimal: {
      container:
        "bg-avocado-green-10 border border-avocado-brown-30 hover:bg-white hover:border-avocado-brown-50 focus-within:bg-white focus-within:border-avocado-green-100 focus-within:ring-2 focus-within:ring-avocado-green-30",
      input:
        "bg-transparent text-avocado-brown-100 placeholder:text-avocado-brown-50",
      suggestions: "bg-white border border-avocado-brown-30 shadow-sm",
    },
    glass: {
      container:
        "bg-white/80 backdrop-blur-md border border-avocado-brown-30/50 shadow-md hover:bg-white/90 focus-within:bg-white/95 focus-within:border-avocado-green-100/50 focus-within:ring-2 focus-within:ring-avocado-green-30",
      input:
        "bg-transparent text-avocado-brown-100 placeholder:text-avocado-brown-50",
      suggestions:
        "bg-white/95 backdrop-blur-md border border-avocado-brown-30/50 shadow-lg",
    },
    solid: {
      container:
        "bg-gradient-to-r from-avocado-green-100 to-avocado-green-80 border-2 border-transparent shadow-sm hover:shadow-md focus-within:shadow-md focus-within:from-avocado-green-80 focus-within:to-avocado-green-100",
      input:
        "bg-transparent text-avocado-brown-100 placeholder:text-avocado-brown-50",
      suggestions: "bg-white border border-avocado-brown-30 shadow-md",
    },
  };

  const currentSize = sizeConfig[size];
  const currentVariant = variantConfig[variant];

  // Event Handlers
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) return;

    onChange?.(newValue);
    setShowSuggestions(suggestions.length > 0 && newValue.length > 0);
    setSelectedSuggestion(-1);
  };

  const handleInputFocus = (e) => {
    setIsFocused(true);
    setShowSuggestions(suggestions.length > 0 && value.length > 0);
    onFocus?.(e);
  };

  const handleInputBlur = (e) => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
      onBlur?.(e);
    }, 150);
  };

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedSuggestion((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedSuggestion >= 0) {
            handleSuggestionClick(suggestions[selectedSuggestion]);
          } else if (searchMode === "onEnter") {
            onSearch?.(value);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSelectedSuggestion(-1);
          inputRef.current?.blur();
          break;
        default:
          break;
      }
    } else if (e.key === "Enter" && searchMode === "onEnter") {
      onSearch?.(value);
    }
  };

  const handleClear = () => {
    onChange?.("");
    onClear?.();
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    const suggestionValue =
      typeof suggestion === "string" ? suggestion : suggestion.value;
    onChange?.(suggestionValue);
    onSuggestionClick?.(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
  };

  const handleFilterToggle = () => {
    setShowFilterPanel(!showFilterPanel);
    onFilterToggle?.(!showFilterPanel);
  };

  return (
    <div className={`relative ${containerClassName}`}>
      {/* Main Search Container - Flex Layout */}
      <div
        className={`
          flex items-center
          ${currentSize.container}
          ${currentVariant.container}
          rounded-2xl
          transition-all duration-300 ease-out
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
        style={style.container}
      >
        {/* Search Icon - Same layer as text */}
        <div className="flex items-center justify-center pointer-events-none">
          {loading ? (
            <div
              className={`
                ${currentSize.icon} 
                border-2 border-blue-500 border-t-transparent 
                rounded-full animate-spin
              `}
            />
          ) : (
            <Search
              className={`
                ${currentSize.icon} 
                ${variant === "solid" ? "text-white" : "text-blue-600"}
                transition-all duration-200
                ${isFocused ? "scale-110" : ""}
              `}
            />
          )}
        </div>

        {/* Input Field - Same layer, gap handled by parent flex */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`
            outline-none border-none
            ${currentSize.input}
            ${currentVariant.input}
            ${inputClassName}
            font-medium
            transition-all duration-200
            ${disabled ? "cursor-not-allowed" : ""}
          `}
          style={style.input}
        />

        {/* Action Buttons Container - Same layer */}
        <div className="flex items-center space-x-2">
          {/* Filter Button */}
          {showFilters && (
            <button
              onClick={handleFilterToggle}
              className={`
                ${currentSize.button}
                ${
                  variant === "solid"
                    ? "hover:bg-white/20 text-white"
                    : "hover:bg-gray-100 text-gray-600"
                }
                rounded-xl flex items-center justify-center
                transition-all duration-200 hover:scale-110 active:scale-95
                ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              `}
              disabled={disabled}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className={currentSize.icon} />
            </button>
          )}

          {/* Clear Button */}
          {value && (
            <button
              onClick={handleClear}
              className={`
                ${currentSize.button}
                ${
                  variant === "solid"
                    ? "hover:bg-white/20 text-white"
                    : "hover:bg-gray-100 text-gray-600 hover:text-red-600"
                }
                rounded-xl flex items-center justify-center
                transition-all duration-200 hover:scale-110 active:scale-95
                ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              `}
              disabled={disabled}
              aria-label="Clear search"
            >
              <X className={currentSize.icon} />
            </button>
          )}
        </div>

        {/* Focus Ring Enhancement */}
        {isFocused && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className={`
            absolute top-full left-0 right-0 mt-2 z-50
            ${currentVariant.suggestions}
            rounded-2xl overflow-hidden
            max-h-60 overflow-y-auto
            animate-fade-in
          `}
          style={style.suggestions}
        >
          {suggestions.map((suggestion, index) => {
            const isSelected = index === selectedSuggestion;
            const suggestionText =
              typeof suggestion === "string" ? suggestion : suggestion.label;

            return (
              <button
                key={index}
                ref={(el) => (suggestionRefs.current[index] = el)}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`
                  w-full text-left
                  ${currentSize.suggestion}
                  transition-all duration-150
                  border-b border-gray-100 last:border-b-0
                  ${
                    isSelected
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                  flex items-center justify-between
                `}
              >
                <span>{suggestionText}</span>
                {typeof suggestion === "object" && suggestion.count && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    {suggestion.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && showFilters && (
        <div
          className={`
            absolute top-full right-0 mt-2 z-50
            bg-white border border-gray-200 shadow-md
            rounded-2xl p-4 min-w-[250px]
            animate-fade-in
          `}
          style={style.filterPanel}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Bộ lọc</h3>
            <button
              onClick={handleFilterToggle}
              className="w-6 h-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="space-y-3">
            {Object.entries(filters).map(([key, filter]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                {filter.type === "select" && (
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    value={filter.value || ""}
                    onChange={(e) => filter.onChange?.(e.target.value)}
                  >
                    <option value="">Tất cả</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {filter.type === "checkbox" && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filter.value || false}
                      onChange={(e) => filter.onChange?.(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{filter.checkboxLabel}</span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Status Indicator */}
      {value && searchMode === "instant" && (
        <div className="absolute -bottom-6 left-0 flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          <span>Đang tìm: "{value}"</span>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchBarComponent;
