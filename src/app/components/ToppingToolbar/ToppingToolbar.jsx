import React from "react";

const ToppingToolbar = ({ toppings, onAdd }) => {
  const [selectedTopping, setSelectedTopping] = React.useState("");

  const handleAdd = () => {
    const topping = toppings.find((t) => t.id === selectedTopping);
    if (topping) onAdd(topping);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-amber-950">🍒 Chọn topping:</label>
      <div className="flex gap-2">
        <select
          value={selectedTopping}
          onChange={(e) => setSelectedTopping(e.target.value)}
          onKeyDown={handleKeyPress}
          className="border-2 border-gray-300 rounded-full px-4 py-2 h-18 bg-white shadow-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">— Chọn topping —</option>
          {toppings.map((topping) => (
            <option key={topping.id} value={topping.id}>
              {topping.name} - {(topping.price || 0).toLocaleString("vi-VN")}₫
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={!selectedTopping}
          className="bg-lime-400 text-avocado-brown-100 px-4 py-2 rounded-full shadow disabled:cursor-not-allowed disabled:opacity-50"
        >
          Thêm
        </button>
      </div>

      {selectedTopping && (
        <div className="mt-2 flex justify-center">
          <img
            src={toppings.find((t) => t.id === selectedTopping)?.src}
            alt="preview"
            className="w-80 h-80 object-contain rounded shadow"
          />
        </div>
      )}
    </div>
  );
};

export default ToppingToolbar;
