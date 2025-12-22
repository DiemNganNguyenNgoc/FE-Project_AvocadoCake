import React from "react";

const CoinsSection = ({
  user,
  showCoinsSection,
  setShowCoinsSection,
  isLoadingCoins,
  coinsToUse,
  handleCoinsChange,
  coinsApplied,
  originalTotalPrice,
  handleApplyCoins,
  handleCancelCoins,
}) => {
  if (!user?.id) return null;

  return (
    <div
      className="coins-section"
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h4 style={{ margin: 0, color: "#333" }}>Đổi xu thành tiền</h4>
        <button
          onClick={() => setShowCoinsSection(!showCoinsSection)}
          style={{
            background: "none",
            border: "none",
            color: "#3a060e",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {showCoinsSection ? "Ẩn" : "Hiện"}
        </button>
      </div>

      {showCoinsSection && (
        <div>
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Số xu hiện có: </span>
            <span style={{ color: "#007bff", fontWeight: "bold" }}>
              {isLoadingCoins
                ? "Đang tải..."
                : `${user.coins.toLocaleString()} xu`}
            </span>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Số xu muốn sử dụng (1 xu = 1 VND):
            </label>
            <input
              type="number"
              value={coinsToUse}
              onChange={handleCoinsChange}
              min="0"
              max={Math.min(user.coins, originalTotalPrice)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              placeholder="Nhập số xu muốn sử dụng"
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold" }}>Tiết kiệm được: </span>
            <span style={{ color: "#28a745", fontWeight: "bold" }}>
              {(coinsApplied + coinsToUse).toLocaleString()} VND
            </span>
          </div>

          {coinsApplied > 0 && (
            <div
              style={{
                marginBottom: "10px",
                padding: "8px",
                background: "#e7f3ff",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              <div>Số xu đã áp dụng: {coinsApplied.toLocaleString()} xu</div>
              <div>Số xu muốn thêm: {coinsToUse.toLocaleString()} xu</div>
              <div style={{ fontWeight: "bold", color: "#b1e321" }}>
                Tổng số xu sẽ áp dụng:{" "}
                {(coinsApplied + coinsToUse).toLocaleString()} xu
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  marginTop: "4px",
                }}
              >
                (Sẽ chỉ trừ thêm {coinsToUse.toLocaleString()} xu từ tài khoản)
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleApplyCoins}
              disabled={coinsToUse === 0}
              style={{
                padding: "8px 16px",
                background: coinsToUse === 0 ? "#ccc" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: coinsToUse === 0 ? "not-allowed" : "pointer",
              }}
            >
              Áp dụng xu
            </button>
            <button
              onClick={handleCancelCoins}
              style={{
                padding: "8px 16px",
                background: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Hủy áp dụng
            </button>
          </div>
        </div>
      )}

      {coinsApplied > 0 && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#d4edda",
            borderRadius: "4px",
          }}
        >
          <span style={{ color: "#155724", fontWeight: "bold" }}>
            ✓ Đã áp dụng {coinsApplied.toLocaleString()} xu
          </span>
          <div
            style={{
              marginTop: "5px",
              fontSize: "14px",
              color: "#155724",
            }}
          >
            Tiết kiệm được: {coinsApplied.toLocaleString()} VND
          </div>
          <div
            style={{
              marginTop: "2px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            (Đã trừ {coinsApplied.toLocaleString()} xu từ tài khoản)
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinsSection;
