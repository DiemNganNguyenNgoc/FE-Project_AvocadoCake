import React from "react";
import { Modal } from "react-bootstrap";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import "./ConfirmPaymentModal.css";

const ConfirmPaymentModal = ({
  show,
  onHide,
  onConfirm,
  orderData,
  isLoading,
}) => {
  const {
    originalTotalPrice,
    voucherDiscount,
    coinsApplied,
    finalTotalPrice,
    selectedVouchers,
    paymentType,
  } = orderData || {};

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận thanh toán</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="confirm-payment-content">
          <h5 className="mb-3">Chi tiết đơn hàng</h5>

          <div className="payment-summary">
            <div className="summary-row">
              <span>Tổng tiền hàng:</span>
              <span className="amount">
                {originalTotalPrice?.toLocaleString()} VND
              </span>
            </div>

            {voucherDiscount > 0 && (
              <div className="summary-row discount">
                <span>Giảm giá voucher:</span>
                <span className="amount discount-amount">
                  -{voucherDiscount.toLocaleString()} VND
                </span>
              </div>
            )}

            {coinsApplied > 0 && (
              <div className="summary-row discount">
                <span>Giảm giá từ xu:</span>
                <span className="amount discount-amount">
                  -{coinsApplied.toLocaleString()} VND
                </span>
              </div>
            )}

            <div className="summary-row total">
              <span>Tổng thanh toán:</span>
              <span className="amount total-amount">
                {finalTotalPrice?.toLocaleString()} VND
              </span>
            </div>
          </div>

          {selectedVouchers && selectedVouchers.length > 0 && (
            <div className="voucher-list mt-3">
              <h6>Voucher đã áp dụng:</h6>
              {selectedVouchers.map((voucher) => (
                <div key={voucher._id} className="voucher-item">
                  <span className="voucher-code">{voucher.voucherCode}</span>
                  <span className="voucher-name">{voucher.voucherName}</span>
                </div>
              ))}
            </div>
          )}

          <div className="payment-method mt-3">
            <h6>Phương thức thanh toán:</h6>
            <p>{paymentType === "paypal" ? "PayPal" : "Thanh toán QR"}</p>
          </div>

          <div className="confirmation-note mt-3">
            <p className="text-muted">
              <strong>Lưu ý:</strong> Sau khi xác nhận, voucher sẽ được đánh dấu
              là đã sử dụng và không thể hoàn tác.
            </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <ButtonComponent
          variant="secondary"
          onClick={onHide}
          disabled={isLoading}
        >
          Hủy
        </ButtonComponent>
        <ButtonComponent
          className="customBtn2"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </ButtonComponent>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmPaymentModal;
