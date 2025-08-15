import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../../../../components/ButtonComponent/ButtonComponent";
import FormComponent from "../../../../components/FormComponent/FormComponent";
import SideMenuComponent_AdminManage from "../../../../components/SideMenuComponent_AdminManage/SideMenuComponent_AdminManage";
import { useMutationHook } from "../../../../hooks/useMutationHook";
import { createDiscount } from "../../../../services/DiscountService";
import "./AddDiscountPage.css";

const AddDiscountPage = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");

  const [discount, setDiscount] = useState({
    discountCode: "",
    discountName: "",
    discountValue: "",
    discountProduct: [],
    discountImage: null,
    discountStartDate: "",
    discountEndDate: "",
  });
  const [products, setProducts] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("discount");
  const [disabledProductIds, setDisabledProductIds] = useState([]);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Lấy tất cả sản phẩm
        const response = await fetch("http://localhost:3001/api/product/get-all-product", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setProducts(data.data);
        }


      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchProducts();
  }, []);


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDiscount((prev) => ({ ...prev, discountImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDiscount((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductCheckboxChange = (productId) => {
    setDiscount((prev) => {
      const selected = prev.discountProduct.includes(productId);
      const updatedProducts = selected
        ? prev.discountProduct.filter((id) => id !== productId)
        : [...prev.discountProduct, productId];
      return { ...prev, discountProduct: updatedProducts };
    });
  };

  const mutation = useMutationHook(async (formData) => {
    try {
      const response = await createDiscount(formData, accessToken);

      if (response.status === "OK") {
        alert("Thêm khuyến mãi thành công!");
        navigate("/admin/discount-list");
      } else {
        alert(`Thêm khuyến mãi thất bại: ${response.message}`);
      }

      return response;
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm khuyến mãi!");
      console.error(error);
      throw error;
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("discountCode", discount.discountCode);
    formData.append("discountName", discount.discountName);
    formData.append("discountValue", discount.discountValue);
    formData.append("discountProduct", JSON.stringify(discount.discountProduct));

    formData.append("discountImage", discount.discountImage);

    formData.append("discountStartDate", discount.discountStartDate);
    formData.append("discountEndDate", discount.discountEndDate);
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    console.log("FROM: ", formData)

    mutation.mutate(formData);
  };

  const handleTabClick = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  return (
    <div className="container-xl">
      <div className="add-discount__container">
        <div className="side-menu__discount">
          <SideMenuComponent_AdminManage activeTab={activeTab} handleTabClick={handleTabClick} />
        </div>

        <div className="add-discount__content">
          <div className="discount__info">
            {/* Banner */}
            <div className="banner">
              <label className="banner__title">Banner khuyến mãi</label>
              <input
                className="banner_image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              {previewImage && (
                <div className="banner__image">
                  <img src={previewImage} alt="Preview" className="banner__image" />
                </div>
              )}
            </div>

            {/* Form */}
            <div className="content">
              <div className="content__item">
                <label className="id__title">Mã khuyến mãi</label>
                <FormComponent
                  placeholder="Nhập mã khuyến mãi"
                  name="discountCode"
                  value={discount.discountCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="content__item">
                <label className="name__title">Tên khuyến mãi</label>
                <FormComponent
                  placeholder="Nhập tên khuyến mãi"
                  name="discountName"
                  value={discount.discountName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="content__item">
                <label className="value__title">Giá trị khuyến mãi (%)</label>
                <FormComponent
                  placeholder="Nhập giá trị khuyến mãi"
                  name="discountValue"
                  value={discount.discountValue}
                  onChange={handleInputChange}
                />
              </div>

              <div className="content__item">
                <label className="name__title">Chọn sản phẩm áp dụng</label>
                <div
                  className="product-list-checkbox"
                  style={{
                    maxHeight: 200,
                    overflowY: "auto",
                    padding: 10,
                    border: "1px solid #ccc",
                    borderRadius: 8,
                  }}
                >
                  {products.length > 0 ? (
                    products.map((product) => {
                      const isDisabled = disabledProductIds.includes(product._id);
                      return (
                        <div key={product._id}>
                          <label style={{ color: isDisabled ? "#888" : "inherit" }}>
                            <input
                              type="checkbox"
                              value={product._id}
                              checked={discount.discountProduct.includes(product._id)}
                              onChange={() => handleProductCheckboxChange(product._id)}
                              disabled={isDisabled}
                            />
                            {` ${product.productName}`}
                            {isDisabled && " (đã có khuyến mãi)"}
                          </label>
                        </div>
                      );
                    })
                  ) : (
                    <p>Không có sản phẩm</p>
                  )}

                </div>
              </div>

              <div className="content__item">
                <label className="time-start__title">
                  Ngày bắt đầu: <strong>{discount.discountStartDate}</strong>
                </label>
                <input
                  type="date"
                  className="form-control discount__date"
                  name="discountStartDate"
                  ref={startDateRef}
                  value={discount.discountStartDate}
                  onChange={handleInputChange}
                  placeholder="Chọn ngày bắt đầu"
                />
              </div>

              <div className="content__item">
                <label className="time-end__title">
                  Ngày kết thúc: <strong>{discount.discountEndDate}</strong>
                </label>
                <input
                  type="date"
                  className="form-control discount__date"
                  name="discountEndDate"
                  ref={endDateRef}
                  value={discount.discountEndDate}
                  onChange={handleInputChange}
                  placeholder="Chọn ngày kết thúc"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="btn__add-discount">
              <ButtonComponent onClick={handleSubmit} disabled={mutation.isLoading}>
                {mutation.isLoading ? "Đang lưu..." : "Lưu"}
              </ButtonComponent>
              <ButtonComponent onClick={() => navigate("/admin/discount-list")}>Thoát</ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDiscountPage;
