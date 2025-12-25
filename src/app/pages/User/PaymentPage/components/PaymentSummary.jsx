import React from "react";

const PaymentSummary = ({
  originalTotalPrice,
  rankDiscount,
  rankDiscountPercent,
  coinsApplied,
  voucherDiscount,
  finalTotalPrice,
}) => {
  return (
    <div
      className="payment-summary"
      style={{
        padding: "15px",
        background: "#f8f9fa",
        borderRadius: "8px",
        marginTop: "20px",
      }}
    >
      <h4 style={{ marginBottom: "15px", color: "#333" }}>
        Chi tiết thanh toán
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tổng tiền hàng:</span>
          <span style={{ fontWeight: "500" }}>
            {originalTotalPrice.toLocaleString()}đ
          </span>
        </div>

        {rankDiscount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#b1e321",
              fontWeight: "500",
            }}
          >
            <span> Giảm giá hạng thành viên ({rankDiscountPercent}%):</span>
            <span>-{rankDiscount.toLocaleString()}đ</span>
          </div>
        )}

        {coinsApplied > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#28a745",
              fontWeight: "500",
            }}
          >
            <span> Giảm từ xu:</span>
            <span>-{coinsApplied.toLocaleString()}đ</span>
          </div>
        )}

        {voucherDiscount > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#b1e321",
              fontWeight: "500",
            }}
          >
            <span> Giảm từ voucher:</span>
            <span>-{voucherDiscount.toLocaleString()}đ</span>
          </div>
        )}

        <div
          style={{
            borderTop: "2px solid #ddd",
            paddingTop: "10px",
            marginTop: "5px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#3a060e",
            }}
          >
            <span>Tổng thanh toán:</span>
            <span style={{ color: "#b1e321" }}>
              {finalTotalPrice.toLocaleString()}đ
            </span>
          </div>
        </div>

        {(rankDiscount > 0 || coinsApplied > 0 || voucherDiscount > 0) && (
          <div
            style={{
              padding: "10px",
              background: "#d4edda",
              borderRadius: "6px",
              fontSize: "14px",
              color: "#155724",
              textAlign: "center",
            }}
          >
            Bạn đã tiết kiệm được:{" "}
            <strong>
              {(rankDiscount + coinsApplied + voucherDiscount).toLocaleString()}
              đ
            </strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummary;
