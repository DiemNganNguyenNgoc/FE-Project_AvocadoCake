import React from "react";
import PropTypes from "prop-types";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useTranslation } from "react-i18next";
import { addToCart } from "../../redux/slides/cartSlide";
import { useDispatch } from "react-redux";

const CardProduct = ({
  id,
  type,
  img,
  size,
  title,
  price,
  discount,
  averageRating,
  totalRatings,
  onCardClick,
}) => {
  //Hooks
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  //Const
  const finalPrice = discount ? price * (1 - discount / 100) : price;

  // Handle card click (navigate to detail)
  const handleCardClick = () => {
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
      role="button"
      onClick={handleCardClick}
      className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-auto mx-2"
    >
      {/* Image */}
      <img
        src={img}
        alt={title}
        className="w-full md:h-100 sm:h-80 object-cover overflow-hidden"
      />

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h1 className="text-2xl text-gray-800 truncate font-medium">{title}</h1>

        {/* Price */}
        <div className="mt-2">
          {discount > 0 && (
            <span className="line-through text-gray-400 mr-2">
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
          className="mt-2 rounded-xl bg-gradient-to-r from-lime-300 to-emerald-500  text-amber-950 hover:text-amber-950 text-b py-2 px-4 w-full md:text-xl sm:text-base z-10"
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

CardProduct.defaultProps = {
  size: 10,
  discount: 0,
  averageRating: 5.0,
  totalRatings: 0,
  onCardClick: null,
  onAddToCart: null,
};

export default CardProduct;
