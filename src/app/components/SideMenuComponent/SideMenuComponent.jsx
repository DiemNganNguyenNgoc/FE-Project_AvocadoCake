import React from "react";
import "./SideMenuComponent.css";

const SideMenuComponent = ({ value, onClick, isActive, children }) => {
  return (
      <div
        className="btn__side-menu sticky w-fit "
        role="group"
        aria-label="Vertical button group"
      >
        <button
          className={`btn__component ${isActive ? "active" : ""} sm:text-xl md:text-2xl sm:w-[150px] lg:w-[200px]`}
          onClick={()=> onClick(value)}
        >
          {children}
        </button>
      </div>
    
  );
};

export default SideMenuComponent;
