import React, { useState, useEffect } from "react";
import "./CartPage.css";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import ProductInfor from "../../../components/ProductInfor/ProductInfor";
import QuantityBtn from "../../../components/QuantityBtn/QuantityBtn";
import DeleteBtn from "../../../components/DeleteBtn/DeleteBtn";
import CheckboxComponent from "../../../components/CheckboxComponent/CheckboxComponent";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../redux/slides/cartSlide";
import { getAllDiscount } from "../../../services/DiscountService"; // gọi API trực tiếp

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.cart.products);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [activeDiscounts, setActiveDiscounts] = useState([]);

  // Fetch các discount còn hiệu lực
  useEffect(() => {
    const fetchActiveDiscounts = async () => {
      try {
        const data = await getAllDiscount();
        console.log("VATA: ", data);
        const now = Date.now();
        const filtered = data.data.filter((discount) => {
          const start = new Date(discount.discountStartDate).getTime();
          const end = new Date(discount.discountEndDate).getTime();
          return start <= now && end >= now;
        });
        console.log("VATAdasd: ", filtered);
        setActiveDiscounts(filtered); // ✅ đúng cách
      } catch (err) {
        console.error("Lỗi khi lấy discount:", err);
      }
    };

    fetchActiveDiscounts();
  }, []);

  const calculatePrice = (price) => {
    if (typeof price !== "string") return price;
    return parseFloat(price.replace(/[^0-9.-]+/g, ""));
  };

  const getDiscountedPrice = (productId, originalPrice) => {
    const price = calculatePrice(originalPrice);

    const matchedDiscount = activeDiscounts.find((discount) =>
      discount.discountProduct?.some((pro) =>
        typeof pro === "string" ? pro === productId : pro._id === productId
      )
    );

    console.log("VALUEqe: ", matchedDiscount);
    const discountValue = matchedDiscount?.discountValue || 0;
    console.log("VALUE: ", discountValue);
    return Math.round(price * (1 - discountValue / 100));
  };

  const totalAmount = products.reduce((acc, product) => {
    const discountedPrice = getDiscountedPrice(product.id, product.price);
    return acc + discountedPrice * product.quantity;
  }, 0);

  const isSelected = (productId) => selectedProducts.includes(productId);

  const toggleSelectRow = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length
        ? []
        : products.map((product) => product.id)
    );
  };

  const handleRemoveProduct = (id) => {
    dispatch(removeFromCart({ id }));
  };

  // Tính tổng số lượng sản phẩm được chọn
  const totalSelectedQuantity = products
    .filter((product) => selectedProducts.includes(product.id))
    .reduce((acc, product) => acc + product.quantity, 0);

  const handleBuyNow = () => {
    if (totalSelectedQuantity > 99) {
      alert("Tổng số lượng sản phẩm không được vượt quá 99!");
      return;
    }
    const selectedDetails = products.filter((product) =>
      selectedProducts.includes(product.id)
    );
    navigate("/order-information", {
      state: {
        selectedProductDetails: selectedDetails,
        selectedProductIds: selectedProducts,
      },
    });
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="container-xl cart-container">
      <div className="titleHolderCart">
        <button
          className="back_btn"
          onClick={() => handleNavigate("/products")}
        >
          <BackIconComponent />
        </button>
        <h1 className="titleCart">GIỎ HÀNG</h1>
      </div>

      <div className="product_area">
        <table>
          <thead>
            <tr className="HeaderHolder">
              <th>
                <CheckboxComponent
                  isChecked={selectedProducts.length === products.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="ProductInforHear">Thông tin sản phẩm</th>
              <th className="PriceHeader">Đơn giá</th>
              <th className="QuantityHeader">Số lượng</th>
              <th className="MoneyHeader">Thành tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const discountedPrice = getDiscountedPrice(
                product.id,
                product.price
              );
              return (
                <tr key={product.id} className="LineProduct">
                  <td>
                    <CheckboxComponent
                      isChecked={isSelected(product.id)}
                      onChange={() => toggleSelectRow(product.id)}
                    />
                  </td>
                  <td className="ProductInfor">
                    <ProductInfor
                      image={product.img}
                      name={product.title}
                      size={product.size ? `${product.size} cm` : ""}
                    />
                  </td>
                  <td className="PriceProduct">
                    <p className="Price">
                      {discountedPrice.toLocaleString()} VND
                    </p>
                  </td>
                  <td className="QuantityBtn">
                    <QuantityBtn
                      initialQuantity={product.quantity}
                      productId={product.id}
                    />
                  </td>
                  <td className="Money">
                    <p className="MoneyProduct">
                      {(discountedPrice * product.quantity).toLocaleString()}{" "}
                      VND
                    </p>
                  </td>
                  <td className="DeleteBtn">
                    <DeleteBtn
                      onClick={() => handleRemoveProduct(product.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="Btnarea">
          <div className="total-holder">
            <p className="tong">Tổng tiền:</p>
            <p className="total">{totalAmount.toLocaleString()} VND</p>
          </div>
          <div className="Btnholder">
            <button
              className="Buy_more"
              onClick={() => handleNavigate("/products")}
            >
              Mua thêm
            </button>
            <ButtonComponent
              className="Buy_btn"
              onClick={handleBuyNow}
              disabled={selectedProducts.length === 0}
            >
              Mua ngay
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
