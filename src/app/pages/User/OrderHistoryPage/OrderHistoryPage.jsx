import { React, useEffect, useState } from "react";
import "./OrderHistoryPage.css";
import SideMenuComponent from "../../../components/SideMenuComponent/SideMenuComponent";
import OrderHistoryCardComponent from "../../../components/OrderHistoryCardComponent/OrderHistoryCardComponent";
import {
  getOrdersByUser,
  createProductRating,
  getUserProductRating,
  updateProductRating,
} from "../../../services/OrderService";
import img from "../../../assets/img/hero_1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../../services/UserService";
import { resetUser, updateUser } from "../../../redux/slides/userSlide";
import RatingStar from "../../../components/RatingStar/RatingStar";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";

const OrderHistoryPage = () => {
  const [showLoading, setShowLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [existingRating, setExistingRating] = useState(null);

  const access_token = localStorage.getItem("access_token");
  console.log("token", access_token);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      fetchOrderByUser();
    } else {
      console.error("User ID is missing in Redux state");
    }
  }, [user]);

  const fetchOrderByUser = async () => {
    try {
      setLoading(true);
      console.log("Fetching orders...");
      const response = await getOrdersByUser(access_token, user.id);
      console.log("Orders fetched:", response.data);
      setOrders(response.data.reverse());
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = async (product, orderId) => {
    try {
      // Kiểm tra xem người dùng đã đánh giá chưa
      const ratingResponse = await getUserProductRating(
        product._id,
        orderId,
        access_token
      );
      if (ratingResponse.status === "OK" && ratingResponse.data) {
        setExistingRating(ratingResponse.data);
        setRating(ratingResponse.data.rating);
        setComment(ratingResponse.data.comment || "");
      } else {
        setExistingRating(null);
        setRating(0);
        setComment("");
      }
    } catch (error) {
      console.error("Error checking existing rating:", error);
    }

    setSelectedProduct({ ...product, orderId });
    setShowRatingModal(true);
    setRatingError("");
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      setRatingError("Vui lòng chọn số sao đánh giá");
      return;
    }

    try {
      let response;
      const ratingData = {
        productId: selectedProduct._id,
        orderId: selectedProduct.orderId,
        rating,
        comment,
      };

      if (existingRating) {
        // Nếu đã có đánh giá, cập nhật
        response = await updateProductRating(
          existingRating._id,
          {
            rating,
            comment,
          },
          access_token
        );
      } else {
        // Nếu chưa có đánh giá, tạo mới
        response = await createProductRating(ratingData, access_token);
      }

      if (response.status === "OK") {
        setShowRatingModal(false);
        // Refresh orders to update ratings
        fetchOrderByUser();
        alert(
          existingRating
            ? "Cập nhật đánh giá thành công!"
            : "Đánh giá thành công!"
        );
      } else {
        setRatingError(response.message);
      }
    } catch (error) {
      setRatingError(error.message || "Có lỗi xảy ra khi đánh giá");
    }
  };

  // const handleClickProfile=(()=>{
  //   navigate('/user-info')
  // })
  // const handleClickOrder=(()=>{
  //   navigate('/order-history')
  // })

  // const orders = [
  //   {
  //     id: 1,
  //     status: "in-progress", // Trạng thái đơn hàng: "delivered" hoặc "in-progress"
  //     products: [
  //       {
  //         name: "Tiramisu trái cây lộn xộn",
  //         size: "23 cm",
  //         price: "100000",
  //         quantity: 2,
  //         image: img,
  //       },
  //       {
  //         name: "Bánh kem bơ matcha",
  //         size: "18 cm",
  //         price: "150000",
  //         quantity: 1,
  //         image: img,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     status: "delivered",
  //     products: [
  //       {
  //         name: "Bánh cuộn sô cô la",
  //         size: "20 cm",
  //         price: "120000",
  //         quantity: 1,
  //         image: img,
  //       },
  //     ],
  //   },
  // ];
  // const handleNavigationLogin = () => {
  //     navigate("/login");
  //   };
  //   const handleLogout = async () => {
  //     setShowLoading(true);
  //     await UserService.logoutUser();
  //     localStorage.removeItem("access_token");
  //     localStorage.removeItem("refresh_token");
  //     localStorage.removeItem("cart");
  //     // console.log(
  //     //   "Access token after removal:",
  //     //   localStorage.getItem("access-token")
  //     // ); // Kiểm tra xem token đã bị xóa chưa
  //     dispatch(resetUser());
  //     setShowLoading(false);
  //     handleNavigationLogin();
  //   };

  return (
    <div>
      <div className="container-xl">
        <div className="user-info__container">
          <div className="user-info__bot">
            {/* <div className="side-menu__info">
              <SideMenuComponent onClick={handleClickProfile}>
                Thông tin cá nhân
              </SideMenuComponent>
              <SideMenuComponent>Khuyến mãi</SideMenuComponent>
              <SideMenuComponent onClick={handleClickOrder}>
                Đơn hàng
              </SideMenuComponent>
              <SideMenuComponent onClick={handleLogout}>
                Đăng xuất
              </SideMenuComponent>
            </div> */}
            <div className="order-history__info">
              <h2 className="order-history__title">Lịch sử mua hàng</h2>
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order, index) => {
                  console.log(`Order ${index + 1}:`, order); // In ra từng đơn hàng trong console
                  return (
                    <OrderHistoryCardComponent
                      key={order._id}
                      order={order}
                      // onRateClick={handleRatingClick}
                    />
                  );
                })
              ) : (
                <div className="no-orders">Không có đơn hàng nào.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showRatingModal} onHide={() => setShowRatingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {existingRating ? "Cập nhật đánh giá" : "Đánh giá sản phẩm"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="product-info mb-3">
                <h5>{selectedProduct.productName}</h5>
                <p>Kích thước: {selectedProduct.productSize} cm</p>
              </div>
              <div className="rating-section mb-3">
                <label className="mb-2 d-block">Chọn số sao:</label>
                <RatingStar
                  rating={rating}
                  setRating={setRating}
                  isEditable={true}
                  size={30}
                  showRating={false}
                />
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Nhận xét của bạn:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập nhận xét của bạn về sản phẩm..."
                  maxLength={500}
                />
                <Form.Text className="text-muted">
                  {comment.length}/500 ký tự
                </Form.Text>
              </Form.Group>
              {ratingError && (
                <div className="text-danger mb-3">{ratingError}</div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <ButtonComponent
            variant="secondary"
            onClick={() => setShowRatingModal(false)}
          >
            Hủy
          </ButtonComponent>
          <ButtonComponent variant="primary" onClick={handleSubmitRating}>
            {existingRating ? "Cập nhật đánh giá" : "Gửi đánh giá"}
          </ButtonComponent>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderHistoryPage;
