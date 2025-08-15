import React, { useRef, useState, useEffect } from "react";
import styles from "./CreateArt.module.css";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import AIService from "../../../services/AIService";

const CreateArt = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 300 });

  // Cập nhật kích thước canvas khi component mount
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const size = Math.min(container.clientWidth - 32, 300);
        setCanvasSize({ width: size, height: size });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  // Cập nhật canvas khi kích thước thay đổi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Lưu context hiện tại
      const ctx = canvas.getContext("2d");
      const currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Cập nhật kích thước canvas
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      // Khôi phục context
      ctx.putImageData(currentImage, 0, 0);
    }
  }, [canvasSize]);

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getMousePos(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getMousePos(e);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setGeneratedImage(null);
    setError(null);
  };

  const resizeImage = (dataUrl, maxWidth = 96, maxHeight = 96) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Tính toán kích thước mới giữ nguyên tỷ lệ
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // Thêm padding trắng
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);

        // Vẽ ảnh vào giữa
        const offsetX = (width - img.width) / 2;
        const offsetY = (height - img.height) / 2;
        ctx.drawImage(img, offsetX, offsetY, img.width, img.height);

        // Giảm chất lượng ảnh
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.src = dataUrl;
    });
  };

  const generateImage = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      const canvas = canvasRef.current;
      const sketchData = canvas.toDataURL("image/png");

      // Resize ảnh trước khi gửi
      const resizedSketch = await resizeImage(sketchData);
      console.log("Đã resize ảnh, kích thước mới:", resizedSketch.length);

      const result = await AIService.generateCake(resizedSketch);

      if (result.success && result.data.image) {
        setGeneratedImage(result.data.image);
      } else {
        throw new Error(result.error || "Không nhận được ảnh từ server");
      }
    } catch (error) {
      console.error("Lỗi khi tạo ảnh:", error);
      setError(error.error || "Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại!");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `generated-cake-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="lg" className={styles.container}>
      <h4 className={styles.title}>Sáng tạo bánh của bạn</h4>

      <Box className={styles.content}>
        <Paper elevation={3} className={styles.drawingSection}>
          <h2 className={styles.sectionTitle}>Vẽ phác thảo bánh của bạn</h2>
          <Box className={styles.canvasContainer}>
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              className={styles.canvas}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent("mousedown", {
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                });
                canvasRef.current.dispatchEvent(mouseEvent);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const mouseEvent = new MouseEvent("mousemove", {
                  clientX: touch.clientX,
                  clientY: touch.clientY,
                });
                canvasRef.current.dispatchEvent(mouseEvent);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                const mouseEvent = new MouseEvent("mouseup", {});
                canvasRef.current.dispatchEvent(mouseEvent);
              }}
            />
          </Box>
          <Typography variant="caption" className={styles.note}>
            Lưu ý: Ảnh sẽ được tự động thu nhỏ để tối ưu bộ nhớ
          </Typography>
          <Box className={styles.buttonGroup}>
            <Button
              variant="contained"
              color="secondary"
              onClick={clearCanvas}
              className={styles.button}
            >
              Xóa
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={generateImage}
              disabled={isGenerating}
              className={styles.button}
            >
              {isGenerating ? (
                <>
                  <CircularProgress size={24} className={styles.loadingIcon} />
                  Đang tạo...
                </>
              ) : (
                "Tạo ảnh"
              )}
            </Button>
          </Box>
          {error && (
            <Typography color="error" className={styles.error}>
              {error}
            </Typography>
          )}
        </Paper>

        {generatedImage && (
          <Paper elevation={3} className={styles.resultSection}>
            <Typography variant="h6" className={styles.sectionTitle}>
              Kết quả
            </Typography>
            <img
              src={generatedImage}
              alt="Generated cake"
              className={styles.resultImage}
            />
            <Button
              variant="contained"
              color="success"
              onClick={downloadImage}
              className={styles.downloadButton}
            >
              Tải xuống
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default CreateArt;
