import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentResultPage.css"; // Tạo file CSS nếu cần
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resultMessage, setResultMessage] = useState(
    "Đang kiểm tra trạng thái thanh toán..."
  );
  const paymentCode = searchParams.get("orderId"); // MoMo gửi paymentCode qua query param

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/payment/get-detail-payment/${paymentCode}`
        );
        if (response.data.status === "OK") {
          const payment = response.data.data;
          if (payment.status === "SUCCESS") {
            setResultMessage(
              "Thanh toán thành công! Đơn hàng của bạn đã được xử lý."
            );
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
        setResultMessage("Có lỗi xảy ra khi kiểm tra trạng thái thanh toán.");
      }
    };

    if (paymentCode) {
      checkPaymentStatus();
    } else {
      setResultMessage("Không tìm thấy mã thanh toán.");
    }
  }, [paymentCode]);

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
