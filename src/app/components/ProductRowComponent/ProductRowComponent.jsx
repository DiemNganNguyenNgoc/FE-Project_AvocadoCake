import React from "react";
import "./ProductRowComponent.css";

const ProductRowComponent = ({ product }) => {
  const name = product.product?.productName || "Không xác định";
  const image = product.product?.productImage || "default_image_url";
  const size = product.product?.productSize || "Không xác định";
  const price = product.product?.productPrice || 0;
  const quantity = product.quantity || 0;
  const discountPercent= product.discountPercent;
  const totalPrice = price*(1-discountPercent/100) * quantity; // Thành tiền

  return (
    <div className="product-row d-flex align-items-center">
      <img src={image} alt={name} className="product-image" />
      <div className="product-name">{name}</div>
      <div className="product-size">{size} cm</div>
      <div className="product-price">{price*(1-discountPercent/100).toLocaleString()} VND</div>
      <div className="product-quantity">x{quantity}</div>
      <div className="product-total">{totalPrice.toLocaleString()} VND</div>
    </div>
  );
};

export default ProductRowComponent;
