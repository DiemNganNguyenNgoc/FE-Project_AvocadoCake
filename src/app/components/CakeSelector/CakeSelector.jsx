import React, { useState } from "react";

const CakeSelector = ({ cakes, selectedCake, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-100">
      <label className="font-semibold text-amber-950 block mb-2">
        🍰 Chọn loại bánh:
      </label>

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 border-2 border-gray-300 rounded-full px-4 py-2 h-18 bg-white hover:border-green-400 transition-all w-full shadow-sm hover:shadow-md"
      >
        {selectedCake ? (
          <>
            <img
              src={selectedCake.src}
              alt={selectedCake.name}
              className="w-10 h-10 object-contain rounded"
            />
            <div className="flex-1 text-left">
              <span>{selectedCake.name}</span>
              <span className="text-green-600 font-semibold ml-2">
                - {(selectedCake.price || 0).toLocaleString("vi-VN")}₫
              </span>
            </div>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        ) : (
          <>
            <span className="text-gray-400 flex-1 text-left">
              — Chọn bánh —
            </span>
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        )}
      </button>

      {/* Danh sách bánh */}
      {open && (
        <div className="absolute z-10 mt-3 bg-white border-2 border-gray-200 rounded-2xl shadow-xl w-full max-h-80 overflow-auto">
          {cakes.map((cake, index) => (
            <div
              key={cake.id}
              onClick={() => {
                onSelect(cake);
                setOpen(false);
              }}
              className={`
                flex items-center gap-3 px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors
                ${index !== 0 ? "border-t border-gray-100" : ""}
                ${index === 0 ? "rounded-t-2xl" : ""}
                ${index === cakes.length - 1 ? "rounded-b-2xl" : ""}
              `}
            >
              <img
                src={cake.src}
                alt={cake.name}
                className="w-10 h-10 object-contain rounded"
              />
              <div className="flex-1">
                <span>{cake.name}</span>
                <span className="text-green-600 font-semibold ml-2">
                  - {(cake.price || 0).toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CakeSelector;
