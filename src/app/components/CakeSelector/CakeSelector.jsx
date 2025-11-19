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
        className="flex items-center gap-3 border rounded-lg p-2 bg-white shadow-sm w-full"
      >
        {selectedCake ? (
          <>
            <img
              src={selectedCake.src}
              alt={selectedCake.name}
              className="w-10 h-10 object-contain rounded"
            />
            <span>{selectedCake.name}</span>
          </>
        ) : (
          <span className="text-gray-500">-- Chọn bánh --</span>
        )}
      </button>

      {/* Danh sách bánh */}
      {open && (
        <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg w-full max-h-60 overflow-auto">
          {cakes.map((cake) => (
            <div
              key={cake.id}
              onClick={() => {
                onSelect(cake);
                setOpen(false);
              }}
              className="flex items-center gap-3 p-2 hover:bg-green-100 cursor-pointer"
            >
              <img
                src={cake.src}
                alt={cake.name}
                className="w-10 h-10 object-contain rounded"
              />
              <span>{cake.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CakeSelector;
