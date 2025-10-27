import React, { useState } from "react";
import { cakes, toppings } from "../../../data/cakeOptions";
import CakeSelector from "../../../components/CakeSelector/CakeSelector";
import ToppingToolbar from "../../../components/ToppingToolbar/ToppingToolbar";
import CakeStage from "../../../components/CakeStage/CakeStage";

function DesignCakePage() {
  const [selectedCake, setSelectedCake] = useState(cakes[0]);
  const [toppingList, setToppingList] = useState([]);
  const [selectedToppingId, setSelectedToppingId] = useState(null);

  const handleAddTopping = (topping) => {
    setToppingList([
      ...toppingList,
      {
        ...topping,
        x: 180 + Math.random() * 40,
        y: 180 + Math.random() * 40,
        rotation: 0,
        scaleX: 0.2,
        scaleY: 0.2,
      },
    ]);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-8">
      <h1 className="text-4xl font-bold text-amber-950">
        THIẾT KẾ BÁNH CỦA BẠN
      </h1>
      <div className="flex flex-wrap gap-8 justify-center">
        <CakeStage
          selectedCake={selectedCake}
          toppings={toppingList}
          setToppings={setToppingList}
          selectedToppingId={selectedToppingId}
          setSelectedToppingId={setSelectedToppingId}
        />
        <div className="flex flex-col gap-6 max-w-md">
          <CakeSelector
            cakes={cakes}
            selectedCake={selectedCake}
            onSelect={setSelectedCake}
          />
          <ToppingToolbar toppings={toppings} onAdd={handleAddTopping} />
          {selectedToppingId && (
            <button
              onClick={() =>
                setToppingList(
                  toppingList.filter((t) => t.id !== selectedToppingId)
                )
              }
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              🗑️ Xóa topping
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DesignCakePage;
