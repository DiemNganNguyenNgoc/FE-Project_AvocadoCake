import React, { useEffect, useRef, useState } from "react";
import cakeBase from "../../../assets/img/white.png"; // Ảnh nền trong suốt

export default function CakeDesigner() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#ffffff"); // Mặc định màu trắng
  const cakeImgRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const cakeImg = new Image();
    cakeImg.src = cakeBase;
    cakeImg.onload = () => {
      cakeImgRef.current = cakeImg;
      drawCake(ctx, cakeImg, color);
    };
  }, []);

  useEffect(() => {
    if (cakeImgRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      drawCake(ctx, cakeImgRef.current, color);
    }
  }, [color]);

const drawCake = (ctx, cakeImg, fillColor) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Vẽ nền
  ctx.drawImage(cakeImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Lấy pixel và đổi màu
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const rgb = hexToRgb(fillColor);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) { // pixel có alpha > 0
      data[i] = rgb.r;
      data[i + 1] = rgb.g;
      data[i + 2] = rgb.b;
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};


  return (
    <div style={{ textAlign: "center" }}>
      <h2>Tô màu bánh kem</h2>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ marginBottom: "10px", cursor: "pointer" }}
      />
      <br />
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid #ccc", background: "transparent" }}
      />
    </div>
  );
}
