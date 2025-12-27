import React from "react";

export default function TextOnCake({
  newText,
  setNewText,
  textColor,
  setTextColor,
  onAddText,
  textList,
  setTextList,
  selectedTextId,
}) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddText();
    }
  };
  // Cập nhật màu chữ cho text đang chọn
  const handleChangeColor = (color) => {
    setTextColor(color);
    if (selectedTextId !== null) {
      setTextList((prev) =>
        prev.map((t, i) => (i === selectedTextId ? { ...t, color } : t))
      );
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="font-semibold text-amber-950">🎨 Thêm chữ:</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newText}
          onKeyDown={handleKeyPress}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Nhập chữ lên bánh..."
          className="border p-3 rounded-full flex-1 focus:outline-none focus:ring-2 focus:ring-avocado-green-80"
        />
        <input
          type="color"
          value={textColor}
          onChange={(e) => handleChangeColor(e.target.value)}
          className="w-16 h-8 p-0 border-0 rounded-md"
        />
      </div>
      <button
        onClick={onAddText}
        disabled={!newText.trim()}
        className={`px-4 py-2 text-avocado-brown-100 transition 
          ${
            !newText.trim()
              ? "opacity-50 cursor-not-allowed rounded-full"
              : " bg-lime-400 rounded-full hover:shadow-md"
          }`}
      >
        Thêm chữ
      </button>
    </div>
  );
}
