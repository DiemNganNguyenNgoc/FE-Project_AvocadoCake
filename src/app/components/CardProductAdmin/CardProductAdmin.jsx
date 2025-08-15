import React, { useState } from 'react';
import { Card, Button, Col, Row, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import styles from "./CardProductAdmin.module.css";
import RatingStar from '../RatingStar/RatingStar';

const CardProductAdmin = ({
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
  const UpdateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
      <path d="M14.6458 9.39583L15.6042 10.3542L6.16667 
      19.7917H5.20833V18.8333L14.6458 9.39583ZM18.3958 
      3.125C18.1354 3.125 17.8646 3.22917 17.6667 3.42708L15.7604 
      5.33333L19.6667 9.23958L21.5729 7.33333C21.6695 7.23696 21.7461 
      7.1225 21.7984 6.99648C21.8506 6.87047 21.8775 6.73538 21.8775 
      6.59896C21.8775 6.46253 21.8506 6.32745 21.7984 6.20143C21.7461 6.07542 21.6695 
      5.96095 21.5729 5.86458L19.1354 3.42708C18.9271 3.21875 18.6667 3.125 18.3958 
      3.125ZM14.6458 6.44792L3.125 17.9687V21.875H7.03125L18.5521 10.3542L14.6458 6.44792Z" fill="brown" />
    </svg>

  )
  const navigate = useNavigate();


  const handleUpdateClick = () => {
    navigate("/admin/update-product/"); // Navigate to the update product page
    if (onClick) {
      onClick(); // Call the onUpdate function passed from the parent
    }
  };

  return (
    <Card
      id={styles.CardProduct}
      className={type === "secondary" ? styles.secondary : styles.primary}
    >
      <Card.Img className={styles.ProductImage}
        src={img}
        alt={title} />

      <Card.Body>
        <Card.Title className={styles.cardTitle}>{title}</Card.Title>
        <div className="d-flex justify-content-center mb-2">
          <RatingStar
            rating={Number(averageRating) || 5.0}
            setRating={() => { }}
            isEditable={false}
            size={16}
            showRating={true}
            showCount={false}
            totalRatings={Number(totalRatings) || 0} />
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
          <button onClick={handleUpdateClick} className={styles.cartButton}>
            Chỉnh sửa <UpdateIcon />
          </button>
        </Col>


      </Row>
    </Card>
  );
}



export default CardProductAdmin;
