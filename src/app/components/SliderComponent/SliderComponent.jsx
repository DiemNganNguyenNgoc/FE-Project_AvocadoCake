import React, { useRef } from 'react';
import Slider from "react-slick";
import './SliderComponent.css'; // Đảm bảo bạn đã import file CSS

const SliderComponent = ({ arrImg, onImageClick }) => {
 

  const settings = {
    dots: true, 
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false // Ẩn các nút mặc định của react-slick
  };
console.log("adfg", arrImg)


  return (
    <div>
    {Array.isArray(arrImg) && arrImg.length > 0 && (
  <Slider {...settings}>
    {arrImg.map((image, index) => (
      <div key={index} className="slider-item">
        <img
          className="slider-image"
          src={image}
          alt={`slider-${index}`}
          onClick={() => onImageClick(image)}
        />
      </div>
    ))}
  </Slider>
)}

</div>
      
)};

export default SliderComponent;
