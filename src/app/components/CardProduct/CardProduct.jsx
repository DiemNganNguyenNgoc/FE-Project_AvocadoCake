import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, Button, Col, Row } from "react-bootstrap";
import { addToCart } from "../../redux/slides/cartSlide";

import styles from "./Card.module.css";
import TagPriceComponent from "../TagPriceComponent/TagPriceComponent";
import RatingStar from "../RatingStar/RatingStar";

const CardProduct = ({
  id,
  type,
  img,
  title,
  discount,
  price,
  onClick,
  averageRating = 5.0,
  totalRatings = 0,
  size,
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.stopPropagation();

    const productElement = e.currentTarget.closest(".card");
    const navIcon = document.querySelector(".nav__icon");

    if (productElement && navIcon) {
      const productRect = productElement.getBoundingClientRect();
      const navIconRect = navIcon.getBoundingClientRect();

      const clone = productElement.cloneNode(true);
      Object.assign(clone.style, {
        position: "fixed",
        top: `${productRect.top}px`,
        left: `${productRect.left}px`,
        width: `${productRect.width}px`,
        height: `${productRect.height}px`,
        zIndex: 1000,
        transition: "all 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
      });

      document.body.appendChild(clone);

      requestAnimationFrame(() => {
        clone.style.transform = `translate(
          ${navIconRect.left - productRect.left}px,
          ${navIconRect.top - productRect.top}px
        ) scale(0.1)`;
        clone.style.opacity = "0.5";
      });

      clone.addEventListener("transitionend", () => clone.remove());
    }

    dispatch(addToCart({ id, img, title, price, size }));
  };

  return (
    <Card
      id={styles.CardProduct}
      className={`${type === "secondary" ? styles.secondary : styles.primary} ${
        onClick ? styles.clickable : ""
      }`}
      onClick={onClick}
    >
      <Card.Img className={styles.ProductImage} src={img} alt={title} />

      <Card.Body>
        <Card.Title className={styles.cardTitle}>{title}</Card.Title>
        <div className="d-flex justify-content-center mb-2">
          <RatingStar
            rating={Number(averageRating) || 5.0}
            setRating={() => {}}
            isEditable={false}
            size={16}
            showRating={true}
            showCount={false}
            totalRatings={Number(totalRatings) || 0}
          />
        </div>
      </Card.Body>

      <Row>
        <Col className="text-center">
          {discount > 0 ? (
            <>
              <p className={styles.priceProductOld}>
                {`${price.toLocaleString("en-US")} VND`}
              </p>
              <p className={styles.priceProduct}>
                {(price * (1 - discount / 100)).toLocaleString("en-US")} VND
              </p>
            </>
          ) : (
            <p className={styles.priceProduct}>
              {`${price.toLocaleString("en-US")} VND`}
            </p>
          )}
          <button onClick={handleAddToCart} className={styles.cartButton}>
            Thêm vào giỏ hàng <CartIcon />
          </button>
        </Col>
      </Row>
    </Card>
  );
};

// Cart SVG icon extracted for clarity
const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="34"
    height="32"
    viewBox="0 0 34 34"
    fill="none"
  >
    <path
      d="M5.58824 5.58826H8.15169C8.90164 5.58826 9.27662 5.58826 9.54788 5.80005C9.81914 6.01185 9.91008 6.37563 10.092 7.10319L10.4213 8.42036C10.6968 9.52241 10.8345 10.0734 11.1857 10.4508C11.3299 10.6057 11.4978 10.7368 11.683 10.8391C12.1343 11.0883 12.7023 11.0883 13.8382 11.0883V11.0883"
      stroke="brown"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M24.8382 23.4633H10.4707C9.80089 23.4633 9.46597 23.4633 9.23909 23.3369C8.97977 23.1925 8.79801 22.9403 8.74299 22.6486C8.69486 22.3934 8.80077 22.0757 9.0126 21.4402V21.4402C9.24717 20.7365 9.36445 20.3846 9.57126 20.1166C9.80841 19.8092 10.1299 19.5775 10.4965 19.4497C10.8162 19.3383 11.1871 19.3383 11.9289 19.3383H19.3382"
      stroke="brown"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.2272 19.3383H12.7825C11.8048 19.3383 10.9704 18.6314 10.8097 17.6671L10.0043 12.8349C9.85196 11.9206 10.557 11.0883 11.4839 11.0883H25.9702C26.7136 11.0883 27.1971 11.8706 26.8646 12.5355L24.016 18.2327C23.6772 18.9103 22.9847 19.3383 22.2272 19.3383Z"
      stroke="brown"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="23.4632" cy="27.5883" r="1.375" fill="brown" />
    <circle cx="12.4632" cy="27.5883" r="1.375" fill="brown" />
  </svg>
);

export default CardProduct;
