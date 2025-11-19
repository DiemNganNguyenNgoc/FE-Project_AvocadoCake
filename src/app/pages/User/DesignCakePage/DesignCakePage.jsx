import React, { useState } from "react";
import { cakes, toppings } from "../../../data/cakeOptions";
import CakeSelector from "../../../components/CakeSelector/CakeSelector";
import ToppingToolbar from "../../../components/ToppingToolbar/ToppingToolbar";
import CakeStage from "../../../components/CakeStage/CakeStage";
import TextOnCake from "../../../components/TextOnCake.tsx/TextOnCake";

function DesignCakePage() {
  const [selectedCake, setSelectedCake] = useState(cakes[0]);
  const [toppingList, setToppingList] = useState([]);
  const [selectedToppingId, setSelectedToppingId] = useState(null);

  const [textList, setTextList] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [newText, setNewText] = useState("");
  const [textColor, setTextColor] = useState("#8B4513"); // màu chữ

  // ===== Add topping =====
  const handleAddTopping = (topping) => {
    setToppingList([
      ...toppingList,
      {
        ...topping,
        id: Date.now(),
        x: 180 + Math.random() * 40,
        y: 180 + Math.random() * 40,
        rotation: 0,
        scaleX: 0.2,
        scaleY: 0.2,
      },
    ]);
  };

  // ===== Add text =====
  const handleAddText = () => {
    if (!newText.trim()) return;

    setTextList([
      ...textList,
      {
        id: Date.now(),
        text: newText,
        fontFamily: "Dancing Script, cursive", // kiểu chữ đẹp mặc định
        x: 200,
        y: 200,
        rotation: 0,
        fontSize: 28,
        color: textColor,
      },
    ]);

    setNewText("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="productadmin__title">THIẾT KẾ BÁNH</h1>
        <h3 className="text-xl mt-4 text-gray-700">
          Tạo chiếc bánh theo phong cách riêng của bạn
        </h3>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-wrap gap-8 justify-center">
        {/* LEFT: Cake Stage */}
        <CakeStage
          selectedCake={selectedCake}
          toppings={toppingList}
          setToppings={setToppingList}
          selectedToppingId={selectedToppingId}
          setSelectedToppingId={setSelectedToppingId}
          textList={textList}
          setTextList={setTextList}
          selectedTextId={selectedTextId}
          setSelectedTextId={setSelectedTextId}
        />

        {/* RIGHT TOOLBAR */}
        <div className="flex flex-col gap-6 max-w-md">
          {/* Select cake */}
          <CakeSelector
            cakes={cakes}
            selectedCake={selectedCake}
            onSelect={setSelectedCake}
          />
          <TextOnCake
            newText={newText}
            setNewText={setNewText}
            textColor={textColor}
            setTextColor={setTextColor}
            onAddText={handleAddText}
            textList={textList}
            setTextList={setTextList}
            selectedTextId={selectedTextId}
          />
          {/* Add topping */}
          <ToppingToolbar toppings={toppings} onAdd={handleAddTopping} />
        </div>
      </div>
    </div>
  );
}

export default DesignCakePage;
