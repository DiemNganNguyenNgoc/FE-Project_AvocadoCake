import React from "react";
import "./ContactPage.css";
import address from "../../../assets/img/address.png";
const ContactPage = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="productadmin__title">LIÊN HỆ</h1>
        <h3 className="text-xl mt-4 text-gray-700">
          Cách thức liên hệ với Avocado Bakery
        </h3>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "auto" }}>
          <div style={{ marginLeft: 137, marginTop: 30 }}>
            <h3>Công ty TNHH Avocado</h3>

            <label>
              Địa chỉ: Đường Mạc Đĩnh Chi, khu phố Tân Hòa, Dĩ An, Bình Dương
            </label>
            <br />
            <label>Email: abc123@gmail.com</label>
            <br />
            <label>Website: avocado.com</label>
          </div>
          <div style={{ marginLeft: 137, marginTop: 30 }}>
            <h3>Hotline</h3>
            <label>Số điện thoại: 0912345678</label>
            <br />
            <label>Hotline CSKH: 0999999999</label>
          </div>
        </div>
        <div>
          <a href="https://maps.app.goo.gl/FMaW1VRMx8zUBUom7">
            <img className="img" src={address}></img>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
