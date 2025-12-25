import React, { useState, useEffect } from "react";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";
import { useNavigate } from "react-router-dom";
import ProductInfor from "../../../components/ProductInfor/ProductInfor";
import QuantityBtn from "../../../components/QuantityBtn/QuantityBtn";
import DeleteBtn from "../../../components/DeleteBtn/DeleteBtn";
import CheckboxComponent from "../../../components/CheckboxComponent/CheckboxComponent";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart } from "../../../redux/slides/cartSlide";
import { getAllDiscount } from "../../../api/services/DiscountService";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.cart.products);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [activeDiscounts, setActiveDiscounts] = useState([]);

  /* ================= FETCH DISCOUNT ================= */
  useEffect(() => {
    const fetchActiveDiscounts = async () => {
      try {
        const data = await getAllDiscount();
        const now = Date.now();
        const filtered = data.data.filter((discount) => {
          const start = new Date(discount.discountStartDate).getTime();
          const end = new Date(discount.discountEndDate).getTime();
          return start <= now && end >= now;
        });
        setActiveDiscounts(filtered);
      } catch (err) {
        console.error("Lỗi khi lấy discount:", err);
      }
    };
    fetchActiveDiscounts();
  }, []);

  /* ================= PRICE UTILS ================= */
  const calculatePrice = (price) =>
    typeof price === "string"
      ? parseFloat(price.replace(/[^0-9.-]+/g, ""))
      : price;

  const getDiscountedPrice = (productId, originalPrice) => {
    const price = calculatePrice(originalPrice);
    const matchedDiscount = activeDiscounts.find((discount) =>
      discount.discountProduct?.some((pro) =>
        typeof pro === "string" ? pro === productId : pro._id === productId
      )
    );
    const discountValue = matchedDiscount?.discountValue || 0;
    return Math.round(price * (1 - discountValue / 100));
  };

  /* ================= TOTAL ================= */
  const totalAmount = products.reduce((acc, product) => {
    const discountedPrice = getDiscountedPrice(product.id, product.price);
    return acc + discountedPrice * product.quantity;
  }, 0);

  /* ================= SELECT ================= */
  const toggleSelectRow = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length
        ? []
        : products.map((p) => p.id)
    );
  };

  /* ================= ACTION ================= */
  const handleBuyNow = () => {
    const selectedDetails = products.filter((p) =>
      selectedProducts.includes(p.id)
    );
    navigate("/order-information", {
      state: {
        selectedProductDetails: selectedDetails,
        selectedProductIds: selectedProducts,
      },
    });
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-screen-xl mx-auto px-4 pb-28">
      {/* HEADER */}
      <div className="flex items-center gap-3 py-6">
        <button
          onClick={() => navigate("/products")}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          <BackIconComponent />
        </button>
        <h1 className="text-2xl font-bold tracking-wide text-gray-800">
          Giỏ hàng
        </h1>
      </div>

      {/* TABLE */}
      <div className="relative">
        <div className="overflow-x-auto bg-white rounded-2xl border shadow-sm">
          <table className="min-w-full bg-white text-lg text-gray-800 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-white border-b border-gray-200">
              <tr className="uppercase tracking-wide text-lg font-semibold text-gray-600">
                <th className="px-5 py-4 text-center w-12"></th>

                <th className="px-5 py-4 text-left table-cell">Sản phẩm</th>

                <th className="px-5 py-4 text-center hidden md:table-cell">
                  Đơn giá
                </th>

                <th className="px-5 py-4 text-center hidden md:table-cell">
                  Số lượng
                </th>

                <th className="px-5 py-4 text-right hidden md:table-cell">
                  Thành tiền
                </th>

                <th className="px-5 py-4 w-12"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const discountedPrice = getDiscountedPrice(
                  product.id,
                  product.price
                );

                return (
                  <tr key={product.id} className="bg-white">
                    {/* CHECKBOX */}
                    <td className="px-5 py-5 text-center align-top">
                      <CheckboxComponent
                        isChecked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelectRow(product.id)}
                      />
                    </td>

                    {/* PRODUCT INFO */}
                    <td className="px-3 py-2 ">
                      <div className="flex items-center">
                        <ProductInfor
                          image={product.img}
                          name={product.title}
                          size={product.size ? `${product.size} cm` : ""}
                        />
                      </div>
                      {/* MOBILE INFO */}
                      <div className="md:hidden mt-4 text-lg text-gray-600 space-y-2">
                        <div>
                          Đơn giá:{" "}
                          <span className="font-medium text-gray-900">
                            {discountedPrice.toLocaleString()} VND
                          </span>
                        </div>
                        <div>Số lượng: {product.quantity}</div>
                        <div className="font-semibold text-red-600 text-lg">
                          {(
                            discountedPrice * product.quantity
                          ).toLocaleString()}{" "}
                          VND
                        </div>
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="px-5 py-5 text-center hidden md:table-cell">
                      <span className="font-medium text-gray-900">
                        {discountedPrice.toLocaleString()} VND
                      </span>
                    </td>

                    {/* QUANTITY */}
                    <td className="px-5 py-5 hidden md:table-cell">
                      <div className="flex justify-center">
                        <QuantityBtn
                          initialQuantity={product.quantity}
                          productId={product.id}
                        />
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td className="px-5 py-5 text-right font-semibold text-red-600 hidden md:table-cell md:text-xl">
                      {(discountedPrice * product.quantity).toLocaleString()}{" "}
                      VND
                    </td>

                    {/* DELETE */}
                    <td className="px-5 py-5 text-center">
                      <DeleteBtn
                        onClick={() =>
                          dispatch(removeFromCart({ id: product.id }))
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* STICKY FOOTER */}
        <div className="sticky bottom-0 bg-white border-t shadow-lg mt-6">
          <div className="flex flex-row items-center justify-between gap-4 px-5 py-4">
            {/* LEFT: SELECT ALL + TOTAL */}
            <div className="flex items-center gap-6 text-lg">
              <div className="flex items-center gap-1">
                <CheckboxComponent
                  isChecked={
                    products.length > 0 &&
                    selectedProducts.length === products.length
                  }
                  onChange={toggleSelectAll}
                />
                <span className="text-gray-700">
                  Chọn tất cả ({products.length})
                </span>
              </div>

              <div className="font-semibold">
                Tổng tiền:{" "}
                <span className="text-red-600 text-xl">
                  {totalAmount.toLocaleString()} VND
                </span>
              </div>
            </div>

            {/* RIGHT: ACTION BUTTONS */}
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate("/products")}
                className="px-5 py-2 rounded-full border hover:bg-lime-200 transition w-full md:w-auto font-normal"
              >
                Mua thêm
              </button>

              <ButtonComponent
                onClick={handleBuyNow}
                disabled={selectedProducts.length === 0}
                className="px-6 py-2 w-full md:w-auto font-normal"
              >
                Mua ngay
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
