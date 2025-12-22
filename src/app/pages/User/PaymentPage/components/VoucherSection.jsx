import React from "react";
import { Ticket, X, Tag } from "lucide-react";

const VoucherSection = ({
  voucherCode,
  setVoucherCode,
  handleApplyVoucherCode,
  selectedVouchers,
  handleRemoveVoucher,
  setIsVoucherModalOpen,
  voucherDiscount,
}) => {
  return (
    <div
      className="voucher-section"
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "2px solid #b1e321",
        borderRadius: "24px",
        background: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <Ticket
          className="w-6 h-6"
          style={{ color: "#b1e321", marginRight: "8px" }}
        />
        <h4 style={{ margin: 0, color: "#3a060e", fontWeight: "bold" }}>
          Voucher giảm giá
        </h4>
      </div>

      {/* Voucher Input */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "15px",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <Tag
            className="w-5 h-5"
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#b1e321",
            }}
          />
          <input
            type="text"
            value={voucherCode}
            onChange={(e) => setVoucherCode(e.target.value)}
            placeholder="Nhập mã voucher"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleApplyVoucherCode();
              }
            }}
            style={{
              width: "100%",
              padding: "10px 12px 10px 40px",
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.3s ease",
            }}
          />
        </div>
        <button
          onClick={handleApplyVoucherCode}
          style={{
            padding: "10px 24px",
            background: "linear-gradient(135deg, #b1e321 0%, #8bc34a 100%)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(177, 227, 33, 0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 12px rgba(177, 227, 33, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(177, 227, 33, 0.3)";
          }}
        >
          Áp dụng
        </button>
      </div>

      {/* Select from Available Vouchers Button */}
      <button
        onClick={() => setIsVoucherModalOpen(true)}
        style={{
          width: "100%",
          padding: "12px",
          background: "white",
          color: "#3a060e",
          border: "2px dashed #b1e321",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "15px",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "#f8ffe6";
          e.target.style.borderStyle = "solid";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "white";
          e.target.style.borderStyle = "dashed";
        }}
      >
        Chọn từ danh sách voucher
      </button>

      {/* Selected Vouchers */}
      {selectedVouchers.length > 0 && (
        <div>
          <p
            style={{
              fontSize: "13px",
              color: "#666",
              marginBottom: "10px",
              fontWeight: "500",
            }}
          >
            Voucher đã chọn ({selectedVouchers.length}):
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {selectedVouchers.map((voucher) => (
              <div
                key={voucher._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px",
                  background:
                    "linear-gradient(135deg, #fff9e6 0%, #f0f9d9 100%)",
                  border: "1px solid #e8f5c8",
                  borderRadius: "12px",
                  fontSize: "13px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <Ticket className="w-4 h-4" style={{ color: "#b1e321" }} />
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#3a060e",
                        fontSize: "14px",
                      }}
                    >
                      {voucher.voucherCode}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 4px 28px",
                      color: "#666",
                      fontSize: "12px",
                    }}
                  >
                    {voucher.voucherName}
                  </p>
                  <p
                    style={{
                      margin: "0 0 0 28px",
                      color: "#b1e321",
                      fontWeight: "600",
                      fontSize: "13px",
                    }}
                  >
                    {voucher.voucherType === "PERCENTAGE" &&
                      `Giảm ${voucher.discountValue}%`}
                    {voucher.voucherType === "FIXED_AMOUNT" &&
                      `Giảm ${voucher.discountValue.toLocaleString()}đ`}
                    {voucher.voucherType === "FREE_SHIPPING" && "Miễn phí ship"}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveVoucher(voucher._id)}
                  style={{
                    background: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#fee";
                    e.target.style.borderColor = "#f88";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "white";
                    e.target.style.borderColor = "#e0e0e0";
                  }}
                >
                  <X className="w-4 h-4" style={{ color: "#dc3545" }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voucher Discount Display */}
      {voucherDiscount > 0 && (
        <div
          style={{
            marginTop: "15px",
            padding: "12px",
            background: "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <span
            style={{
              color: "#155724",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            ✓ Tổng giảm giá từ voucher
          </span>
          <span
            style={{
              color: "#155724",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            -{voucherDiscount.toLocaleString()}đ
          </span>
        </div>
      )}
    </div>
  );
};

export default VoucherSection;
