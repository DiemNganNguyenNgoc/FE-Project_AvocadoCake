import React, { useEffect, useMemo, useState } from "react";
import ProductInfor from "../../../components/ProductInfor/ProductInfor";
import imageProduct from "../../../assets/img/hero_3.jpg";
import "./OrderInformation.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import FormComponent from "../../../components/FormComponent/FormComponent";
import { useDispatch, useSelector } from "react-redux";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as OrderService from "../../../api/services/OrderService";
import * as UserService from "../../../api/services/UserService";
import { addOrder, setOrderDetails } from "../../../redux/slides/orderSlide";
import * as DiscountService from "../../../api/services/DiscountService";

const OrderInformationPage = () => {
  const location = useLocation();
  const { selectedProductDetails } = useSelector((state) => state.order);
  // const orderData = location.state || {};
  // dispatch(setOrderDetails(orderData));

  // const selectedProducts = location.state?.selectedProductDetails || [];
  // const selectedProducts = Array.isArray(location.state?.selectedProductDetails)
  //   ? location.state.selectedProductDetails
  //   : [];
  // console.log("selectedProducts1", selectedProducts);
  const selectedProducts = useMemo(() => {
    return Array.isArray(selectedProductDetails) &&
      selectedProductDetails.length > 0
      ? selectedProductDetails
      : Array.isArray(location.state?.selectedProductDetails)
      ? location.state.selectedProductDetails
      : [];
  }, [selectedProductDetails, location.state]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mutation = useMutationHook((data) => OrderService.createOrder(data));
  const user = useSelector((state) => state.user); // Lấy thông tin user từ Redux

  const isLoggedIn = !!user?.userEmail;
  const shippingPrice = isLoggedIn ? 0 : 30000;
  const [wards, setWards] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [activeDiscounts, setActiveDiscounts] = useState([]);
  const [loadingWards, setLoadingWards] = useState(false);

  const handleClickBack = () => {
    navigate("/cart");
  };

  useEffect(() => {
    const fetchActiveDiscounts = async () => {
      try {
        const data = await DiscountService.getAllDiscount();
        const now = Date.now();
        const filtered = data.data.filter((discount) => {
          const start = new Date(discount.discountStartDate).getTime();
          const end = new Date(discount.discountEndDate).getTime();
          return start <= now && end >= now;
        });
        setActiveDiscounts(filtered); // ✅ đúng cách
      } catch (err) {
        console.error("Lỗi khi lấy discount:", err);
      }
    };

    fetchActiveDiscounts();
  }, []);

  // Lấy % giảm giá cho một product (đồng bộ)
  const getDiscountValue = (productId) => {
    const matched = activeDiscounts.find((discount) =>
      discount.discountProduct?.some((pro) =>
        typeof pro === "string" ? pro === productId : pro._id === productId
      )
    );
    return matched?.discountValue || 0; // Trả về 0 nếu không có khuyến mãi
  };

  const handleClickNext = async () => {
    if (!checkDeliveryDateTime()) {
      alert("Ngày và giờ giao hàng phải lớn hơn thời điểm hiện tại!");
      return;
    }

    // 1. Tạo orderItems với Promise.all để chờ discount (nếu getDiscountValue async)
    const orderItems = await Promise.all(
      selectedProducts.map(async (product) => {
        const discountPercent = getDiscountValue(product.id); // đã có biến
        // console.log("DISCOUNT VALUE: ", discountPercent);

        const priceNum =
          typeof product.price === "number"
            ? product.price
            : parseFloat(product.price.replace(/[^0-9.-]+/g, ""));

        return {
          product: product.id,
          quantity: product.quantity,
          discountPercent, // lưu %
          total: priceNum * product.quantity * (1 - discountPercent / 100), // tính tiền
        };
      })
    );

    // 2. Tính lại tổng tiền hàng và tổng tiền đơn
    const totalItemPrice = orderItems.reduce(
      (sum, item) => sum + item.total,
      0
    );
    const totalPrice = totalItemPrice + shippingPrice;

    // 3. Ghép dữ liệu cho API
    const orderData = {
      orderItems,
      shippingAddress,
      paymentMethod: "Online Payment",
      userId: user?.id || null,
      deliveryDate,
      deliveryTime,
      orderNote,
      shippingPrice,
      status,
      totalItemPrice,
      totalPrice,
    };

    try {
      const response = await mutation.mutateAsync(orderData);

      if (response?.data?._id) {
        // Merge order data with backend response to include rankDiscount fields
        const fullOrderData = {
          ...orderData,
          orderId: response.data._id,
          rankDiscount: response.data.rankDiscount || 0,
          rankDiscountPercent: response.data.rankDiscountPercent || 0,
          totalItemPrice: response.data.totalItemPrice || totalItemPrice,
          totalPrice: response.data.totalPrice || totalPrice,
        };

        console.log("📦 Created order with rank discount:", {
          orderId: fullOrderData.orderId,
          rankDiscount: fullOrderData.rankDiscount,
          rankDiscountPercent: fullOrderData.rankDiscountPercent,
          totalPrice: fullOrderData.totalPrice,
        });

        dispatch(
          setOrderDetails({
            selectedProductDetails: selectedProducts,
            shippingAddress,
            totalPrice: fullOrderData.totalPrice,
          })
        );
        dispatch(addOrder(fullOrderData));

        navigate("/payment", { state: fullOrderData });
      } else {
        console.error("Failed to create order:", response);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const [shippingAddress, setShippingAddress] = useState({
    familyName: "",
    userName: "",
    userAddress: "",
    userWard: "",
    userDistrict: "",
    userCity: 79,
    userPhone: "",
    userEmail: "",
  });
  // console.log("selectedProducts", selectedProducts);
  // console.log("wards state:", wards);
  console.log("wards state:", wards);
  console.log("districts state:", districts);

  const [orderNote, setOrderNote] = useState(""); // Ghi chú đặt hàng
  const [deliveryDate, setDeliveryDate] = useState(""); // Ngày giao hàng
  const [deliveryTime, setDeliveryTime] = useState(""); // Giờ giao hàng
  const [status, setStatus] = useState("PENDING"); // Trạng thái đơn hàng

  // Tổng tiền hàng
  const toNumber = (price) =>
    typeof price === "number"
      ? price
      : parseFloat(String(price).replace(/[^0-9.-]+/g, ""));

  const totalItemPrice = selectedProducts.reduce((sum, product) => {
    const discount = getDiscountValue(product.id);
    const priceNum = toNumber(product.price);
    return sum + priceNum * product.quantity * (1 - discount / 100);
  }, 0);

  // Tổng tiền đơn = tiền hàng + ship
  const totalPrice = useMemo(
    () => totalItemPrice + shippingPrice,
    [totalItemPrice, shippingPrice]
  );

  useEffect(() => {
    if (isLoggedIn) {
      setShippingAddress((prev) => ({
        ...prev,
        familyName: user.familyName || "",
        userName: user.userName || "",
        userAddress: user.userAddress || "",
        userWard: user.userWard || "",
        userDistrict: user.userDistrict || "",
        userCity: user.userCity || 79,
        userPhone: user.userPhone || "",
        userEmail: user.userEmail || "",
      }));
    }
  }, [isLoggedIn, user]);

  // Tự động load districts khi userCity thay đổi
  useEffect(() => {
    if (cities.length > 0 && shippingAddress.userCity) {
      const selectedCity = cities.find(
        (city) => city.code === shippingAddress.userCity
      );
      if (selectedCity) {
        setDistricts(selectedCity.districts || []);
      }
    }
  }, [cities, shippingAddress.userCity]);

  // helpers.js (hoặc đặt ngay trong component)

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (typeof value === "string" && value.trim().length >= 0) {
      setShippingAddress((prev) => ({ ...prev, [field]: value }));
    }
  };

  useEffect(() => {
    // Load cities
    const fetchCities = async () => {
      const data = await UserService.fetchCities();
      setCities(data);

      // Tự động load districts của TP.HCM (code: 79)
      const hcmCity = data.find((city) => city.code === 79);
      if (hcmCity) {
        setDistricts(hcmCity.districts || []);
      }
    };
    fetchCities();
  }, []);

  const handleCityChange = (e) => {
    const cityCode = Number(e.target.value);
    const selectedCity = cities.find((city) => city.code === cityCode);
    setDistricts(selectedCity?.districts || []);
    setWards([]);
    setShippingAddress((prev) => ({
      ...prev,
      userCity: cityCode,
      userDistrict: "",
      userWard: "",
    }));
  };

  const handleDistrictChange = async (e) => {
    const districtCode = Number(e.target.value);
    const selectedDistrict = districts.find(
      (district) => district.code === districtCode
    );

    // Lấy dữ liệu phường/xã từ API
    try {
      setLoadingWards(true);
      const wardsData = await UserService.fetchWards(districtCode);
      setWards(wardsData);
    } catch (error) {
      console.error("Error fetching wards:", error);
      setWards([]);
    } finally {
      setLoadingWards(false);
    }

    setShippingAddress((prev) => ({
      ...prev,
      userDistrict: districtCode,
      userWard: "",
    }));
  };

  const handleWardChange = (e) => {
    const wardCode = Number(e.target.value);
    setShippingAddress((prev) => ({
      ...prev,
      userWard: wardCode,
    }));
  };

  // Hàm cập nhật ngày và giờ giao hàng
  const handleDeliveryDateChange = (e) => setDeliveryDate(e.target.value);
  const handleDeliveryTimeChange = (e) => setDeliveryTime(e.target.value);

  // Hàm cập nhật ghi chú
  const handleOrderNoteChange = (e) => setOrderNote(e.target.value);

  const checkDeliveryDateTime = () => {
    if (!deliveryDate || !deliveryTime) return false;
    const now = new Date();
    const selected = new Date(`${deliveryDate}T${deliveryTime}`);
    return selected >= now;
  };

  return (
    <div className="container-xl cart-container">
      <div className="titleHolder">
        <div>
          <BackIconComponent className="back_btn" onClick={handleClickBack} />
        </div>
        <div>
          <h1 className="title"> Thông tin đơn hàng</h1>
        </div>
      </div>
      <div className="bg-white border shadow-sm px-5 py-2">
        <div className="mt-10  rounded-3xl  overflow-hidden">
          <table className="min-w-full text-base text-gray-700">
            {/* HEADER */}
            <thead className="bg-gray-50 text-sm uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-4 text-left">Sản phẩm</th>
                <th className="px-6 py-4 text-right hidden md:table-cell">
                  Đơn giá
                </th>
                <th className="px-6 py-4 text-center hidden md:table-cell">
                  Số lượng
                </th>
                <th className="px-6 py-4 text-right hidden md:table-cell">
                  Thành tiền
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y">
              {selectedProducts.map((product) => {
                const discount = getDiscountValue(product.id);
                const priceNum = toNumber(product.price);
                const finalUnit = priceNum * (1 - discount / 100);
                const lineTotal = finalUnit * product.quantity;

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    {/* PRODUCT INFO */}
                    <td className="px-6 py-5 align-top">
                      <ProductInfor
                        size={product.size ? `${product.size} cm` : ""}
                        image={product.img}
                        name={product.title}
                      />

                      {/* MOBILE INFO */}
                      <div className="md:hidden mt-3 space-y-1 text-sm text-gray-500 text-xl">
                        <p>
                          Giá:
                          <span className="ml-1 font-medium text-gray-800">
                            {finalUnit.toLocaleString()} VND
                          </span>
                        </p>
                        <p>Số lượng: {product.quantity}</p>
                        <p className="font-semibold text-gray-800">
                          Thành tiền: {lineTotal.toLocaleString()} VND
                        </p>
                      </div>
                    </td>

                    {/* UNIT PRICE */}
                    <td className="px-6 py-5 align-middle text-right hidden md:table-cell text-xl">
                      {finalUnit.toLocaleString()} VND
                    </td>

                    {/* QUANTITY */}
                    <td className="px-6 py-5 align-middle text-center hidden md:table-cell text-xl">
                      x {product.quantity}
                    </td>

                    {/* LINE TOTAL */}
                    <td className="px-6 py-5 align-middle text-right font-semibold hidden md:table-cell text-xl">
                      {lineTotal.toLocaleString()} VND
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* FOOTER */}
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-4 font-medium text-left">
                  Phí vận chuyển
                </td>
                <td colSpan="3" className="px-6 py-4 text-right font-semibold">
                  {shippingPrice.toLocaleString()} VND
                </td>
              </tr>

              <tr className="text-2xl">
                <td colSpan="3" className="px-6 py-5 text-left font-bold">
                  Tổng thanh toán
                </td>
                <td className="px-6 py-5 text-right font-semibold text-red-600">
                  {totalPrice.toLocaleString()} VND
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="question" style={{ margin: "10px 50px" }}>
          <p className="login-question">
            {shippingPrice === 30000 && (
              <span>
                Bạn đã có tài khoản?{" "}
                <Link to="/login" className="login-link" target="blank">
                  Đăng nhập
                </Link>
                <span>
                  {" "}
                  để&nbsp;<strong>miễn phí vận chuyển</strong>
                </span>
              </span>
            )}
          </p>
        </div>

        <div>
          {/* =====Dia chi giao hang===== */}
          {/* ================= SHIPPING INFO ================= */}
          <div className=" rounded-3xl  p-8 mt-10 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Địa chỉ giao hàng
            </h2>

            {/* HỌ & TÊN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Họ</label>
                <input
                  type="text"
                  placeholder="Nguyễn"
                  value={shippingAddress.familyName}
                  onChange={handleInputChange("familyName")}
                  className="w-full rounded-full border border-gray-300 px-5 py-3
                   focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  placeholder="Văn A"
                  value={shippingAddress.userName}
                  onChange={handleInputChange("userName")}
                  className="w-full rounded-full border border-gray-300 px-5 py-3
                   focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>

            {/* PHONE & EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="0123 456 789"
                  value={shippingAddress.userPhone}
                  onChange={handleInputChange("userPhone")}
                  className="w-full rounded-full border border-gray-300 px-5 py-3
                   focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={shippingAddress.userEmail}
                  onChange={handleInputChange("userEmail")}
                  className="w-full rounded-full border border-gray-300 px-5 py-3
                   focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
            </div>

            {/* ĐỊA CHỈ */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Địa chỉ cụ thể
              </label>
              <input
                type="text"
                placeholder="Số nhà, tên đường, hẻm..."
                value={shippingAddress.userAddress}
                onChange={handleInputChange("userAddress")}
                className="w-full rounded-full border border-gray-300 px-5 py-3
                 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
            </div>

            {/* CITY / DISTRICT / WARD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* CITY – ONLY HCM */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Tỉnh / Thành phố
                </label>
                <select
                  value={79}
                  disabled
                  className="w-full rounded-full  -gray-300 px-5 py-3 bg-gray-100
                   cursor-not-allowed"
                >
                  <option value={79}>Thành phố Hồ Chí Minh</option>
                </select>
              </div>

              {/* DISTRICT */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Quận / Huyện
                </label>
                <select
                  value={shippingAddress.userDistrict}
                  onChange={handleDistrictChange}
                  className="w-full rounded-full border border-gray-300 px-5 py-3
                   focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  <option value="" disabled>
                    Chọn quận / huyện
                  </option>
                  {districts.map((district) => (
                    <option key={district.code} value={district.code}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* WARD */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Phường / Xã
                </label>
                <select
                  value={shippingAddress.userWard || ""}
                  onChange={handleWardChange}
                  disabled={loadingWards}
                  className="w-full rounded-full  border border-gray-300 px-5 py-3
                   focus:outline-none focus:ring-1 focus:ring-slate-400
                   disabled:bg-gray-100"
                >
                  <option value="" disabled>
                    {loadingWards ? "Đang tải..." : "Chọn phường / xã"}
                  </option>
                  {wards.map((ward) => (
                    <option key={ward.code} value={ward.code}>
                      {ward.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ================= THỜI GIAN GIAO HÀNG ================= */}
          <div className=" rounded-3xl   p-8 mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Thời gian giao hàng dự kiến
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CHỌN NGÀY */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Ngày giao hàng
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={handleDeliveryDateChange}
                  className="w-full rounded-full border border-gray-300 px-5 py-3
                   focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              {/* CHỌN GIỜ */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Giờ giao hàng
                </label>
                <input
                  type="time"
                  step={1800} // ✅ chỉ cho chọn 00 hoặc 30
                  value={deliveryTime}
                  onChange={handleDeliveryTimeChange}
                  className="w-full rounded-full border border-gray-300 px-5 py-3
                   focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
                <p className="text-lg text-gray-500">
                  Chỉ nhận giao theo khung giờ chẵn (00 hoặc 30)
                </p>
              </div>
            </div>
          </div>

          {/* ================= GHI CHÚ ĐƠN HÀNG ================= */}
          <div className=" rounded-3xl   p-8 mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ghi chú đơn hàng
            </h2>

            <textarea
              rows={4}
              placeholder="Ví dụ: giao giờ hành chính, gọi trước khi giao..."
              value={orderNote}
              onChange={handleOrderNoteChange}
              className="w-full rounded-2xl border border-gray-300 px-5 py-4
               focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none"
            />
          </div>

          {/* ================= ACTION BUTTON ================= */}
          <div className="mt-14  rounded-3xl  px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* POLICY */}
              <a
                href="/chinhsach"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-gray-500 hover:text-black underline underline-offset-4"
              >
                Chính sách đơn hàng
              </a>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4">
                <ButtonComponent onClick={handleClickBack} className="px-8">
                  Giỏ hàng
                </ButtonComponent>

                <ButtonComponent
                  className="Next_btn px-12"
                  onClick={handleClickNext}
                >
                  Thanh toán
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInformationPage;
