import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { clearCart } from "../../redux/slides/cartSlide";
import PaymentStatusCard from "./partials/PaymentStatusCard";
import PaymentHeader from "./partials/PaymentHeader";
import PaymentInfo from "./partials/PaymentInfo";
import PaymentActions from "./partials/PaymentActions";
import {
  SuccessIcon,
  FailedIcon,
  PendingIcon,
  ErrorIcon,
  LoadingIcon,
} from "./partials/StatusIcons";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentStatus, setPaymentStatus] = useState("loading");
  const [paymentData, setPaymentData] = useState(null);

  const paymentCode =
    searchParams.get("paymentCode") || searchParams.get("orderId");

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const apiUrl =
          process.env.REACT_APP_API_URL_BACKEND || "http://localhost:3001/api";

        console.log("Checking payment with code:", paymentCode);

        const response = await axios.get(
          `${apiUrl}/payment/get-detail-payment/${paymentCode}`
        );

        console.log("✅ Payment API response:", response.data);

        if (response.data.status === "OK") {
          const payment = response.data.data;
          setPaymentData(payment);

          if (payment.status === "SUCCESS") {
            setPaymentStatus("success");
            dispatch(clearCart());
            console.log("✅ Cart cleared after successful payment");
          } else if (payment.status === "FAILED") {
            setPaymentStatus("failed");
          } else {
            setPaymentStatus("pending");
          }
        } else {
          setPaymentStatus("error");
        }
      } catch (e) {
        console.error("Error checking payment status:", e);
        setPaymentStatus("error");
      }
    };

    if (paymentCode) {
      checkPaymentStatus();
    } else {
      console.log("⚠️ No paymentCode found in URL");
      setPaymentStatus("error");
    }
  }, [paymentCode, searchParams, dispatch]);

  // Loading state
  if (paymentStatus === "loading") {
    return (
      <PaymentStatusCard>
        <div className="p-16 text-center">
          <LoadingIcon />
          <p className="text-lg font-medium text-avocado-brown-100 mt-8">
            Đang kiểm tra trạng thái thanh toán...
          </p>
        </div>
      </PaymentStatusCard>
    );
  }

  // Success state
  if (paymentStatus === "success") {
    return (
      <PaymentStatusCard>
        <PaymentHeader
          status="success"
          icon={<SuccessIcon />}
          title="Thanh toán thành công!"
          subtitle="Cảm ơn bạn đã mua hàng tại Avocado Cake"
        />
        <div className="p-8 space-y-6">
          <PaymentInfo
            paymentData={paymentData}
            paymentCode={paymentCode}
            status="success"
          />
          <div className="text-center py-6">
            <p className="text-avocado-brown-100 text-lg leading-relaxed">
              Đơn hàng của bạn đã được xác nhận và đang được xử lý.
              <br />
              Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao.
            </p>
          </div>
          <PaymentActions
            primaryAction={{
              text: "Xem đơn hàng của tôi",
              onClick: () => navigate("/my-orders"),
            }}
            secondaryActions={[
              {
                text: "Mua thêm",
                onClick: () => navigate("/products"),
                variant: "primary",
              },
              {
                text: "Về trang chủ",
                onClick: () => navigate("/"),
              },
            ]}
          />
        </div>
      </PaymentStatusCard>
    );
  }

  // Failed state
  if (paymentStatus === "failed") {
    return (
      <PaymentStatusCard>
        <PaymentHeader
          status="failed"
          icon={<FailedIcon />}
          title="Thanh toán thất bại"
          subtitle="Đã có lỗi xảy ra trong quá trình thanh toán"
        />
        <div className="p-8 space-y-6">
          <PaymentInfo
            paymentData={paymentData}
            paymentCode={paymentCode}
            status="failed"
          />
          <div className="text-center py-6">
            <p className="text-avocado-brown-100 text-lg leading-relaxed">
              Giao dịch của bạn không thành công.
              <br />
              Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
            </p>
          </div>
          <PaymentActions
            primaryAction={{
              text: "Thử lại thanh toán",
              onClick: () => navigate("/cart"),
            }}
            secondaryActions={[
              {
                text: "Mua thêm",
                onClick: () => navigate("/products"),
                variant: "primary",
              },
              {
                text: "Về trang chủ",
                onClick: () => navigate("/"),
              },
            ]}
          />
        </div>
      </PaymentStatusCard>
    );
  }

  // Pending state
  if (paymentStatus === "pending") {
    return (
      <PaymentStatusCard>
        <PaymentHeader
          status="pending"
          icon={<PendingIcon />}
          title="Đang xử lý thanh toán"
          subtitle="Giao dịch của bạn đang được xử lý"
        />
        <div className="p-8 space-y-6">
          <PaymentInfo
            paymentData={paymentData}
            paymentCode={paymentCode}
            status="pending"
          />
          <div className="text-center py-6">
            <p className="text-avocado-brown-100 text-lg leading-relaxed">
              Thanh toán của bạn đang được xử lý.
              <br />
              Vui lòng chờ trong giây lát hoặc kiểm tra lại sau.
            </p>
          </div>
          <PaymentActions
            primaryAction={{
              text: "Kiểm tra lại",
              onClick: () => window.location.reload(),
            }}
            secondaryActions={[
              {
                text: "Mua thêm",
                onClick: () => navigate("/products"),
                variant: "primary",
              },
              {
                text: "Về trang chủ",
                onClick: () => navigate("/"),
              },
            ]}
          />
        </div>
      </PaymentStatusCard>
    );
  }

  // Error state
  return (
    <PaymentStatusCard>
      <PaymentHeader
        status="error"
        icon={<ErrorIcon />}
        title="Không tìm thấy thông tin"
        subtitle="Không thể tìm thấy thông tin thanh toán"
      />
      <div className="p-8 space-y-6">
        <div className="text-center py-6">
          <p className="text-avocado-brown-100 text-lg leading-relaxed">
            Không tìm thấy mã thanh toán hoặc có lỗi xảy ra.
            <br />
            Vui lòng liên hệ với chúng tôi nếu bạn cần hỗ trợ.
          </p>
        </div>
        <PaymentActions
          secondaryActions={[
            {
              text: "Mua thêm",
              onClick: () => navigate("/products"),
              variant: "primary",
            },
            {
              text: "Về trang chủ",
              onClick: () => navigate("/"),
            },
          ]}
        />
      </div>
    </PaymentStatusCard>
  );
};

export default PaymentResultPage;
