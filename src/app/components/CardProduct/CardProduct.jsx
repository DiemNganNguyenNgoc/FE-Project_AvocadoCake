import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useTranslation } from "react-i18next";
import { addToCart } from "../../redux/slides/cartSlide";
import { useDispatch } from "react-redux";
import {
  trackProductView,
  trackProductClick,
} from "../../api/services/productServices";

const CardProduct = ({
  id,
  type,
  img,
  size = 10,
  title,
  price,
  discount = 0,
  averageRating = 5.0,
  totalRatings = 0,
  onCardClick = null,
}) => {
  //Hooks
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const cardRef = useRef(null);
  const [viewTracked, setViewTracked] = useState(false);

  //Const
  const finalPrice = discount ? price * (1 - discount / 100) : price;

  // Track view khi card được scroll 50%
  useEffect(() => {
    if (!id || viewTracked) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Khi 50% card xuất hiện trong viewport
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            trackProductView(id);
            setViewTracked(true);
            observer.disconnect(); // Chỉ track 1 lần
          }
        });
      },
      {
        threshold: 0.5, // Trigger khi 50% card visible
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [id, viewTracked]);

  // Handle card click (navigate to detail)
  const handleCardClick = () => {
    // Track click
    if (id) {
      trackProductClick(id);
    }

    if (onCardClick) {
      onCardClick({ id, type, title, price: finalPrice, size });
    }
  };

  /**
   * Handle Add To Cart
   * @param  e
   */
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
    <div
      ref={cardRef}
      role="button"
      onClick={handleCardClick}
      className="cursor-pointer bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-auto mx-2"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={img}
          alt={title}
          className="w-full md:h-100 sm:h-80 object-cover overflow-hidden"
        />
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full shadow-lg">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h1 className="text-2xl text-gray-800 truncate font-medium">{title}</h1>

        {/* Price */}
        <div className="mt-2">
          {discount > 0 && (
            <span className="line-through text-gray-400 mr-2 pr-2">
              {price.toLocaleString(i18n.language)}₫
            </span>
          )}
          <span className="font-semibold text-orange-600 text-4xl sm:text-3xl">
            {finalPrice.toLocaleString(i18n.language)}₫
          </span>
        </div>

        {/* Rating */}
        <div className="mt-2 md:text-lg sm:text-sm  text-gray-600">
          ⭐ {averageRating.toFixed(1)} ({totalRatings}{" "}
          {t("button.reviews").toLowerCase()})
        </div>

        {/* Add to cart button */}
        <ButtonComponent
          onClick={handleAddToCart}
          className="mt-2 rounded-2xl bg-gradient-to-r from-lime-300 to-emerald-500  text-amber-950 hover:text-amber-950 text-b py-2 px-4 w-full md:text-xl sm:text-base z-10"
        >
          {t("button.add_to_cart")}
        </ButtonComponent>
      </div>
    </div>
  );
};

CardProduct.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  size: PropTypes.number,
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  discount: PropTypes.number,
  averageRating: PropTypes.number,
  totalRatings: PropTypes.number,
  onCardClick: PropTypes.func,
  onAddToCart: PropTypes.func,
};

export default CardProduct;
