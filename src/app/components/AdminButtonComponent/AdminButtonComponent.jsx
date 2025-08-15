import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminButtonComponent.module.css";

const AdminButtonComponent = ({ to, children, className = "", ...props }) => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (to) {
      event.preventDefault();
      navigate(to);
    }
    if (props.onClick) {
      props.onClick(event);
    }
  };

  // Tạo class name dựa trên className prop
  const buttonClassName = `${styles.btn__admin} ${styles[className] || ""}`;

  return (
    <button className={buttonClassName} onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export default AdminButtonComponent;
