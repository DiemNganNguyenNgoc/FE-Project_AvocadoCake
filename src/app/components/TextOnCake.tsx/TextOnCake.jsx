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
          className="border p-2 rounded-md flex-1"
        />
        <input
          type="color"
          value={textColor}
          onChange={(e) => handleChangeColor(e.target.value)}
          className="w-16 h-8 p-0 border-0"
        />
      </div>
      <button
        onClick={onAddText}
        disabled={!newText.trim()}
        className={`px-4 py-2 rounded-lg text-white transition 
          ${
            !newText.trim()
              ? "bg-sky-300 cursor-not-allowed"
              : "bg-sky-500 hover:bg-blue-600"
          }`}
      >
        Thêm chữ
      </button>
    </div>
  );
}
