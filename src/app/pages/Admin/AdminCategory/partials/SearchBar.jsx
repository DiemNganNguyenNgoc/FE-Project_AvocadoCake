import React from "react";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="relative group w-full max-w-2xl">
      {/* Search Container */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/30 rounded-2xl"></div>

        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 shadow-sm group-focus-within:shadow-md transition-all duration-300">
            <svg
              className="h-5 w-5 text-blue-600 group-focus-within:text-blue-700 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo mã hoặc tên danh mục..."
          className="
            relative z-10 block w-full 
            pl-20 pr-16 py-4
            bg-white/80 backdrop-blur-sm
            border-2 border-gray-200/50
            rounded-2xl 
            text-base font-medium text-gray-700
            placeholder:text-gray-400 placeholder:font-normal
            shadow-lg shadow-gray-100/50
            focus:outline-none 
            focus:ring-4 focus:ring-blue-500/20 
            focus:border-blue-400
            focus:bg-white
            hover:border-gray-300
            hover:shadow-xl hover:shadow-gray-100/60
            transition-all duration-300 ease-out
          "
        />

        {/* Clear Button */}
        {searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center z-10">
            <button
              onClick={handleClearSearch}
              className="
                group/clear p-2.5 rounded-xl
                bg-gradient-to-br from-gray-100 to-gray-200
                hover:from-red-100 hover:to-red-200
                shadow-sm hover:shadow-md
                border border-gray-200/50
                hover:border-red-200
                transition-all duration-300 ease-out
                hover:scale-110 active:scale-95
              "
              aria-label="Clear search"
            >
              <svg
                className="h-4 w-4 text-gray-500 group-hover/clear:text-red-600 transition-colors duration-300"
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
          </div>
        )}

        {/* Animated Border Highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-focus-within:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none rounded-2xl"></div>
      </div>

      {/* Search Results Indicator */}
      {searchTerm && (
        <div className="absolute -bottom-8 left-0 flex items-center space-x-2 text-sm text-gray-500 animate-fade-in">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="font-medium">Đang tìm kiếm: "{searchTerm}"</span>
        </div>
      )}

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
