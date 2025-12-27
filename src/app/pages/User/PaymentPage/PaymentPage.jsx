import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import ProductInforCustom from "../../../components/ProductInfor/ProductInforCustom";
import { useSelector, useDispatch } from "react-redux";
import * as PaymentService from "../../../api/services/PaymentService";
import * as UserService from "../../../api/services/UserService";
import * as OrderService from "../../../api/services/OrderService";
import * as VoucherService from "../../../api/services/VoucherService";
import * as RankService from "../../../api/services/RankService";
import { updateUserCoins } from "../../../redux/slides/userSlide";
import { getDetailsOrder } from "../../../api/services/OrderService";
import {
  clearSelectedProductDetails,
  updateOrder,
} from "../../../redux/slides/orderSlide";
import { toast } from "react-toastify";
import VoucherModal from "../../../components/VoucherComponents/VoucherModal";
import ConfirmPaymentModal from "../../../components/ConfirmPaymentModal/ConfirmPaymentModal";

// Import các component đã tách
import CoinsSection from "./components/CoinsSection";
import VoucherSection from "./components/VoucherSection";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import PaymentSummary from "./components/PaymentSummary";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.order);
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  const lastOrder = orderDetails.orders?.[orderDetails.orders.length - 1] || {};
  const { orderItems = [] } = lastOrder;

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

  // Sepay payment method state
  const [sepayPaymentMethod, setSepayPaymentMethod] = useState("BANK_TRANSFER"); // 'BANK_TRANSFER', 'CARD', 'NAPAS_BANK_TRANSFER'

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

  const fetchUserCoins = useCallback(async () => {
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
  }, [access_token, dispatch]);

  const syncOrderWithBackend = useCallback(async () => {
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
  }, [lastOrder.orderId, dispatch]);

  // Lấy thông tin xu của user khi component mount
  useEffect(() => {
    if (user?.id && access_token) {
      fetchUserCoins();
    }
  }, [user?.id, access_token, fetchUserCoins]);

  // Đồng bộ trạng thái đơn hàng với backend khi component mount
  useEffect(() => {
    if (lastOrder?.orderId && access_token) {
      syncOrderWithBackend();
    }
  }, [lastOrder?.orderId, access_token, syncOrderWithBackend]);

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

        // Kiểm tra giá trị đơn hàng tối thiểu
        const currentOrderValue = lastOrder.totalItemPrice || 0;
        const minOrderValue = voucher.minOrderValue || 0;

        if (currentOrderValue < minOrderValue) {
          toast.error(
            `Giá trị đơn hàng tối thiểu để sử dụng voucher này là ${minOrderValue.toLocaleString()}đ. Đơn hàng hiện tại: ${currentOrderValue.toLocaleString()}đ`
          );
          return;
        }

        setSelectedVouchers([...selectedVouchers, voucher]);
        setVoucherCode("");

        // Hiển thị thông báo chi tiết về giá giảm
        if (voucher.voucherType === "PERCENTAGE") {
          const percentDiscount =
            (currentOrderValue * voucher.discountValue) / 100;
          const maxDiscount = voucher.maxDiscountAmount || Infinity;
          const actualDiscount = Math.min(percentDiscount, maxDiscount);

          if (percentDiscount > maxDiscount) {
            toast.success(
              `Áp dụng voucher thành công! Giảm ${actualDiscount.toLocaleString()}đ (giảm tối đa ${
                voucher.discountValue
              }% nhưng không vượt quá ${maxDiscount.toLocaleString()}đ)`
            );
          } else {
            toast.success(
              `Áp dụng voucher thành công! Giảm ${actualDiscount.toLocaleString()}đ (${
                voucher.discountValue
              }%)`
            );
          }
        } else if (voucher.voucherType === "FIXED_AMOUNT") {
          toast.success(
            `Áp dụng voucher thành công! Giảm ${voucher.discountValue.toLocaleString()}đ`
          );
        } else if (voucher.voucherType === "FREE_SHIPPING") {
          const shippingPrice = lastOrder.shippingPrice || 0;
          toast.success(
            `Áp dụng voucher thành công! Miễn phí ship ${shippingPrice.toLocaleString()}đ`
          );
        } else {
          toast.success("Áp dụng voucher thành công!");
        }
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

    // Validation cho Sepay - không cần input thêm, chỉ cần chọn phương thức

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
    } else if (paymentType === "sepay") {
      // Xử lý thanh toán Sepay
      const sepayData = {
        paymentCode: `SEPAY-${Date.now()}`,
        orderId: lastOrder.orderId,
        totalPrice: finalTotalPrice,
        sepayPaymentMethod: sepayPaymentMethod, // 'BANK_TRANSFER', 'CARD', 'NAPAS_BANK_TRANSFER'
        customerInfo: {
          userId: user?.id,
        },
      };

      const response = await PaymentService.createSepayPayment(sepayData);
      console.log("Sepay response:", response);

      if (response?.status === "OK") {
        dispatch(clearSelectedProductDetails());
        setIsConfirming(false);
        setShowConfirmModal(false);

        // Tạo form để submit đến Sepay
        const form = document.createElement("form");
        form.method = "POST";
        form.action = response.data.checkoutURL;

        // Thêm các hidden input từ checkoutFormFields
        Object.keys(response.data.checkoutFormFields).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = response.data.checkoutFormFields[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error(response.message || "Thanh toán Sepay thất bại");
      }
    }
  };

  return (
    <div className="container-xl">
      <div className="container-xl-pay">
        <div className="PaymentInfor">
          <p className="pThongtin">Thông tin thanh toán</p>

          {/* Coins Section Component */}
          <CoinsSection
            user={user}
            showCoinsSection={showCoinsSection}
            setShowCoinsSection={setShowCoinsSection}
            isLoadingCoins={isLoadingCoins}
            coinsToUse={coinsToUse}
            handleCoinsChange={handleCoinsChange}
            coinsApplied={coinsApplied}
            originalTotalPrice={originalTotalPrice}
            handleApplyCoins={handleApplyCoins}
            handleCancelCoins={handleCancelCoins}
          />

          {/* Voucher Section Component */}
          <VoucherSection
            voucherCode={voucherCode}
            setVoucherCode={setVoucherCode}
            handleApplyVoucherCode={handleApplyVoucherCode}
            selectedVouchers={selectedVouchers}
            handleRemoveVoucher={handleRemoveVoucher}
            setIsVoucherModalOpen={setIsVoucherModalOpen}
            voucherDiscount={voucherDiscount}
          />

          {/* Payment Method Selector Component */}
          <PaymentMethodSelector
            paymentType={paymentType}
            handlePaymentTypeChange={handlePaymentTypeChange}
            sepayPaymentMethod={sepayPaymentMethod}
            setSepayPaymentMethod={setSepayPaymentMethod}
            paymentInfo={paymentInfo}
            handleInputChange={handleInputChange}
          />

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

          {/* Payment Summary Component */}
          <PaymentSummary
            originalTotalPrice={originalTotalPrice}
            rankDiscount={rankDiscount}
            rankDiscountPercent={rankDiscountPercent}
            coinsApplied={coinsApplied}
            voucherDiscount={voucherDiscount}
            finalTotalPrice={finalTotalPrice}
          />
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
