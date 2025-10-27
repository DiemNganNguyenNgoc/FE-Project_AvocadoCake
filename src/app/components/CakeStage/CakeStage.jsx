import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const DraggableTopping = ({ topping, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(topping.src);

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={image}
        x={topping.x}
        y={topping.y}
        rotation={topping.rotation}
        scaleX={topping.scaleX}
        scaleY={topping.scaleY}
        draggable
        onClick={(e) => {
          e.cancelBubble = true; // ⛔ Không lan sự kiện lên Stage
          onSelect();
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        ref={shapeRef}
        onDragEnd={(e) => {
          onChange({
            ...topping,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          onChange({
            ...topping,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
          });
        }}
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled={true} />}
    </>
  );
};

const CakeStage = ({ selectedCake, toppings, setToppings }) => {
  const [cakeImage] = useImage(selectedCake?.src);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef();

  // 📸 Xuất ảnh bánh
  const handleExport = () => {
    const uri = stageRef.current.toDataURL({ mimeType: "image/png" });
    const link = document.createElement("a");
    link.download = "my-cake.png";
    link.href = uri;
    link.click();
  };

  // 🔄 Lật topping
  const toggleFlip = () => {
    if (selectedId == null) return;
    setToppings((prev) =>
      prev.map((t, i) =>
        i === selectedId ? { ...t, scaleX: t.scaleX * -1 } : t
      )
    );
  };

  // 🗑️ Xóa topping
  const handleDelete = () => {
    if (selectedId == null) return;
    setToppings((prev) => prev.filter((_, i) => i !== selectedId));
    setSelectedId(null);
  };

  // ⌨️ Xóa bằng phím Delete
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Delete") handleDelete();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  // 🖱️ Click ra ngoài để bỏ chọn
  const handleStageClick = (e) => {
    // Nếu click không vào hình topping nào
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Stage
        width={400}
        height={400}
        ref={stageRef}
        onMouseDown={handleStageClick}
        onTouchStart={handleStageClick}
        className="border shadow-md rounded-lg bg-white"
      >
        <Layer>
          {cakeImage && (
            <KonvaImage
              image={cakeImage}
              width={400}
              height={400}
              listening={false}
            />
          )}
          {toppings.map((t, i) => (
            <DraggableTopping
              key={i}
              topping={t}
              isSelected={i === selectedId}
              onSelect={() => setSelectedId(i)}
              onChange={(newAttrs) => {
                const updated = toppings.slice();
                updated[i] = newAttrs;
                setToppings(updated);
              }}
            />
          ))}
        </Layer>
      </Stage>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
        >
          📸 Xuất ảnh
        </button>

        <button
          onClick={toggleFlip}
          disabled={selectedId == null}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 disabled:opacity-50"
        >
          🔄 Lật ngang
        </button>

        <button
          onClick={handleDelete}
          disabled={selectedId == null}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 disabled:opacity-50"
        >
          🗑️ Xóa topping
        </button>
      </div>
    </div>
  );
};

export default CakeStage;
