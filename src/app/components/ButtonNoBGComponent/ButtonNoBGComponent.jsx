import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./ButtonNoBGComponent.module.css";

const ButtonNoBGComponent = ({
  to,
  children,
  className = "",
  onClick,
  isActive,
  ...props
}) => {
  const location = useLocation();
  const active = to ? location.pathname === to : false;

  // Nếu có `to`, render Link; nếu không, render button
  if (to) {
    return (
      <Link
        to={to}
        className={`${styles.btn__noBG__component} ${
          active ? styles.active : ""
        } ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Render button khi không có `to`
  return (
    <button
      className={`${styles.btn__noBG__component} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonNoBGComponent;
