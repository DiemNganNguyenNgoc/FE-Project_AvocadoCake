import React, { useState } from "react";
import { cakes, toppings } from "../../../data/cakeOptions";
import CakeSelector from "../../../components/CakeSelector/CakeSelector";
import ToppingToolbar from "../../../components/ToppingToolbar/ToppingToolbar";
import CakeStage from "../../../components/CakeStage/CakeStage";
import TextOnCake from "../../../components/TextOnCake.tsx/TextOnCake";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function DesignCakePage() {
  const [activeTab, setActiveTab] = useState("manual");
  const [selectedCake, setSelectedCake] = useState(cakes[0]);
  const [toppingList, setToppingList] = useState([]);
  const [selectedToppingId, setSelectedToppingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [textList, setTextList] = useState([]);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [newText, setNewText] = useState("");
  const [textColor, setTextColor] = useState("#8B4513");

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // ===== ADD TOPPING =====
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

  // ===== ADD TEXT =====
  const handleAddText = () => {
    if (!newText.trim()) return;

    setTextList([
      ...textList,
      {
        id: Date.now(),
        text: newText,
        fontFamily: "Dancing Script, cursive",
        x: 200,
        y: 200,
        rotation: 0,
        fontSize: 28,
        color: textColor,
      },
    ]);

    setNewText("");
  };

  async function translateToEnglish(text) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(
        text
      )}`;

      const res = await fetch(url);
      const data = await res.json();

      // format: [ [ [ "translated text", "original text", ... ] ] ]
      return data[0][0][0];
    } catch (err) {
      console.error("Translate failed:", err);
      return text;
    }
  }

  const [prompt, setPrompt] = useState("");
  const [aiImageUrl, setAiImageUrl] = useState("");

  const handleGenerateAI = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true); // bật skeleton

    const englishPrompt = await translateToEnglish(prompt);
    console.log("Translated prompt:", englishPrompt);
    const url = `https://image.pollinations.ai/prompt/${englishPrompt}?width=1024&height=1024&nologo=true`;
    // const url = `https://gen.pollinations.ai/image/${englishPrompt}?width=1024&height=1024&nologo=true`;
    setAiImageUrl(url);

    // tạo ảnh, sau khi load xong thì tắt skeleton
    const img = new Image();
    img.src = url;

    img.onload = () => {
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };
    console.log("Generated AI image with prompt:", englishPrompt);
    console.log("Image URL:", url);
  };

  const handleDownloadImage = async () => {
    if (!aiImageUrl) return;

    try {
      const res = await fetch(aiImageUrl, { mode: "cors" });

      if (!res.ok) throw new Error("Không fetch được ảnh");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "ai-cake-design.png";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Error downloading image:", err);
      alert("Không tải được ảnh, có thể server AI đang chặn tải trực tiếp.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="productadmin__title">THIẾT KẾ BÁNH</h1>
        <h3 className="text-xl mt-4 text-gray-700">
          Chọn phong cách thiết kế của bạn
        </h3>

        {/* 👉 TAB SWITCHER */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setActiveTab("manual")}
            className={`
              px-6 py-2 rounded-full font-semibold transition
              ${
                activeTab === "manual"
                  ? "bg-lime-400 text-avocado-brown-100 shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
          >
            Thiết kế thủ công
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`
              px-6 py-2 rounded-full font-semibold transition
              ${
                activeTab === "ai"
                  ? "bg-lime-400 text-avocado-brown-100 shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
          >
            Thiết kế bằng AI
          </button>
        </div>
      </div>

      {/* =========================
          TAB 1: MANUAL
      ========================= */}
      {activeTab === "manual" && (
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
            <ToppingToolbar toppings={toppings} onAdd={handleAddTopping} />
          </div>
        </div>
      )}

      {/* =========================
          TAB 2: AI DESIGN
      ========================= */}
      {activeTab === "ai" && (
        <div className="w-full flex flex-col items-center mt-10 px-4">
          <div className="w-full max-w-5xl">
            {/* CHECK LOGIN */}
            {!user?.isLoggedIn ? (
              <div className="text-center mt-20">
                <h2 className="text-3xl font-bold text-red-600 mb-4">
                  Bạn cần đăng nhập để sử dụng AI
                </h2>

                <p className="text-gray-600 mb-6">
                  Đăng nhập để tạo mẫu bánh độc đáo bằng AI ✨
                </p>

                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 rounded-full bg-avocado-green-80 text-avocado-brown-100 text-lg font-semibold transition hover:shadow-lg"
                >
                  Đăng nhập ngay
                </button>
              </div>
            ) : (
              <>
                {/* TITLE */}
                <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">
                  Tạo mẫu bánh bằng AI ✨
                </h2>
                <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
                  Nhập mô tả chiếc bánh bạn muốn — AI sẽ tạo ra một bản concept
                  độc đáo theo phong cách riêng của bạn.
                </p>
                {/* INPUT PROMPT */}
                {/* INPUT PROMPT */}{" "}
                <textarea
                  placeholder="Ví dụ: Bánh sinh nhật màu xanh pastel, hoa kem trắng, phong cách Hàn Quốc nhẹ nhàng..."
                  className=" w-full h-40 p-6 text-2xl border border-green-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 "
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />{" "}
                <div className="flex justify-center mt-6">
                  {" "}
                  <button
                    onClick={handleGenerateAI}
                    className=" px-10 py-3 rounded-xl text-xl font-semibold bg-green-500 text-white shadow-md hover:bg-green-600 transition duration-200 "
                  >
                    {" "}
                    Tạo mẫu bằng AI{" "}
                  </button>{" "}
                </div>{" "}
                {/* AREA AI IMAGE */}{" "}
                <div className="mt-14 flex flex-col items-center min-h-[420px] pb-5">
                  {" "}
                  {/* SKELETON LOADING */}{" "}
                  {isLoading && (
                    <div className="w-full max-w-3xl animate-pulse">
                      {" "}
                      <div className="h-[420px] w-full bg-gray-200 rounded-2xl shadow-md"></div>{" "}
                    </div>
                  )}{" "}
                  {/* AI IMAGE */} {/* AI IMAGE */}{" "}
                  {!isLoading && aiImageUrl && (
                    <div className="flex flex-col items-center gap-4">
                      {" "}
                      <img
                        src={aiImageUrl}
                        alt="AI Cake Design"
                        className="max-w-xl w-full rounded-2xl shadow-xl transition-all duration-500"
                      />{" "}
                      {/* DOWNLOAD BUTTON */}{" "}
                      <button
                        onClick={handleDownloadImage}
                        className=" px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition "
                      >
                        {" "}
                        ⬇️ Tải ảnh về{" "}
                      </button>{" "}
                    </div>
                  )}{" "}
                  {/* EMPTY STATE */}{" "}
                  {!isLoading && !aiImageUrl && (
                    <p className="text-gray-500 mt-14">
                      {" "}
                      (AI sẽ hiển thị ảnh tại đây){" "}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignCakePage;
