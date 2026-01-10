import React, { useState, useRef } from "react";

const ImageSearchComponent = ({ onImageSearch }) => {
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef(null);

  // Resize image to reduce file size
  const resizeImage = (file, maxSize = 1024) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height && width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          } else if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create new File object with same name
                const resizedFile = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(resizedFile);
              } else {
                reject(new Error("Failed to resize image"));
              }
            },
            "image/jpeg",
            0.7
          );
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh hợp lệ!");
      return;
    }

    setIsSearching(true);

    try {
      // Always resize all images to ensure they fit server limits
      console.log(
        `🔄 Resizing image from ${(file.size / (1024 * 1024)).toFixed(2)}MB...`
      );
      const imageToUpload = await resizeImage(file, 800);
      console.log(
        `✅ Resized to ${(imageToUpload.size / (1024 * 1024)).toFixed(2)}MB`
      );

      // Call API to search by image
      await onImageSearch(imageToUpload);
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
