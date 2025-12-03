import React, { useState, useRef } from "react";

const ImageSearchComponent = ({ onImageSearch }) => {
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh hợp lệ!");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 10MB!");
      return;
    }

    setIsSearching(true);

    try {
      // Call API to search by image
      await onImageSearch(file);
    } catch (error) {
      console.error("Error searching by image:", error);
      alert("Có lỗi xảy ra khi tìm kiếm bằng hình ảnh. Vui lòng thử lại!");
    } finally {
      setIsSearching(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
        aria-label="Upload image for search"
      />
      <button
        onClick={handleButtonClick}
        disabled={isSearching}
        title="Tìm kiếm bằng hình ảnh"
        className={`
          group relative bg-transparent border-none p-2 
          flex items-center justify-center 
          transition-all duration-300 rounded 
          hover:bg-[#b1e321]/10 hover:scale-105 
          active:scale-95 
          disabled:cursor-not-allowed disabled:opacity-60
          ${isSearching ? "text-[#b1e321]" : "text-[#3a060e]"}
        `}
      >
        {isSearching ? (
          <span className="text-2xl animate-spin">⌛</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            className="w-12 h-12"
          >
            <path
              d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
              fill="currentColor"
            />
            <circle cx="17" cy="8" r="2" fill="currentColor" />
          </svg>
        )}

        {/* Tooltip */}
        <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100">
          Tìm kiếm bằng hình ảnh
        </span>
      </button>
    </>
  );
};

export default ImageSearchComponent;
