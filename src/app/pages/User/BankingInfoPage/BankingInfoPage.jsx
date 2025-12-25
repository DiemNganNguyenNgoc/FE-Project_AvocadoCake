import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BankingInfoPage.css";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../../redux/slides/cartSlide";
import { updateOrder } from "../../../redux/slides/orderSlide";
import {
  getDetailsOrder,
  updateOrderStatus,
} from "../../../api/services/OrderService";
import { getAllStatus } from "../../../api/services/StatusService";

const BankingInfoPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    qrCodeUrl,
    paymentCode,
    expiresAt,
    adminBankInfo,
    selectedProductIds,
    coinsApplied = 0,
    voucherDiscount = 0,
    rankDiscount = 0,
    rankDiscountPercent = 0,
    finalTotalPrice: passedFinalTotal,
    originalTotalPrice: passedOriginalTotal,
  } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [orderStatus, setOrderStatus] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const orderDetails = useSelector((state) => state.order);
  const lastOrder = orderDetails.orders?.[orderDetails.orders.length - 1] || {};

  // Đồng bộ trạng thái đơn hàng với backend khi component mount
  useEffect(() => {
    if (lastOrder?.orderId) {
      syncOrderWithBackend();
    }
  }, [lastOrder?.orderId]);

  const syncOrderWithBackend = async () => {
    try {
      const response = await getDetailsOrder(lastOrder.orderId);
      if (response?.status === "OK" && response.data) {
        const backendOrder = response.data;

        // Cập nhật lastOrder trong Redux với thông tin từ backend
        dispatch(
          updateOrder({
            orderId: lastOrder.orderId,
            updatedData: {
              totalPrice: backendOrder.totalPrice,
              coinsUsed: backendOrder.coinsUsed || 0,
            },
          })
        );
      }
    } catch (error) {
      console.error("Error syncing order with backend:", error);
    }
  };

  // Sử dụng giá trị được truyền từ PaymentPage hoặc tính toán từ lastOrder
  const originalTotalPrice =
    passedOriginalTotal ||
    (lastOrder.totalItemPrice || 0) + (lastOrder.shippingPrice || 0);
  const finalTotalPrice =
    passedFinalTotal ||
    lastOrder.totalPrice ||
    originalTotalPrice - (lastOrder.coinsUsed || 0);
  const coinsAppliedFromOrder = coinsApplied || lastOrder.coinsUsed || 0;
  const voucherDiscountApplied = voucherDiscount || 0;

  const resolvedOrderItems =
    lastOrder.orderItems?.map((item) => {
      return {
        ...item,
        name: item.productName || "Sản phẩm",
        price: item.total / item.quantity,
      };
    }) || [];

  useEffect(() => {
    if (!paymentCode) {
      setMessage("Không tìm thấy mã thanh toán.");
      return;
    }

    console.log("Received qrCodeUrl:", qrCodeUrl);

    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiresAt);
      const diff = expiry - now;
      if (diff <= 0) {
        setTimeLeft(0);
        setMessage("QR đã hết hạn.");
        return;
      }
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes} phút ${seconds} giây`);
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/payment/get-detail-payment/${paymentCode}`
        );
        if (response.data.status === "OK") {
          const payment = response.data.data;
          setPaymentStatus(payment.status);

          try {
            const orderResponse = await axios.get(
              `http://localhost:3001/api/order/get-detail-order/${payment.orderId}`
            );
            if (orderResponse.data.status === "OK") {
              const order = orderResponse.data.data;
              setOrderStatus(order.status.statusName);

              if (payment.status === "SUCCESS") {
                setMessage("Thanh toán thành công!");
                setTimeout(() => navigate("/"), 3000);
              } else if (payment.status === "FAILED") {
                setMessage("Thanh toán thất bại. Vui lòng thử lại.");
              }
            } else {
              setOrderStatus("Không xác định");
            }
          } catch (orderError) {
            console.error("Error fetching order:", orderError);
            setOrderStatus("Không xác định");
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setMessage(
          "Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại sau."
        );
      }
    };

    const interval = setInterval(checkPaymentStatus, 5000);
    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, [paymentCode, navigate, expiresAt, dispatch]);

  const handleBack = () => {
    navigate("/payment");
  };

  const handleDone = async () => {
    try {
      // 1. Cập nhật trạng thái đơn hàng sang "PAID" (Đã thanh toán)
      if (lastOrder.orderId) {
        const accessToken = localStorage.getItem("access_token");

        // Lấy danh sách tất cả status
        const statusResponse = await getAllStatus(accessToken);
        const allStatuses = statusResponse.data || statusResponse;

        // Tìm status "PAID"
        const paidStatus = allStatuses.find(
          (status) => status.statusCode === "PAID"
        );

        if (paidStatus) {
          // Cập nhật trạng thái đơn hàng
          await updateOrderStatus(
            lastOrder.orderId,
            paidStatus._id,
            accessToken
          );
          console.log("✅ Đã cập nhật trạng thái đơn hàng sang PAID");
          setMessage("Đã xác nhận thanh toán thành công! 🎉");
        } else {
          console.warn("⚠️ Không tìm thấy status PAID");
        }
      }

      // 2. Xóa sản phẩm đã mua khỏi giỏ hàng
      if (lastOrder.orderItems && lastOrder.orderItems.length > 0) {
        try {
          // Lấy cart hiện tại từ localStorage
          const cartData = JSON.parse(localStorage.getItem("cart")) || {
            products: [],
          };

          // Lấy danh sách ID sản phẩm đã mua từ lastOrder
          const purchasedProductIds = lastOrder.orderItems.map(
            (item) => item.product
          );

          // Lọc ra các sản phẩm chưa mua
          const remainingProducts = cartData.products.filter(
            (product) => !purchasedProductIds.includes(product.id)
          );

          // Cập nhật lại cart trong localStorage
          localStorage.setItem(
            "cart",
            JSON.stringify({ products: remainingProducts })
          );

          // Cập nhật Redux store
          purchasedProductIds.forEach((productId) => {
            dispatch(removeFromCart({ id: productId }));
          });

          console.log("✅ Đã xóa sản phẩm đã mua khỏi giỏ hàng");
        } catch (error) {
          console.error("Error updating cart:", error);
        }
      }

      // 3. Chuyển về trang chủ sau 2 giây
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("❌ Error in handleDone:", error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      // Vẫn cho phép navigate về home sau 3 giây dù có lỗi
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  return (
    <div className="container-xl">
      <div className="title-row">
        <BackIconComponent handleBack={handleBack} />
        <h2 className="title__content">Thông tin thanh toán</h2>
      </div>
      <div className="container-banking">
        <div className="order-details">
          <h3>Chi tiết đơn hàng</h3>
          {resolvedOrderItems.length > 0 ? (
            resolvedOrderItems.map((item, index) => (
              <div key={index} className="order-item">
                <p>
                  {item.name} x {item.quantity}: {item.total?.toLocaleString()}{" "}
                  VND
                </p>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào trong đơn hàng</p>
          )}
          <div className="order-total">
            Tổng tiền: {finalTotalPrice?.toLocaleString() || 0} VND
          </div>
          {(coinsAppliedFromOrder > 0 ||
            voucherDiscountApplied > 0 ||
            rankDiscount > 0) && (
            <div
              className="coins-info"
              style={{
                marginTop: "10px",
                padding: "10px",
                background: "#d4edda",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              <div style={{ marginBottom: "5px" }}>
                <span style={{ fontWeight: "bold" }}>Tổng tiền gốc: </span>
                <span>{originalTotalPrice?.toLocaleString()} VND</span>
              </div>
              {rankDiscount > 0 && (
                <div style={{ marginBottom: "5px" }}>
                  <span style={{ fontWeight: "bold", color: "#d4af37" }}>
                    Giảm giá hạng ({rankDiscountPercent}%):{" "}
                  </span>
                  <span style={{ color: "#d4af37" }}>
                    -{rankDiscount?.toLocaleString()} VND
                  </span>
                </div>
              )}
              {voucherDiscountApplied > 0 && (
                <div style={{ marginBottom: "5px" }}>
                  <span style={{ fontWeight: "bold", color: "#b1e321" }}>
                    Giảm giá voucher:{" "}
                  </span>
                  <span style={{ color: "#b1e321" }}>
                    -{voucherDiscountApplied?.toLocaleString()} VND
                  </span>
                </div>
              )}
              {coinsAppliedFromOrder > 0 && (
                <div style={{ marginBottom: "5px" }}>
                  <span style={{ fontWeight: "bold", color: "#28a745" }}>
                    Giảm giá từ xu:{" "}
                  </span>
                  <span style={{ color: "#28a745" }}>
                    -{coinsAppliedFromOrder?.toLocaleString()} VND
                  </span>
                </div>
              )}
              <div>
                <span style={{ fontWeight: "bold" }}>
                  Tổng tiền thanh toán:{" "}
                </span>
                <span style={{ fontWeight: "bold", color: "#007bff" }}>
                  {finalTotalPrice?.toLocaleString()} VND
                </span>
              </div>
            </div>
          )}
          {timeLeft !== null && (
            <div className="expiry-time">
              <p>
                Thời gian hết hạn QR: {timeLeft === 0 ? "Hết hạn" : timeLeft}
              </p>
            </div>
          )}
        </div>
        <div className="banking-info">
          {paymentStatus === "PENDING" && qrCodeUrl && timeLeft !== 0 ? (
            <div className="item-banking">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" />
              ) : (
                <div className="qr-error">
                  <p>Không thể tạo mã QR. Vui lòng thử lại sau.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="payment-message">
              <h3>{message}</h3>
              <p>Trạng thái đơn hàng: {orderStatus || "Không xác định"}</p>
            </div>
          )}
        </div>
      </div>
      <ButtonComponent onClick={handleDone} className="payment-button">
        Đã thanh toán
      </ButtonComponent>
    </div>
  );
};

export default BankingInfoPage;
