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
import { getAllDiscount } from "../../../api/services/DiscountService"; // gọi API trực tiếp

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
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => handleNavigate("/products")}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <BackIconComponent />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">GIỎ HÀNG</h1>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-2xl text-gray-700 pb-20">
          <thead className="bg-gray-100 text-2xl uppercase">
            <tr>
              <th className="p-3 text-center">
                <CheckboxComponent
                  isChecked={selectedProducts.length === products.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-3 text-left hidden sm:table-cell">Sản phẩm</th>
              <th className="p-3 text-left hidden md:table-cell">Đơn giá</th>
              <th className="p-3 text-left hidden md:table-cell">Số lượng</th>
              <th className="p-3 text-left hidden md:table-cell">Thành tiền</th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const discountedPrice = getDiscountedPrice(
                product.id,
                product.price
              );
              return (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-center align-middle">
                    <CheckboxComponent
                      isChecked={isSelected(product.id)}
                      onChange={() => toggleSelectRow(product.id)}
                    />
                  </td>
                  <td className="p-3">
                    <ProductInfor
                      image={product.img}
                      name={product.title}
                      size={product.size ? `${product.size} cm` : ""}
                    />
                    {/* Mobile layout info */}
                    <div className="sm:hidden mt-2 text-gray-500 text-xl">
                      <p>Giá: {discountedPrice.toLocaleString()} VND</p>
                      <p>Số lượng: {product.quantity}</p>
                      <p>
                        Thành tiền:{" "}
                        {(discountedPrice * product.quantity).toLocaleString()}{" "}
                        VND
                      </p>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {discountedPrice.toLocaleString()} VND
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <QuantityBtn
                      initialQuantity={product.quantity}
                      productId={product.id}
                    />
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {(discountedPrice * product.quantity).toLocaleString()} VND
                  </td>
                  <td className="p-3 text-center">
                    <DeleteBtn
                      onClick={() => handleRemoveProduct(product.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Summary */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6 p-4 rounded-lg Btnarea">
        <div className="text-2xl font-semibold">
          <span className="mr-2 text-gray-700">Tổng tiền:</span>
          <span className="text-red-600">
            {totalAmount.toLocaleString()} VND
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleNavigate("/products")}
            className="px-4 py-2 border rounded-full italic hover:underline"
          >
            Mua thêm
          </button>
          <ButtonComponent
            className="px-5 py-2 disabled:opacity-8 disabled:hover:cursor-not-allowed "
            onClick={handleBuyNow}
            disabled={selectedProducts.length === 0}
          >
            Mua ngay
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
