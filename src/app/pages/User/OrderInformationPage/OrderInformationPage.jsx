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
import * as OrderService from "../../../services/OrderService";
import * as UserService from "../../../services/UserService";
import { addOrder, setOrderDetails } from "../../../redux/slides/orderSlide";
import * as DiscountService from "../../../services/DiscountService";

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
        const fullOrderData = { ...orderData, orderId: response.data._id };
        dispatch(
          setOrderDetails({
            selectedProductDetails: selectedProducts,
            shippingAddress,
            totalPrice,
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

  // const handleClickNext = async () => {
  //   const orderData = {
  //     orderItems: selectedProducts.map((product) => ({
  //       product: product.id,
  //       quantity: product.quantity,
  //       total:
  //         typeof product.price === "number"
  //           ? product.price * product.quantity
  //           : parseFloat(product.price.replace(/[^0-9.-]+/g, "")) *
  //             product.quantity,
  //     })),
  //     shippingAddress,
  //     paymentMethod: "Online Payment",
  //     userId: user?.id || null,
  //     deliveryDate,
  //     deliveryTime,
  //     orderNote,
  //     shippingPrice: 30000,
  //     status: "676180405f022353257b7ddd", // PENDING (dùng _id từ collection statuses)
  //     totalItemPrice,
  //     totalPrice,
  //   };

  //   console.log("orderData", orderData);

  //   try {
  //     const response = await mutation.mutateAsync(orderData);
  //     console.log("Create order response:", response); // Debug

  //     if (response?.data?._id) {
  //       const fullOrderData = { ...orderData, _id: response.data._id }; // Sửa: dùng _id thay vì orderId

  //       dispatch(addOrder(fullOrderData));

  //       navigate("/payment", {
  //         state: { ...fullOrderData },
  //       });
  //     } else {
  //       console.error("Failed to create order:", response);
  //       alert(
  //         "Tạo đơn hàng thất bại: " +
  //           (response?.message || "Lỗi không xác định")
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error creating order:", error);
  //     alert("Đã xảy ra lỗi khi tạo đơn hàng.");
  //   }
  // };

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
  // console.log("selectedPro", selectedProducts);

  const totalItemPrice = selectedProducts.reduce((sum, product) => {
    const discount = getDiscountValue(product.id);
    const priceNum = toNumber(product.price);
    return sum + priceNum * product.quantity * (1 - discount / 100);
  }, 0);

  // Tổng tiền đơn = tiền hàng + ship
  //const totalPrice = totalItemPrice + shippingPrice;

  const totalPrice = useMemo(
    () => totalItemPrice + shippingPrice,
    [totalItemPrice, shippingPrice]
  );

  // console.log("totalPrice", totalPrice);

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
      <div className="product_area">
        <table>
          <thead>
            <tr className="HeaderHolder">
              <th className="ProductInforHear">Thông tin sản phẩm</th>
              <th className="PriceHeader">Đơn giá</th>
              <th className="QuantityHeader">Số lượng</th>
              <th className="MoneyHeader">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((product) => {
              const discount = getDiscountValue(product.id);
              const priceNum = toNumber(product.price);
              const finalUnit = priceNum * (1 - discount / 100);
              const lineTotal = finalUnit * product.quantity;

              return (
                <tr key={product.id} className="LineProduct">
                  <td className="ProductInfor">
                    <ProductInfor
                      image={product.img}
                      name={product.title}
                      size={product.size || "Không có size"}
                    />
                  </td>

                  {/* Đơn giá sau giảm */}
                  <td className="PriceProduct">
                    {finalUnit.toLocaleString()} VND
                  </td>

                  <td className="QuantityBtn">x {product.quantity}</td>

                  {/* Thành tiền sau giảm */}
                  <td className="Money">
                    <p className="MoneyProduct">
                      {lineTotal.toLocaleString()} VND
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot>
            {/* --- phí vận chuyển --- */}
            <tr className="LineProduct">
              <td>Phí vận chuyển:</td>
              <td style={{ fontWeight: "bold", fontSize: "2rem" }}>
                {shippingPrice.toLocaleString()} VND
              </td>
            </tr>

            {/* --- gợi ý đăng nhập để free ship --- */}

            {/* --- tổng tiền --- */}
            <tr
              className="total-price d-flex align-items-center justify-content-between"
              style={{ padding: "20px" }}
            >
              <td
                colSpan="3"
                className="text-end"
                style={{ fontWeight: "bold", fontSize: "2rem" }}
              >
                Tổng tiền:
              </td>
              <td
                className="text-end"
                style={{ fontWeight: "bold", fontSize: "2rem" }}
              >
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
        <div className="shipping-info">
          <div className="input-name">
            <div
              style={{
                display: "flex",
                padding: "10px 50px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2>Họ</h2>
                <FormComponent
                  className="input-familyName"
                  name="family"
                  type="text"
                  placeholder="Nhập họ"
                  value={shippingAddress.familyName}
                  onChange={handleInputChange("familyName")}
                ></FormComponent>
              </div>
              <div>
                <h2>Tên</h2>
                <FormComponent
                  className="input-name"
                  type="text"
                  placeholder="Nhập tên"
                  value={shippingAddress.userName}
                  onChange={handleInputChange("userName")}
                ></FormComponent>
              </div>
            </div>
          </div>
          <div className="input-phone-email">
            <div
              style={{
                display: "flex",
                padding: "10px 50px",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2>Số điện thoại</h2>
                <FormComponent
                  className="input-phone"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={shippingAddress.userPhone}
                  onChange={handleInputChange("userPhone")}
                ></FormComponent>
              </div>
              <div>
                <h2>Email</h2>
                <FormComponent
                  className="input-email"
                  type="text"
                  placeholder="Nhập email"
                  value={shippingAddress.userEmail}
                  onChange={handleInputChange("userEmail")}
                ></FormComponent>
              </div>
            </div>
          </div>
          <div className="address" style={{ padding: "10px 50px" }}>
            <h2>Địa chỉ</h2>
            <FormComponent
              // className="input-address"
              type="text"
              placeholder="Nhập địa chỉ giao hàng: Số nhà, hẻm, đường,..."
              style={{ width: "100%" }}
              value={shippingAddress.userAddress}
              onChange={handleInputChange("userAddress")}
            ></FormComponent>
          </div>
          <div className="comboBoxHolder">
            <div className="ProvinceHolder">
              <select
                className="Province"
                value={shippingAddress.userCity}
                onChange={handleCityChange}
              >
                <option value="" disabled>
                  Chọn tỉnh
                </option>
                {cities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="DistrictHolder">
              <select
                className="District"
                value={shippingAddress.userDistrict}
                onChange={handleDistrictChange}
              >
                <option value="" disabled>
                  Chọn quận/huyện
                </option>
                {districts.map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="VillageHolder">
              <select
                className="Village"
                value={shippingAddress.userWard || ""}
                onChange={handleWardChange}
                disabled={loadingWards}
              >
                <option value="" disabled>
                  {loadingWards ? "Đang tải..." : "Chọn phường/xã"}
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

        {/* =====Thoi gian giao hang==== */}
        <div className="DeliveryTimeHolder">
          <p className="ThoiGian">Thời gian giao hàng dự kiến:</p>
          <div className="d-flex" style={{ gap: "50px", margin: "20px 0" }}>
            <div>
              <h3>Chọn giờ:</h3>
              <input
                type="time"
                className="clock"
                value={deliveryTime}
                onChange={handleDeliveryTimeChange}
              ></input>
            </div>
            <div>
              <h3>Chọn ngày:</h3>
              <input
                type="date"
                id="datePicker"
                className="Datepicker"
                value={deliveryDate}
                onChange={handleDeliveryDateChange}
              />
            </div>
          </div>
        </div>
        {/* ============Ghi chu don hang======== */}
        <div className="Note" style={{ margin: "50px 50px" }}>
          <div>
            <h2>Ghi chú đơn hàng:</h2>
            <div>
              <textarea
                rows="5"
                cols="50"
                placeholder="Nhập ghi chú đơn hàng....."
                className="inputNote"
                value={orderNote}
                onChange={handleOrderNoteChange}
              ></textarea>
            </div>
          </div>
        </div>

        {/* ================= Button======== */}
        <div className="Button-area">
          <button className="chinhsachBtn">
            <a href="/chinhsach" target="_blank" className="chinhsach">
              Chính sách đơn hàng
            </a>
          </button>
          <div className="Btn_holder">
            <div>
              <ButtonComponent onClick={handleClickBack}>
                Giỏ hàng
              </ButtonComponent>
            </div>
            <ButtonComponent className="Next_btn" onClick={handleClickNext}>
              Thanh toán
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInformationPage;
