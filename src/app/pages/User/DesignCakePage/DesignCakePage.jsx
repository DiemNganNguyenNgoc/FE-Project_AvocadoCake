import React, { useState } from "react";
import { cakes, toppings } from "../../../data/cakeOptions";
import CakeSelector from "../../../components/CakeSelector/CakeSelector";
import ToppingToolbar from "../../../components/ToppingToolbar/ToppingToolbar";
import CakeStage from "../../../components/CakeStage/CakeStage";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";

function DesignCakePage() {
  const [activeTab, setActiveTab] = useState("manual"); // 👈 mặc định tab đầu tiên
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
      <h1 className="text-4xl font-bold text-amber-950">THIẾT KẾ BÁNH</h1>

      <div className="flex flex-row">
        <div className="flex flex-col gap-4 mr-8">
          <SideMenuComponent
            value="manual"
            isActive={activeTab === "manual"}
            onClick={setActiveTab}
          >
            Thiết kế thủ công
          </SideMenuComponent>

          <SideMenuComponent
            value="AI"
            isActive={activeTab === "AI"}
            onClick={setActiveTab}
          >
            Thiết kế bằng AI
          </SideMenuComponent>
        </div>

        {activeTab === "manual" ? (
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
        ) : (
          // 👇 Đây là phần giao diện AI
          <div className="flex flex-col items-center justify-center gap-6 text-center p-10 bg-white rounded-2xl shadow-lg">
            <h2 className="text-3xl font-semibold text-amber-900">
              🤖 Thiết kế bằng AI
            </h2>
            <p className="text-gray-600">
              Mô tả chiếc bánh bạn muốn tạo, AI sẽ giúp bạn thiết kế tự động.
            </p>
            <textarea
              placeholder="Nhập mô tả chiếc bánh (ví dụ: bánh sinh nhật màu hồng, hoa văn trái tim...)"
              className="border rounded-lg w-full h-32 p-3 resize-none"
            />
            <button className="bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-amber-700 transition">
              🚀 Tạo bánh bằng AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DesignCakePage;
