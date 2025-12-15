import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import "./PaymentResultPage.css"; // Tạo file CSS nếu cần
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { clearCart } from "../../redux/slides/cartSlide";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resultMessage, setResultMessage] = useState(
    "Đang kiểm tra trạng thái thanh toán..."
  );

  // Lấy paymentCode từ URL query params
  // Sepay gửi: ?status=success&paymentCode=SEPAY-xxx&orderId=xxx
  // MoMo/PayPal gửi: ?orderId=xxx
  const paymentCode =
    searchParams.get("paymentCode") || searchParams.get("orderId");

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const apiUrl =
          process.env.REACT_APP_API_URL_BACKEND || "http://localhost:3001/api";

        // Debug: Log paymentCode để kiểm tra
        console.log("Checking payment with code:", paymentCode);
        console.log("Full URL query params:", {
          paymentCode: searchParams.get("paymentCode"),
          orderId: searchParams.get("orderId"),
          status: searchParams.get("status"),
        });

        const response = await axios.get(
          `${apiUrl}/payment/get-detail-payment/${paymentCode}`
        );

        console.log("✅ Payment API response:", response.data);

        if (response.data.status === "OK") {
          const payment = response.data.data;
          if (payment.status === "SUCCESS") {
            setResultMessage(
              "Thanh toán thành công! Đơn hàng của bạn đã được xử lý."
            );

            // Xóa cart sau khi thanh toán thành công
            dispatch(clearCart());
            console.log("✅ Cart cleared after successful payment");
          } else if (payment.status === "FAILED") {
            setResultMessage("Thanh toán thất bại. Vui lòng thử lại.");
          } else {
            setResultMessage("Thanh toán đang được xử lý. Vui lòng chờ...");
          }
        } else {
          setResultMessage("Không tìm thấy thông tin thanh toán.");
        }
      } catch (e) {
        console.error("Error checking payment status:", e);
        console.error("Error response:", e.response?.data);
        setResultMessage("Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.");
      }
    };

    if (paymentCode) {
      checkPaymentStatus();
    } else {
      console.log("⚠️ No paymentCode found in URL");
      setResultMessage("Không tìm thấy mã thanh toán.");
    }
  }, [paymentCode, searchParams]);

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="container-xl">
      <h2>Kết quả thanh toán</h2>
      <p>{resultMessage}</p>
      <ButtonComponent
        onClick={handleBackToHome}
        style={{ width: "50%", margin: "30px auto" }}
      >
        Về trang chủ
      </ButtonComponent>
    </div>
  );
};

export default PaymentResultPage;
