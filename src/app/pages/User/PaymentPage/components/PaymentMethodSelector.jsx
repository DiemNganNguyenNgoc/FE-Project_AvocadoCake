import React from "react";

const PaymentMethodSelector = ({
  paymentType,
  handlePaymentTypeChange,
  sepayPaymentMethod,
  setSepayPaymentMethod,
  paymentInfo,
  handleInputChange,
}) => {
  return (
    <>
      {/* Payment Type Selection */}
      <div
        className="PaymentTypeHolder"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {/* <label style={{ cursor: "pointer" }}>
          <input
            type="radio"
            value="paypal"
            checked={paymentType === "paypal"}
            onChange={handlePaymentTypeChange}
            style={{ marginRight: "5px" }}
          />
          PayPal
        </label> */}
        {/* <label style={{ cursor: "pointer" }}>
          <input
            type="radio"
            value="qr"
            checked={paymentType === "qr"}
            onChange={handlePaymentTypeChange}
            style={{ marginRight: "5px" }}
          />
          Thanh toán QR
        </label> */}
        <label style={{ cursor: "pointer" }}>
          <input
            type="radio"
            value="sepay"
            checked={paymentType === "sepay"}
            onChange={handlePaymentTypeChange}
            style={{ marginRight: "5px" }}
          />
          Thanh toán QR
        </label>
      </div>

      {/* Sepay Method Selection */}
      {paymentType === "sepay" && (
        <div className="SepayMethodHolder" style={{ padding: "10px 20px" }}>
          <label
            htmlFor="sepay-method"
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "500",
            }}
          >
            Chọn phương thức thanh toán Sepay:
          </label>
          <select
            id="sepay-method"
            className="sepay-method-select"
            value={sepayPaymentMethod}
            onChange={(e) => setSepayPaymentMethod(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            <option value="BANK_TRANSFER">
              Quét mã QR chuyển khoản ngân hàng
            </option>
            <option value="CARD">Thanh toán bằng thẻ tín dụng/ghi nợ</option>
            <option value="NAPAS_BANK_TRANSFER">Quét mã QR NAPAS</option>
          </select>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
            Bạn sẽ được chuyển đến cổng thanh toán Sepay để hoàn tất giao dịch.
          </p>
        </div>
      )}

      {/* QR Payment Details */}
      {/* {paymentType === "qr" && (
        <div className="WalletHolder" style={{ padding: "10px 20px" }}>
          <label
            htmlFor="wallet-select"
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "500",
            }}
          >
            Chọn ví điện tử:
          </label>
          <select
            id="wallet-select"
            className="E-wallet"
            name="Wallet"
            value={paymentInfo.userBank}
            onChange={handleInputChange("userBank")}
            style={{ width: "100%", margin: "10px 0" }}
            aria-label="Chọn ví điện tử thanh toán"
            title="Chọn ví điện tử thanh toán"
          >
            <option value="momo">MoMo</option>
            <option value="vnpay">VNPay</option>
            <option value="techcombank">Techcombank</option>
          </select>
          <div className="inputSdt">
            <label
              htmlFor="bank-number"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "500",
              }}
            >
              {paymentInfo.userBank === "momo"
                ? "Số điện thoại MoMo:"
                : "Số tài khoản ngân hàng:"}
            </label>
            <input
              id="bank-number"
              type="text"
              className="input2"
              placeholder={
                paymentInfo.userBank === "momo"
                  ? "Nhập số điện thoại MoMo"
                  : "Nhập số tài khoản ngân hàng"
              }
              value={paymentInfo.userBankNumber}
              onChange={handleInputChange("userBankNumber")}
              style={{ width: "100%" }}
              aria-label={
                paymentInfo.userBank === "momo"
                  ? "Nhập số điện thoại MoMo"
                  : "Nhập số tài khoản ngân hàng"
              }
              title={
                paymentInfo.userBank === "momo"
                  ? "Nhập số điện thoại MoMo"
                  : "Nhập số tài khoản ngân hàng"
              }
            />
          </div>
        </div>
      )} */}
    </>
  );
};

export default PaymentMethodSelector;
