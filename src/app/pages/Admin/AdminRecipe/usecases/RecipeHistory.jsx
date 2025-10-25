import React, { useState } from "react";
import { toast } from "react-toastify";
import useAdminRecipeStore from "../adminRecipeStore";
import RecipeDisplay from "../components/RecipeDisplay";
import "./RecipeHistory.css";

/**
 * RecipeHistory Component
 * Hiển thị lịch sử các công thức đã tạo
 */
const RecipeHistory = () => {
  const { recipeHistory, deleteFromHistory, clearHistory } =
    useAdminRecipeStore();

  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filterType, setFilterType] = useState("all");

  /**
   * Get type icon
   */
  const getTypeIcon = (type) => {
    switch (type) {
      case "from-ingredients":
        return "🥄";
      case "from-trend":
        return "🔥";
      case "smart-recipe":
        return "🤖";
      default:
        return "📝";
    }
  };

  /**
   * Get type label
   */
  const getTypeLabel = (type) => {
    switch (type) {
      case "from-ingredients":
        return "Từ Nguyên Liệu";
      case "from-trend":
        return "Từ Xu Hướng";
      case "smart-recipe":
        return "Công Thức Thông Minh";
      default:
        return "Khác";
    }
  };

  /**
   * Format date
   */
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  /**
   * Handle delete
   */
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa công thức này?")) {
      deleteFromHistory(id);
      toast.success("✅ Đã xóa công thức");
      if (selectedRecipe?.id === id) {
        setSelectedRecipe(null);
      }
    }
  };

  /**
   * Handle clear all
   */
  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ lịch sử?")) {
      clearHistory();
      setSelectedRecipe(null);
      toast.success("✅ Đã xóa toàn bộ lịch sử");
    }
  };

  /**
   * Filter recipes
   */
  const filteredHistory =
    filterType === "all"
      ? recipeHistory
      : recipeHistory.filter((recipe) => recipe.type === filterType);

  return (
    <div className="recipe-history">
      {!selectedRecipe ? (
        <>
          {/* Header */}
          <div className="history-header">
            <div>
              <h2 className="history-title">📚 Lịch Sử Công Thức</h2>
              <p className="history-subtitle">
                Tổng cộng: <strong>{recipeHistory.length}</strong> công thức
              </p>
            </div>
            {recipeHistory.length > 0 && (
              <button onClick={handleClearAll} className="btn-clear-all">
                🗑️ Xóa tất cả
              </button>
            )}
          </div>

          {/* Filter */}
          {recipeHistory.length > 0 && (
            <div className="history-filter">
              <label className="filter-label">Lọc theo loại:</label>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${
                    filterType === "all" ? "active" : ""
                  }`}
                  onClick={() => setFilterType("all")}
                >
                  Tất cả ({recipeHistory.length})
                </button>
                <button
                  className={`filter-btn ${
                    filterType === "from-ingredients" ? "active" : ""
                  }`}
                  onClick={() => setFilterType("from-ingredients")}
                >
                  🥄 Từ Nguyên Liệu
                </button>
                <button
                  className={`filter-btn ${
                    filterType === "from-trend" ? "active" : ""
                  }`}
                  onClick={() => setFilterType("from-trend")}
                >
                  🔥 Từ Xu Hướng
                </button>
                <button
                  className={`filter-btn ${
                    filterType === "smart-recipe" ? "active" : ""
                  }`}
                  onClick={() => setFilterType("smart-recipe")}
                >
                  🤖 Thông Minh
                </button>
              </div>
            </div>
          )}

          {/* History List */}
          {filteredHistory.length === 0 ? (
            <div className="history-empty">
              <div className="empty-icon">📭</div>
              <h3>Chưa có lịch sử</h3>
              <p>Các công thức bạn tạo sẽ được lưu tại đây</p>
            </div>
          ) : (
            <div className="history-grid">
              {filteredHistory.map((recipe) => (
                <div key={recipe.id} className="history-card">
                  <div className="card-header">
                    <span className="type-badge">
                      {getTypeIcon(recipe.type)} {getTypeLabel(recipe.type)}
                    </span>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="btn-delete"
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="card-body">
                    <h3 className="recipe-name">
                      {recipe.result?.recipe?.title ||
                        recipe.result?.title ||
                        "Công thức"}
                    </h3>
                    <p className="recipe-description">
                      {recipe.result?.recipe?.description ||
                        recipe.result?.description ||
                        ""}
                    </p>

                    {/* Input Info */}
                    <div className="input-info">
                      {recipe.data?.ingredients && (
                        <div className="info-item">
                          <span className="info-label">Nguyên liệu:</span>
                          <span className="info-value">
                            {recipe.data.ingredients.substring(0, 50)}...
                          </span>
                        </div>
                      )}
                      {recipe.data?.trend && (
                        <div className="info-item">
                          <span className="info-label">Xu hướng:</span>
                          <span className="info-value">
                            {recipe.data.trend}
                          </span>
                        </div>
                      )}
                      {recipe.data?.user_segment && (
                        <div className="info-item">
                          <span className="info-label">Segment:</span>
                          <span className="info-value">
                            {recipe.data.user_segment}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="card-footer">
                      <span className="timestamp">
                        🕐 {formatDate(recipe.timestamp)}
                      </span>
                      <button
                        onClick={() => setSelectedRecipe(recipe)}
                        className="btn-view"
                      >
                        👁️ Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="recipe-detail-view">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="btn-back-history"
          >
            ← Quay lại lịch sử
          </button>

          <RecipeDisplay recipe={selectedRecipe.result} />
        </div>
      )}
    </div>
  );
};

export default RecipeHistory;
