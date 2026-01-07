import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Text as KonvaText,
  Transformer,
} from "react-konva";
import useImage from "use-image";

// ===== Draggable Topping =====
const DraggableTopping = ({ topping, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image] = useImage(topping.src);

  const handleSelect = useCallback(
    (e) => {
      e.cancelBubble = true;
      onSelect();
    },
    [onSelect]
  );

  const handleDragEnd = useCallback(
    (e) => {
      onChange({ ...topping, x: e.target.x(), y: e.target.y() });
    },
    [onChange, topping]
  );

  const handleTransformEnd = useCallback(() => {
    const node = shapeRef.current;
    const scaleX = Math.max(0.5, Math.min(node.scaleX(), 3));
    const scaleY = Math.max(0.5, Math.min(node.scaleY(), 3));

    onChange({
      ...topping,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX,
      scaleY,
    });

    node.scaleX(1);
    node.scaleY(1);
    node.width(node.width() * scaleX);
    node.height(node.height() * scaleY);
  }, [onChange, topping]);

  const handleWheel = useCallback(
    (e) => {
      e.evt.preventDefault();
      const node = shapeRef.current;
      node.rotation(node.rotation() + e.evt.deltaY * 0.2);
      onChange({ ...topping, rotation: node.rotation() });
    },
    [onChange, topping]
  );

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        name="topping"
        image={image}
        x={topping.x}
        y={topping.y}
        rotation={topping.rotation}
        scaleX={topping.scaleX}
        scaleY={topping.scaleY}
        draggable
        ref={shapeRef}
        onClick={handleSelect}
        onTap={handleSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onWheel={handleWheel}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
        />
      )}
    </>
  );
};

// ===== Draggable Text =====
const DraggableText = ({ textItem, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  const handleSelect = useCallback(
    (e) => {
      e.cancelBubble = true;
      onSelect();
    },
    [onSelect]
  );

  const handleDragEnd = useCallback(
    (e) => onChange({ ...textItem, x: e.target.x(), y: e.target.y() }),
    [onChange, textItem]
  );

  const handleTransformEnd = useCallback(() => {
    const node = shapeRef.current;
    onChange({
      ...textItem,
      x: node.x(),
      y: node.y(),
      fontSize: node.fontSize(),
    });
  }, [onChange, textItem]);

  useEffect(() => {
    if (isSelected && trRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaText
        name="text"
        text={textItem.text}
        x={textItem.x}
        y={textItem.y}
        fontSize={textItem.fontSize}
        fill={textItem.color}
        fontStyle="bold"
        fontFamily={textItem.fontFamily}
        draggable
        ref={shapeRef}
        onClick={handleSelect}
        onTap={handleSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      />
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

// ===== Cake Stage =====
const CakeStage = ({
  selectedCake,
  toppings,
  setToppings,
  textList,
  setTextList,
  selectedToppingId,
  setSelectedToppingId,
  selectedTextId,
  setSelectedTextId,
}) => {
  const stageRef = useRef();
  const [cakeImage] = useImage(selectedCake?.src);

  // Click ngoài stage để unselect
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!stageRef.current) return;
      const stageDom = stageRef.current.container();
      if (!stageDom.contains(e.target)) {
        setSelectedToppingId(null);
        setSelectedTextId(null);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [setSelectedToppingId, setSelectedTextId]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedToppingId !== null) {
      setToppings(toppings.filter((_, i) => i !== selectedToppingId));
      setSelectedToppingId(null);
    } else if (selectedTextId !== null) {
      setTextList(textList.filter((_, i) => i !== selectedTextId));
      setSelectedTextId(null);
    }
  }, [
    selectedToppingId,
    selectedTextId,
    toppings,
    textList,
    setToppings,
    setTextList,
  ]);

  const toggleFlipTopping = useCallback(() => {
    if (selectedToppingId === null) return;
    setToppings((prev) =>
      prev.map((t, i) =>
        i === selectedToppingId ? { ...t, scaleX: t.scaleX * -1 } : t
      )
    );
  }, [selectedToppingId, setToppings]);

  const handleExport = useCallback(() => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ mimeType: "image/png" });
    const link = document.createElement("a");
    link.download = "my-cake.png";
    link.href = uri;
    link.click();
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <Stage
        width={400}
        height={400}
        ref={stageRef}
        className="border shadow-md rounded-lg bg-white"
      >
        <Layer>
          {cakeImage && (
            <KonvaImage image={cakeImage} width={400} height={400} />
          )}
          {toppings.map((t, i) => (
            <DraggableTopping
              key={i}
              topping={t}
              isSelected={i === selectedToppingId}
              onSelect={() => {
                setSelectedToppingId(i);
                setSelectedTextId(null);
              }}
              onChange={(newAttrs) => {
                const updated = toppings.slice();
                updated[i] = newAttrs;
                setToppings(updated);
              }}
            />
          ))}
          {textList.map((t, i) => (
            <DraggableText
              key={i}
              textItem={t}
              isSelected={i === selectedTextId}
              onSelect={() => {
                setSelectedTextId(i);
                setSelectedToppingId(null);
              }}
              onChange={(newAttrs) => {
                const updated = textList.slice();
                updated[i] = newAttrs;
                setTextList(updated);
              }}
            />
          ))}
        </Layer>
      </Stage>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="bg-lime-400 text-avocado-brown-100 px-4 py-2 rounded-full hover:shadow-md"
        >
          📸 Xuất ảnh
        </button>
        <button
          onClick={toggleFlipTopping}
          disabled={selectedToppingId === null}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔄 Lật topping
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedToppingId === null && selectedTextId === null}
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed "
        >
          🗑️ Xóa
        </button>
      </div>
    </div>
  );
};

export default CakeStage;
