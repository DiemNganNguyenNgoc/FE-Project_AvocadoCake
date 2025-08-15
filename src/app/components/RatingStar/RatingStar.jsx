import React, { useState } from "react";
import "./RatingStar.css";
import { FaStar } from "react-icons/fa";

const RatingStar = ({
  rating = 5,
  setRating,
  isEditable = false,
  size = 20,
  showRating = true,
  showCount = true,
  totalRatings = 5,
}) => {
  const [hover, setHover] = useState(null);

  const displayRating =
    typeof rating === "number" ? Math.min(Math.max(rating, 1), 5) : 5;

  return (
    <div className="rating-container">
      <div className="stars-container">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <FaStar
              key={index}
              className="star"
              color={
                ratingValue <= (hover || displayRating) ? "#ffc107" : "#e4e5e9"
              }
              size={size}
              onClick={() => isEditable && setRating(ratingValue)}
              onMouseEnter={() => isEditable && setHover(ratingValue)}
              onMouseLeave={() => isEditable && setHover(null)}
              style={{ cursor: isEditable ? "pointer" : "default" }}
            />
          );
        })}
      </div>
      {showRating && (
        <div className="rating-info">
          <span className="rating-value">{displayRating.toFixed(1)}</span>
          {showCount && totalRatings > 0 && (
            <span className="rating-count">({totalRatings} đánh giá)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingStar;
