import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import ProductInforCustom from "../../../components/ProductInfor/ProductInforCustom";
import { useSelector, useDispatch } from "react-redux";
import * as PaymentService from "../../../api/services/PaymentService";
import * as UserService from "../../../api/services/UserService";
import * as OrderService from "../../../api/services/OrderService";
import * as VoucherService from "../../../api/services/VoucherService";
import * as RankService from "../../../api/services/RankService";
import { createPayment } from "../../../redux/slides/paymentSlide";
import { updateUserCoins } from "../../../redux/slides/userSlide";
import axios from "axios";
import { getDetailsOrder } from "../../../api/services/OrderService";
import {
  clearSelectedProductDetails,
  updateOrder,
} from "../../../redux/slides/orderSlide";
import { toast } from "react-toastify";
import { Ticket, X, Tag } from "lucide-react";
import VoucherModal from "../../../components/VoucherComponents/VoucherModal";
import ConfirmPaymentModal from "../../../components/ConfirmPaymentModal/ConfirmPaymentModal";

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
  console.log("🎖️ Rank Discount:", {
    rankDiscount: lastOrder.rankDiscount,
    rankDiscountPercent: lastOrder.rankDiscountPercent,
  });

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

  // Voucher states
  const [voucherCode, setVoucherCode] = useState("");
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // Rank state - lấy từ API như Header
  const [userRankInfo, setUserRankInfo] = useState(null);

  // Confirm payment modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // DEBUG: Log state changes
  useEffect(() => {
    console.log("=== MODAL STATE CHANGED ===");
    console.log("showConfirmModal:", showConfirmModal);
  }, [showConfirmModal]);

  const access_token = localStorage.getItem("access_token");

  // Tính toán tổng tiền ban đầu
  const originalTotalPrice =
    (lastOrder.totalItemPrice || 0) + (lastOrder.shippingPrice || 0);

  // Lấy rank discount từ order
  // Nếu order chưa có rankDiscount (order cũ), tính từ userRankInfo API
  let rankDiscount = 0;
  let rankDiscountPercent = 0;

  // Ưu tiên 1: Lấy từ order nếu có (và không phải 0)
  if (
    lastOrder.rankDiscount != null &&
    lastOrder.rankDiscountPercent != null &&
    !isNaN(lastOrder.rankDiscount) &&
    !isNaN(lastOrder.rankDiscountPercent)
  ) {
    rankDiscount = Number(lastOrder.rankDiscount);
    rankDiscountPercent = Number(lastOrder.rankDiscountPercent);
    console.log(
      `🎖️ Sử dụng rank discount từ order: ${rankDiscountPercent}% = ${rankDiscount}đ`
    );
  }
  // Ưu tiên 2: Tính từ userRankInfo API nếu order không có
  else if (userRankInfo?.currentRank && lastOrder.totalItemPrice) {
    rankDiscountPercent = userRankInfo.currentRank.discountPercent || 0;
    rankDiscount = (lastOrder.totalItemPrice * rankDiscountPercent) / 100;
    console.log(
      `🎖️ Tính rank discount từ API: ${rankDiscountPercent}% = ${rankDiscount}đ`
    );
  }
  // Ưu tiên 3: Lấy từ user Redux nếu có currentRank
  else if (user?.currentRank && lastOrder.totalItemPrice) {
    // Nếu currentRank là object đã populate
    if (
      typeof user.currentRank === "object" &&
      user.currentRank.discountPercent != null
    ) {
      rankDiscountPercent = user.currentRank.discountPercent || 0;
      rankDiscount = (lastOrder.totalItemPrice * rankDiscountPercent) / 100;
      console.log(
        `🎖️ Tính rank discount từ Redux user: ${rankDiscountPercent}% = ${rankDiscount}đ`
      );
    }
  }

  console.log("🎖️ PaymentPage - User from Redux:", {
    userId: user?.id,
    currentRank: user?.currentRank,
    totalSpending: user?.totalSpending,
    fullUser: user,
  });

  console.log("💰 Payment Page - Price Calculation:", {
    originalTotalPrice,
    rankDiscount,
    rankDiscountPercent,
    voucherDiscount,
    coinsApplied,
    userRank: user?.currentRank,
    lastOrderData: {
      totalItemPrice: lastOrder.totalItemPrice,
      shippingPrice: lastOrder.shippingPrice,
      rankDiscount: lastOrder.rankDiscount,
      rankDiscountPercent: lastOrder.rankDiscountPercent,
    },
  });

  useEffect(() => {
    setFinalTotalPrice(
      originalTotalPrice - rankDiscount - coinsApplied - voucherDiscount
    );
  }, [originalTotalPrice, rankDiscount, coinsApplied, voucherDiscount]);

  // Lấy thông tin rank của user khi component mount
  useEffect(() => {
    const fetchUserRank = async () => {
      if (user?.id && access_token) {
        try {
          const response = await RankService.getUserRank(user.id, access_token);
          console.log("🎖️ Fetched rank from API:", response);
          console.log("🎖️ Response data structure:", {
            status: response?.status,
            hasData: !!response?.data,
            currentRank: response?.data?.currentRank,
            discountPercent: response?.data?.currentRank?.discountPercent,
            totalSpending: response?.data?.totalSpending,
          });
          if (response?.status === "OK" && response?.data) {
            setUserRankInfo(response.data);
          }
        } catch (error) {
          console.error("❌ Error fetching user rank:", error);
        }
      }
    };

    fetchUserRank();
  }, [user?.id, access_token]);

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

  // === VOUCHER FUNCTIONS ===
  // Áp dụng voucher từ mã code
  const handleApplyVoucherCode = async () => {
    if (!voucherCode.trim()) return;

    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await VoucherService.validateVoucherCode(
        voucherCode,
        accessToken
      );

      if (response.status === "OK") {
        const voucher = response.data.voucher;
        if (selectedVouchers.some((v) => v._id === voucher._id)) {
          toast.warning("Voucher này đã được chọn!");
          return;
        }

        setSelectedVouchers([...selectedVouchers, voucher]);
        setVoucherCode("");
        toast.success("Áp dụng voucher thành công!");
      } else {
        toast.error(response.message || "Mã voucher không hợp lệ!");
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi áp dụng voucher!");
    }
  };

  // Tính tổng giảm giá từ voucher
  const calculateVoucherDiscount = useCallback(
    (vouchers) => {
      let discount = 0;
      const totalItemPrice = lastOrder.totalItemPrice || 0;
      const shippingPrice = lastOrder.shippingPrice || 0;

      console.log("Calculating voucher discount:", {
        vouchers,
        totalItemPrice,
        shippingPrice,
      });

      vouchers.forEach((voucher) => {
        if (voucher.voucherType === "PERCENTAGE") {
          const percentDiscount =
            (totalItemPrice * voucher.discountValue) / 100;
          const maxDiscount = voucher.maxDiscountAmount || Infinity;
          const finalDiscount = Math.min(percentDiscount, maxDiscount);
          console.log("PERCENTAGE voucher:", {
            code: voucher.voucherCode,
            discountValue: voucher.discountValue,
            percentDiscount,
            maxDiscount,
            finalDiscount,
          });
          discount += finalDiscount;
        } else if (voucher.voucherType === "FIXED_AMOUNT") {
          console.log("FIXED_AMOUNT voucher:", {
            code: voucher.voucherCode,
            discountValue: voucher.discountValue,
          });
          discount += voucher.discountValue;
        } else if (voucher.voucherType === "FREE_SHIPPING") {
          console.log("FREE_SHIPPING voucher:", {
            code: voucher.voucherCode,
            shippingPrice,
          });
          discount += shippingPrice;
        }
      });

      console.log("Total voucher discount:", discount);
      setVoucherDiscount(discount);
    },
    [lastOrder.totalItemPrice, lastOrder.shippingPrice]
  );

  // Xóa voucher
  const handleRemoveVoucher = (voucherId) => {
    const updated = selectedVouchers.filter((v) => v._id !== voucherId);
    setSelectedVouchers(updated);
  };

  // Update discount when vouchers change
  useEffect(() => {
    calculateVoucherDiscount(selectedVouchers);
  }, [selectedVouchers, calculateVoucherDiscount]);

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
    console.log("=== handleClickPay CALLED ===");
    console.log("lastOrder.orderId:", lastOrder?.orderId);
    console.log("paymentType:", paymentType);

    if (!lastOrder?.orderId) {
      alert("Không tìm thấy đơn hàng. Vui lòng quay lại và thử lại.");
      return;
    }

    // Validation cho payment type QR
    if (paymentType === "qr") {
      if (!paymentInfo.userBank) {
        alert("Vui lòng chọn loại ví thanh toán!");
        return;
      }
      if (!paymentInfo.userBankNumber) {
        alert("Vui lòng nhập số điện thoại hoặc số tài khoản!");
        return;
      }
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

    // Hiển thị modal xác nhận
    console.log("=== ABOUT TO SHOW MODAL ===");
    console.log("showConfirmModal before setState:", showConfirmModal);
    setShowConfirmModal(true);
    console.log("setShowConfirmModal(true) CALLED");
  };

  const handleConfirmPayment = async () => {
    setIsConfirming(true);

    try {
      // Bước 1: Xác nhận thanh toán và cập nhật voucher vào backend
      if (selectedVouchers.length > 0) {
        const voucherData = {
          selectedVouchers: selectedVouchers.map((v) => ({
            _id: v._id,
            voucherCode: v.voucherCode,
            voucherName: v.voucherName,
            voucherType: v.voucherType,
            discountAmount: calculateVoucherDiscountForVoucher(v),
          })),
          voucherDiscount,
          finalTotalPrice,
        };

        await OrderService.confirmPaymentWithVoucher(
          lastOrder.orderId,
          voucherData,
          access_token
        );

        console.log("Voucher confirmed and applied to order");
      }

      // Bước 2: Tiến hành thanh toán
      await proceedWithPayment();
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert(error.message || "Có lỗi xảy ra khi xác nhận thanh toán");
      setIsConfirming(false);
      setShowConfirmModal(false);
    }
  };

  const calculateVoucherDiscountForVoucher = (voucher) => {
    const totalItemPrice = lastOrder.totalItemPrice || 0;
    const shippingPrice = lastOrder.shippingPrice || 0;

    if (voucher.voucherType === "PERCENTAGE") {
      let discount = (totalItemPrice * voucher.discountValue) / 100;
      if (voucher.maxDiscountAmount) {
        discount = Math.min(discount, voucher.maxDiscountAmount);
      }
      return discount;
    } else if (voucher.voucherType === "FIXED_AMOUNT") {
      return voucher.discountValue;
    } else if (voucher.voucherType === "FREE_SHIPPING") {
      return shippingPrice;
    }
    return 0;
  };

  const proceedWithPayment = async () => {
    const paymentData = {
      paymentCode: `PAY-${Date.now()}`,
      userBank: paymentInfo.userBank,
      userBankNumber: paymentInfo.userBankNumber,
      paymentMethod: paymentType,
      orderId: lastOrder.orderId,
      totalPrice: finalTotalPrice,
    };

    if (paymentType === "paypal") {
      const response = await PaymentService.createPayment(paymentData);
      console.log("PayPal response:", response);

      if (response?.status === "OK") {
        dispatch(clearSelectedProductDetails());
        setIsConfirming(false);
        setShowConfirmModal(false);
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(response.message || "Thanh toán PayPal thất bại");
      }
    } else if (paymentType === "qr") {
      const response = await PaymentService.createQrPayment(paymentData);
      console.log("QR response:", response);

      if (response?.status === "OK") {
        dispatch(clearSelectedProductDetails());
        setIsConfirming(false);
        setShowConfirmModal(false);
        navigate("/banking-info", {
          state: {
            qrCodeUrl: response.data.qrCodeUrl,
            paymentCode: response.data.paymentCode,
            expiresAt: response.data.expiresAt,
            adminBankInfo: response.data.adminBankInfo,
            coinsApplied: coinsApplied,
            voucherDiscount: voucherDiscount,
            rankDiscount: rankDiscount,
            rankDiscountPercent: rankDiscountPercent,
            finalTotalPrice: finalTotalPrice,
            originalTotalPrice: originalTotalPrice,
            selectedVouchers: selectedVouchers,
          },
        });
      } else {
        throw new Error(response.message || "Tạo QR thất bại");
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
                      <div>
                        Số xu đã áp dụng: {coinsApplied.toLocaleString()} xu
                      </div>
                      <div>
                        Số xu muốn thêm: {coinsToUse.toLocaleString()} xu
                      </div>
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

          {/* Phần Voucher */}
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
                  placeholder="Nhập mã voucher..."
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleApplyVoucherCode()
                  }
                  style={{
                    width: "100%",
                    paddingLeft: "40px",
                    paddingRight: "12px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    border: "2px solid rgba(177, 227, 33, 0.3)",
                    borderRadius: "24px",
                    fontSize: "16px",
                    background: "rgba(177, 227, 33, 0.05)",
                  }}
                />
              </div>
              <button
                onClick={handleApplyVoucherCode}
                style={{
                  background: "#b1e321",
                  color: "#3a060e",
                  fontWeight: "600",
                  padding: "10px 24px",
                  borderRadius: "24px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Áp dụng
              </button>
              <button
                onClick={() => setIsVoucherModalOpen(true)}
                style={{
                  background: "#3a060e",
                  color: "white",
                  fontWeight: "600",
                  padding: "10px 24px",
                  borderRadius: "24px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Ticket className="w-5 h-5" />
                Chọn voucher
              </button>
            </div>

            {/* Selected Vouchers */}
            {selectedVouchers.length > 0 && (
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#666",
                    marginBottom: "10px",
                  }}
                >
                  Đã chọn {selectedVouchers.length} voucher:
                </p>
                {selectedVouchers.map((voucher) => (
                  <div
                    key={voucher._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "rgba(177, 227, 33, 0.1)",
                      border: "2px solid rgba(177, 227, 33, 0.3)",
                      borderRadius: "24px",
                      padding: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          background: "#b1e321",
                          padding: "8px",
                          borderRadius: "16px",
                        }}
                      >
                        <Ticket
                          className="w-5 h-5"
                          style={{ color: "white" }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            fontWeight: "600",
                            color: "#3a060e",
                            margin: 0,
                          }}
                        >
                          {voucher.voucherName}
                        </p>
                        <p
                          style={{ fontSize: "14px", color: "#666", margin: 0 }}
                        >
                          Mã:{" "}
                          <span
                            style={{
                              fontFamily: "monospace",
                              fontWeight: "bold",
                            }}
                          >
                            {voucher.voucherCode}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveVoucher(voucher._id)}
                      style={{
                        padding: "8px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "16px",
                      }}
                    >
                      <X className="w-5 h-5" style={{ color: "#dc3545" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {voucherDiscount > 0 && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "10px",
                  background: "#d4edda",
                  borderRadius: "16px",
                }}
              >
                <span style={{ color: "#155724", fontWeight: "bold" }}>
                  ✓ Tiết kiệm {voucherDiscount.toLocaleString()} VND từ voucher
                </span>
              </div>
            )}
          </div>

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
            <div className="tamtinhVanChuyen" style={{ marginBottom: "10px" }}>
              <label style={{ paddingLeft: "10px" }}>Phí vận chuyển:</label>
              <p className="tamtinhVanChuyen2">
                {lastOrder.shippingPrice?.toLocaleString() || 0} VND
              </p>
            </div>
            <div
              className="voucher-discount"
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: voucherDiscount > 0 ? "#3a060e" : "inherit",
              }}
            >
              <label style={{ paddingLeft: "10px" }}>Giảm giá voucher:</label>
              <p
                style={{
                  margin: 0,
                  fontWeight: voucherDiscount > 0 ? "bold" : "normal",
                }}
              >
                {voucherDiscount > 0 ? "-" : ""}
                {voucherDiscount.toLocaleString()} VND
              </p>
            </div>
            <div
              className="rank-discount"
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: rankDiscount > 0 ? "#d4af37" : "inherit",
              }}
            >
              <label
                style={{
                  paddingLeft: "10px",
                  fontWeight: rankDiscount > 0 ? "bold" : "normal",
                }}
              >
                Giảm giá hạng
                {rankDiscountPercent > 0 ? ` (-${rankDiscountPercent}%)` : ""}:
              </label>
              <p
                style={{
                  margin: 0,
                  fontWeight: rankDiscount > 0 ? "bold" : "normal",
                  paddingRight: "10px",
                }}
              >
                {rankDiscount > 0 ? "-" : ""}
                {rankDiscount.toLocaleString()} VND
              </p>
            </div>
            {coinsApplied > 0 && (
              <div
                className="coins-discount"
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label
                  style={{
                    paddingLeft: "10px",
                    color: "#3a060e",
                    fontWeight: "bold",
                  }}
                >
                  Giảm giá từ xu:
                </label>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    color: "#3a060e",
                    paddingRight: "10px",
                  }}
                >
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

      {/* Voucher Modal */}
      <VoucherModal
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onSelectVoucher={setSelectedVouchers}
        selectedVouchers={selectedVouchers}
      />

      {/* Confirm Payment Modal */}
      {console.log("=== RENDERING MODAL ===", {
        show: showConfirmModal,
        isConfirming,
        originalTotalPrice,
        voucherDiscount,
        coinsApplied,
        finalTotalPrice,
      })}
      <ConfirmPaymentModal
        show={showConfirmModal}
        onHide={() => !isConfirming && setShowConfirmModal(false)}
        onConfirm={handleConfirmPayment}
        isLoading={isConfirming}
        orderData={{
          originalTotalPrice,
          rankDiscount,
          rankDiscountPercent,
          voucherDiscount,
          coinsApplied,
          finalTotalPrice,
          selectedVouchers,
          paymentType,
        }}
      />
    </div>
  );
};

export default PaymentPage;
