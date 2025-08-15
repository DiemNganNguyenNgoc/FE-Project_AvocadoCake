import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import ProductInforCustom from "../../../components/ProductInfor/ProductInforCustom";
import { useSelector, useDispatch } from "react-redux";
import * as PaymentService from "../../../services/PaymentService";
import * as UserService from "../../../services/UserService";
import * as OrderService from "../../../services/OrderService";
import { createPayment } from "../../../redux/slides/paymentSlide";
import { updateUserCoins } from "../../../redux/slides/userSlide";
import axios from "axios";
import { getDetailsOrder } from "../../../services/OrderService";
import {
  clearSelectedProductDetails,
  updateOrder,
} from "../../../redux/slides/orderSlide";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.order);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  const lastOrder = orderDetails.orders?.[orderDetails.orders.length - 1] || {};
  const {
    orderItems = [],
    totalPrice,
    shippingAddress,
    paymentMethod,
  } = lastOrder;

  console.log("laddd order", lastOrder);

  const resolvedOrderItems = orderItems.map((item) => {
    const product = cart.products.find((p) => p.id === item.product);
    return {
      ...item,
      img: product?.img || "default_image_url",
      name: product?.title || "Unknown Product",
      price:
        typeof product?.price === "number"
          ? product.price
          : parseFloat((product?.price || "0").replace(/[^0-9.-]+/g, "")) || 0,
    };
  });

  const [paymentType, setPaymentType] = useState("qr");
  const [paymentInfo, setPaymentInfo] = useState({
    userBank: "momo", // Khởi tạo mặc định là momo
    userBankNumber: "",
    phoneNumber: "",
    wallet: "momo",
  });

  // State cho tính năng đổi xu
  const [coinsToUse, setCoinsToUse] = useState(0);
  const [showCoinsSection, setShowCoinsSection] = useState(false);
  const [isLoadingCoins, setIsLoadingCoins] = useState(false);
  const [coinsApplied, setCoinsApplied] = useState(0);
  const [finalTotalPrice, setFinalTotalPrice] = useState(0);

  const access_token = localStorage.getItem("access_token");

  // Tính toán tổng tiền ban đầu
  const originalTotalPrice =
    (lastOrder.totalItemPrice || 0) + (lastOrder.shippingPrice || 0);

  useEffect(() => {
    setFinalTotalPrice(originalTotalPrice - coinsApplied);
  }, [originalTotalPrice, coinsApplied]);

  // Lấy thông tin xu của user khi component mount
  useEffect(() => {
    if (user?.id && access_token) {
      fetchUserCoins();
    }
  }, [user, access_token]);

  // Đồng bộ trạng thái đơn hàng với backend khi component mount
  useEffect(() => {
    if (lastOrder?.orderId && access_token) {
      syncOrderWithBackend();
    }
  }, [lastOrder?.orderId, access_token]);

  const fetchUserCoins = async () => {
    try {
      setIsLoadingCoins(true);
      const response = await UserService.checkUserCoins(access_token);
      if (response.status === "OK") {
        dispatch(updateUserCoins(response.data.coins || 0));
      }
    } catch (error) {
      console.error("Error fetching user coins:", error);
    } finally {
      setIsLoadingCoins(false);
    }
  };

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
              // Có thể thêm các trường khác nếu cần
            },
          })
        );

        // Cập nhật coinsApplied nếu có xu đã được áp dụng
        if (backendOrder.coinsUsed && backendOrder.coinsUsed > 0) {
          setCoinsApplied(backendOrder.coinsUsed);
        }
      }
    } catch (error) {
      console.error("Error syncing order with backend:", error);
    }
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
    setPaymentInfo({
      ...paymentInfo,
      userBank: e.target.value === "qr" ? "momo" : "",
      userBankNumber: "",
      wallet: e.target.value === "qr" ? "momo" : "",
    });
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (field === "phoneNumber" && !/^\d*$/.test(value)) return;
    setPaymentInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Xử lý thay đổi số xu muốn sử dụng
  const handleCoinsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setCoinsToUse(value);
  };

  // Xử lý áp dụng xu
  const handleApplyCoins = async () => {
    if (!lastOrder?.orderId) {
      alert("Không tìm thấy đơn hàng. Vui lòng quay lại và thử lại.");
      return;
    }

    if (coinsToUse < 0) {
      alert("Số xu không được âm");
      return;
    }

    // Kiểm tra số xu mới muốn áp dụng
    if (coinsToUse > user.coins) {
      alert(
        `Bạn chỉ có ${user.coins} xu, không đủ để sử dụng ${coinsToUse} xu`
      );
      return;
    }

    const maxCoinsCanUse = originalTotalPrice - coinsApplied; // Chỉ còn lại số xu có thể áp dụng
    if (coinsToUse > maxCoinsCanUse) {
      alert(`Số xu tối đa có thể áp dụng thêm là ${maxCoinsCanUse} xu`);
      return;
    }

    try {
      // Gửi tổng số xu muốn áp dụng (bao gồm cả số xu đã áp dụng trước đó)
      const totalCoinsToApply = coinsApplied + coinsToUse;

      const response = await OrderService.applyCoinsToOrder(
        lastOrder.orderId,
        totalCoinsToApply, // Gửi tổng số xu muốn áp dụng
        access_token
      );

      if (response.status === "OK") {
        setCoinsApplied(totalCoinsToApply); // Cập nhật số xu đã áp dụng
        dispatch(updateUserCoins(response.data.remainingCoins));

        // Cập nhật lastOrder trong Redux với thông tin mới
        dispatch(
          updateOrder({
            orderId: lastOrder.orderId,
            updatedData: {
              totalPrice:
                response.data.updatedOrder?.totalPrice ||
                originalTotalPrice - totalCoinsToApply,
              coinsUsed: totalCoinsToApply,
            },
          })
        );

        const coinsDeducted = response.data.coinsDeducted || coinsToUse;
        alert(
          `Đã áp dụng thêm ${coinsToUse} xu thành công! (Tổng: ${totalCoinsToApply} xu, Đã trừ: ${coinsDeducted} xu)`
        );
      } else {
        alert(response.message || "Có lỗi xảy ra khi áp dụng xu");
      }
    } catch (error) {
      console.error("Error applying coins:", error);
      alert(error.message || "Có lỗi xảy ra khi áp dụng xu");
    }
  };

  // Xử lý hủy áp dụng xu
  const handleCancelCoins = async () => {
    if (coinsApplied === 0) {
      setCoinsToUse(0);
      setShowCoinsSection(false);
      return;
    }

    try {
      const response = await OrderService.applyCoinsToOrder(
        lastOrder.orderId,
        0,
        access_token
      );

      if (response.status === "OK") {
        setCoinsApplied(0);
        setCoinsToUse(0);
        dispatch(updateUserCoins(response.data.remainingCoins));

        // Cập nhật lastOrder trong Redux với thông tin mới
        dispatch(
          updateOrder({
            orderId: lastOrder.orderId,
            updatedData: {
              totalPrice:
                response.data.updatedOrder?.totalPrice || originalTotalPrice,
              coinsUsed: 0,
            },
          })
        );

        setShowCoinsSection(false);
        alert("Đã hủy áp dụng xu thành công!");
      } else {
        alert(response.message || "Có lỗi xảy ra khi hủy áp dụng xu");
      }
    } catch (error) {
      console.error("Error canceling coins:", error);
      alert(error.message || "Có lỗi xảy ra khi hủy áp dụng xu");
    }
  };

  const handleClickBack = () => {
    // navigate("/order-information", { state: { ...location.state } });
    navigate("/order-information");
  };

  const handleClickPay = async () => {
    if (!lastOrder?.orderId) {
      alert("Không tìm thấy đơn hàng. Vui lòng quay lại và thử lại.");
      return;
    }

    // Kiểm tra xem đơn hàng có tồn tại không
    try {
      const orderCheckResponse = await getDetailsOrder(lastOrder.orderId);
      console.log("orderCheckResponse", orderCheckResponse);

      if (!orderCheckResponse || !orderCheckResponse.data) {
        alert(
          "Đơn hàng không tồn tại hoặc đã bị hủy. Vui lòng quay lại và thử lại."
        );
        return;
      }

      // Kiểm tra trạng thái thanh toán của đơn hàng
      if (orderCheckResponse.data.paymentStatus === "SUCCESS") {
        alert("Đơn hàng này đã được thanh toán trước đó.");
        return;
      }
    } catch (error) {
      console.error("Error checking order:", error);
      alert("Không thể kiểm tra đơn hàng. Vui lòng thử lại sau.");
      return;
    }

    const paymentData = {
      paymentCode: `PAY-${Date.now()}`,
      userBank: paymentInfo.userBank,
      userBankNumber: paymentInfo.userBankNumber,
      paymentMethod: paymentType,
      orderId: lastOrder.orderId,
      totalPrice: finalTotalPrice, // Sử dụng tổng tiền sau khi trừ xu
    };

    if (paymentType === "paypal") {
      try {
        const response = await PaymentService.createPayment(paymentData);
        console.log("PayPal response:", response);

        if (response?.status === "OK") {
          dispatch(clearSelectedProductDetails()); // Xóa selectedProductDetails
          window.location.href = response.data.paymentUrl;
        } else {
          alert(
            "Thanh toán PayPal thất bại: " +
              (response.message || "Lỗi không xác định")
          );
        }
      } catch (error) {
        console.error("Error in handleClickPay (PayPal):", error);
        alert("Đã xảy ra lỗi khi gọi PayPal. Vui lòng thử lại.");
      }
    } else if (paymentType === "qr") {
      if (!paymentInfo.userBank) {
        alert("Vui lòng chọn loại ví thanh toán!");
        return;
      }

      if (!paymentInfo.userBankNumber) {
        alert("Vui lòng nhập số điện thoại hoặc số tài khoản!");
        return;
      }

      try {
        const response = await PaymentService.createQrPayment(paymentData);
        console.log("QR response:", response);

        if (response?.status === "OK") {
          dispatch(clearSelectedProductDetails()); // Xóa selectedProductDetails
          navigate("/banking-info", {
            state: {
              qrCodeUrl: response.data.qrCodeUrl,
              paymentCode: response.data.paymentCode,
              expiresAt: response.data.expiresAt,
              adminBankInfo: response.data.adminBankInfo,
              coinsApplied: response.data.coinsUsed,
            },
          });
        } else {
          alert(
            "Tạo QR thất bại: " + (response.message || "Lỗi không xác định")
          );
        }
      } catch (error) {
        console.error("Error in handleClickPay (QR):", error);
        alert("Đã xảy ra lỗi khi tạo QR. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="container-xl">
      <div className="container-xl-pay">
        <div className="PaymentInfor">
          <p className="pThongtin">Thông tin thanh toán</p>

          {/* Phần đổi xu */}
          {user?.id && (
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
                    color: "#007bff",
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
                      <div>
                        Số xu đã áp dụng: {coinsApplied.toLocaleString()} xu
                      </div>
                      <div>
                        Số xu muốn thêm: {coinsToUse.toLocaleString()} xu
                      </div>
                      <div style={{ fontWeight: "bold", color: "#007bff" }}>
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
                        (Sẽ chỉ trừ thêm {coinsToUse.toLocaleString()} xu từ tài
                        khoản)
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
          )}

          <div
            className="PaymentTypeHolder"
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 20px",
            }}
          >
            <label>
              <input
                type="radio"
                value="paypal"
                checked={paymentType === "paypal"}
                onChange={handlePaymentTypeChange}
              />
              PayPal
            </label>
            <label>
              <input
                type="radio"
                value="qr"
                checked={paymentType === "qr"}
                onChange={handlePaymentTypeChange}
              />
              Thanh toán QR
            </label>
          </div>

          {paymentType === "qr" && (
            <div className="WalletHolder">
              <select
                className="E-wallet"
                name="Wallet"
                value={paymentInfo.userBank}
                onChange={handleInputChange("userBank")}
                style={{ width: "100%", margin: "10px 0" }}
              >
                <option value="momo">MoMo</option>
                <option value="vnpay">VNPay</option>
                <option value="techcombank">Techcombank</option>
              </select>
              <div className="inputSdt">
                <input
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
                />
              </div>
            </div>
          )}

          <div className="Button-area-pay">
            <div className="button1">
              <ButtonComponent onClick={handleClickBack}>
                Quay lại
              </ButtonComponent>
            </div>
            <div className="button2">
              <ButtonComponent className="customBtn2" onClick={handleClickPay}>
                Thanh toán
              </ButtonComponent>
            </div>
          </div>
        </div>

        <div className="final-order">
          {resolvedOrderItems.length > 0 ? (
            resolvedOrderItems.map((product, index) => (
              <ProductInforCustom
                key={index}
                image={product.img}
                name={product.name}
                price={
                  (
                    product.price * (1 - product.discountPercent / 100) || 0
                  ).toLocaleString() + " VND"
                }
                quantity={product.quantity}
              />
            ))
          ) : (
            <p>Không có sản phẩm nào trong đơn hàng</p>
          )}
          <div className="footerAreaPayment">
            <div className="tamtinh" style={{ marginBottom: "10px" }}>
              <label style={{ paddingLeft: "10px" }}>Tạm tính:</label>
              <p className="tamtinh2">
                {lastOrder.totalItemPrice?.toLocaleString() || 0} VND
              </p>
            </div>
            <div className="tamtinhVanChuyen">
              <label style={{ paddingLeft: "10px" }}>Phí vận chuyển:</label>
              <p className="tamtinhVanChuyen2">
                {lastOrder.shippingPrice?.toLocaleString() || 0} VND
              </p>
            </div>
            {coinsApplied > 0 && (
              <div
                className="coins-discount"
                style={{ marginBottom: "10px", color: "#28a745" }}
              >
                <label style={{ paddingLeft: "10px" }}>Giảm giá từ xu:</label>
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  -{coinsApplied.toLocaleString()} VND
                </p>
              </div>
            )}
            <div
              className="total-payment"
              style={{
                borderTop: "1px solid #ddd",
                paddingTop: "10px",
                fontWeight: "bold",
              }}
            >
              <label style={{ paddingLeft: "10px" }}>Tổng:</label>
              <span className="finalPrice">
                {finalTotalPrice.toLocaleString()} VND
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
