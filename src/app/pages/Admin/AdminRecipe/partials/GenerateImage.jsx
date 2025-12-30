import React, { useState } from "react";
import {
  Image as ImageIcon,
  Loader2,
  Download,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import recipeAPIService from "../services/RecipeService";
import Button from "../../../../components/AdminLayout/Button";

/**
 * GenerateImage Component
 * Tạo ảnh từ mô tả công thức bánh bằng Pollinations AI
 *
 * Props:
 * - recipe: Object chứa thông tin recipe (title, description, ingredients)
 * - onImageGenerated: Callback khi tạo ảnh thành công (image_url, image_data)
 */
const GenerateImage = ({ recipe, onImageGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateImage = async () => {
    if (!recipe || (!recipe.image_prompt && !recipe.description)) {
      toast.error("❌ Cần có mô tả công thức để tạo ảnh");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("🎨 Full Recipe Object:", recipe);
      console.log("📝 image_prompt field:", recipe.image_prompt);
      console.log("📋 decoration_tips field:", recipe.decoration_tips);

      // IMPROVED: Use full recipe_data để backend có thể trích xuất image_prompt chi tiết
      // Nếu recipe có sẵn image_prompt từ smart generate, backend sẽ dùng nó
      // Còn không, backend sẽ tạo prompt chi tiết từ title + description
      const result = await recipeAPIService.generateImage({
        recipe_data: {
          title: recipe.name || recipe.title,
          description: recipe.description,
          image_prompt: recipe.image_prompt || null, // Pass image_prompt if available
          ingredients: recipe.ingredients,
          tags: recipe.tags,
          decoration_tips: recipe.decoration_tips || null,
        },
      });

      console.log("📸 Image Generation Response:", result);

      if (result.success) {
        setImageUrl(result.image_url);
        setImageData(result.image_data);

        toast.success("🎨 Tạo ảnh thành công!");

        // Callback to parent component
        if (onImageGenerated) {
          onImageGenerated({
            image_url: result.image_url,
            image_data: result.image_data,
            provider: result.provider,
            prompt_used: result.prompt_used,
          });
        }
      } else {
        setError(result.message || "Không thể tạo ảnh");
        toast.error(`❌ ${result.message || "Không thể tạo ảnh"}`);
      }
    } catch (err) {
      console.error("❌ Image Generation Error:", err);
      const errorMsg = err.message || "Lỗi khi tạo ảnh";
      setError(errorMsg);
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!imageData) {
      toast.error("❌ Không có ảnh để tải");
      return;
    }

    try {
      // Convert base64 to blob
      const byteCharacters = atob(imageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${recipe.name || "recipe"}_image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("💾 Đã tải ảnh xuống!");
    } catch (err) {
      toast.error("❌ Không thể tải ảnh");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-avocado-brown-30 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-avocado-green-100" />
          <h3 className="text-xl font-semibold text-avocado-brown-100">
            Tạo Ảnh Minh Họa
          </h3>
        </div>

        <Button
          onClick={handleGenerateImage}
          disabled={loading || !recipe}
          variant="primary"
          size="md"
          className="flex items-center gap-2 px-4 py-2  disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              Tạo Ảnh
            </>
          )}
        </Button>
      </div>

      {/* Description */}
      <p className="text-xl text-gray-600">
        🎨 AI tự động tạo ảnh minh họa chuyên nghiệp từ mô tả công thức{" "}
        <span className="font-semibold text-avocado-green-100">
          (Free, Unlimited - Pollinations AI)
        </span>
      </p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-xl text-red-600">⚠️ {error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-12 h-12 text-avocado-green-100 animate-spin" />
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-avocado-brown-100">
              AI đang vẽ ảnh...
            </p>
            <div className="text-xl text-gray-600 space-y-1">
              <p>🌐 Dịch Vietnamese → English</p>
              <p>🎨 Tạo professional food photography</p>
              <p>✨ Chờ một chút...</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Display */}
      {imageUrl && !loading && (
        <div className="space-y-4">
          {/* Image Preview */}
          <div className="relative rounded-lg overflow-hidden border border-avocado-brown-30">
            <img
              src={imageUrl}
              alt={recipe.name || "Recipe Image"}
              className="w-full h-auto object-cover"
              onError={(e) => {
                console.error("Image load error");
                e.target.src =
                  "https://via.placeholder.com/1024x1024?text=Image+Load+Error";
              }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleDownloadImage}
              variant="primary"
              size="md"
              className="flex items-center gap-2 px-4 py-2 hover:bg-avocado-brown-80 transition-all"
            >
              <Download className="w-4 h-4" />
              Tải xuống
            </Button>

            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border-2 border-avocado-brown-30 text-avocado-brown-100 rounded-lg hover:border-avocado-green-100 hover:text-avocado-green-100 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Mở trong tab mới
            </a>
          </div>

          {/* Info */}
          <div className="bg-avocado-green-10 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-xl">
              <span className="font-medium text-avocado-brown-100">
                Provider:
              </span>
              <span className="text-gray-700">
                Pollinations AI (Free, Unlimited)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xl">
              <span className="font-medium text-avocado-brown-100">Size:</span>
              <span className="text-gray-700">1024x1024 pixels</span>
            </div>
            <div className="flex items-center gap-2 text-xl">
              <span className="font-medium text-avocado-brown-100">
                Quality:
              </span>
              <span className="text-gray-700">
                Professional food photography
              </span>
            </div>
          </div>
        </div>
      )}

      {/* No Recipe State */}
      {!recipe && !loading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg font-semibold text-gray-500 mb-2">
            Chưa có công thức
          </p>
          <p className="text-xl text-gray-400">
            Tạo công thức trước để có thể tạo ảnh minh họa
          </p>
        </div>
      )}
    </div>
  );
};

export default GenerateImage;
