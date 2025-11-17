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
    onChange({
      ...topping,
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    });
  }, [onChange, topping]);

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
      />
      {isSelected && <Transformer ref={trRef} rotateEnabled />}
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
    (e) => {
      onChange({ ...textItem, x: e.target.x(), y: e.target.y() });
    },
    [onChange, textItem]
  );

  const handleTransformEnd = useCallback(() => {
    const node = shapeRef.current;
    onChange({
      ...textItem,
      x: node.x(),
      y: node.y(),
      fontSize: node.fontSize,
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

// ===== Cake Stage Component =====
const CakeStage = ({
  selectedCake,
  toppings,
  setToppings,
  textList,
  setTextList,
  selectedTextId,
  setSelectedTextId,
}) => {
  const [cakeImage] = useImage(selectedCake?.src);
  const [selectedToppingId, setSelectedToppingId] = useState(null);
  const stageRef = useRef();

  // Undo/Redo history
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  // Clipboard
  const clipboardRef = useRef(null);

  const saveHistory = useCallback(() => {
    setHistory((h) => [
      ...h,
      { toppings: [...toppings], textList: [...textList] },
    ]);
    setFuture([]);
  }, [toppings, textList]);

  const handleStageClick = useCallback((e) => {
    // Nếu click không phải topping/text
    if (e.target.name() !== "topping" && e.target.name() !== "text") {
      setSelectedToppingId(null);
      setSelectedTextId(null);
    }
  }, []);

  const handleDeleteSelected = useCallback(() => {
    saveHistory();
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
    saveHistory,
  ]);

  const toggleFlipTopping = useCallback(() => {
    if (selectedToppingId === null) return;
    saveHistory();
    setToppings((prev) =>
      prev.map((t, i) =>
        i === selectedToppingId ? { ...t, scaleX: t.scaleX * -1 } : t
      )
    );
  }, [selectedToppingId, setToppings, saveHistory]);

  const handleExport = useCallback(() => {
    const uri = stageRef.current.toDataURL({ mimeType: "image/png" });
    const link = document.createElement("a");
    link.download = "my-cake.png";
    link.href = uri;
    link.click();
  }, []);

  // Keydown for Delete, Ctrl+C/V/Z/Y
  const handleKeyDown = useCallback(
    (e) => {
      if (e.ctrlKey && e.key === "c") {
        if (selectedToppingId !== null)
          clipboardRef.current = {
            type: "topping",
            item: toppings[selectedToppingId],
          };
        else if (selectedTextId !== null)
          clipboardRef.current = {
            type: "text",
            item: textList[selectedTextId],
          };
      } else if (e.ctrlKey && e.key === "v") {
        if (clipboardRef.current) {
          saveHistory();
          if (clipboardRef.current.type === "topping") {
            setToppings([
              ...toppings,
              { ...clipboardRef.current.item, x: 200, y: 200, id: Date.now() },
            ]);
          } else if (clipboardRef.current.type === "text") {
            setTextList([
              ...textList,
              { ...clipboardRef.current.item, x: 200, y: 200, id: Date.now() },
            ]);
          }
        }
      } else if (e.ctrlKey && e.key === "z") {
        if (history.length > 0) {
          const last = history[history.length - 1];
          setFuture((f) => [
            ...f,
            { toppings: [...toppings], textList: [...textList] },
          ]);
          setToppings(last.toppings);
          setTextList(last.textList);
          setHistory((h) => h.slice(0, h.length - 1));
          setSelectedToppingId(null);
          setSelectedTextId(null);
        }
      } else if (e.key === "Delete" || e.key === "Backspace") {
        handleDeleteSelected();
      }
    },
    [
      selectedToppingId,
      selectedTextId,
      toppings,
      textList,
      history,
      future,
      saveHistory,
      handleDeleteSelected,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
        >
          📸 Xuất ảnh
        </button>
        <button
          onClick={toggleFlipTopping}
          disabled={selectedToppingId === null}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 disabled:opacity-50"
        >
          🔄 Lật topping
        </button>
        <button
          onClick={handleDeleteSelected}
          disabled={selectedToppingId === null && selectedTextId === null}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 disabled:opacity-50"
        >
          🗑️ Xóa
        </button>
      </div>
    </div>
  );
};

export default CakeStage;
