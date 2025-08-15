import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./OrderRatingPage.css";
import { Card, Form } from "react-bootstrap";
import RatingStar from "../../../components/RatingStar/RatingStar";
import BackIconComponent from "../../../components/BackIconComponent/BackIconComponent";
import {
  createProductRating,
  getDetailsOrder,
  updateProductRating,
  getUserProductRating,
} from "../../../services/OrderService";
import { useSelector } from "react-redux";
import ButtonComponent from "../../../components/ButtonComponent/ButtonComponent";

const OrderRatingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(location.state?.order);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [ratingErrors, setRatingErrors] = useState({});
  const [editingRatings, setEditingRatings] = useState({});
  const access_token = localStorage.getItem("access_token");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    console.log("Ratings changed:", ratings);
  }, [ratings]);

  useEffect(() => {
    const fetchRatings = async () => {
      if (order?.orderItems && user?.id) {
        try {
          const initialRatings = {};
          const initialComments = {};

          for (const item of order.orderItems) {
            if (item.product) {
              const response = await getUserProductRating(
                item.product._id,
                order._id,
                access_token
              );

              if (response.status === "OK" && response.data) {
                initialRatings[item.product._id] = response.data.rating;
                initialComments[item.product._id] = response.data.comment || "";
              }
            }
          }

          setRatings(initialRatings);
          setComments(initialComments);
        } catch (error) {
          console.error("Error fetching ratings:", error);
        }
      }
    };

    fetchRatings();
  }, [order, user?.id, access_token]);

  const handleEditClick = (productId) => {
    setEditingRatings((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  const handleCancelEdit = (productId) => {
    const originalRating = order.orderItems.find(
      (item) => item.product._id === productId
    )?.rating;

    if (originalRating) {
      setRatings((prev) => ({
        ...prev,
        [productId]: originalRating.rating,
      }));
      setComments((prev) => ({
        ...prev,
        [productId]: originalRating.comment || "",
      }));
    }

    setEditingRatings((prev) => ({
      ...prev,
      [productId]: false,
    }));
  };

  const handleRatingChange = (productId, rating) => {
    console.log("handleRatingChange called with:", { productId, rating });
    setRatings((prev) => {
      console.log("Previous ratings:", prev);
      return {
        ...prev,
        [productId]: rating,
      };
    });
    if (rating > 0) {
      setRatingErrors((prev) => ({
        ...prev,
        [productId]: "",
      }));
    }
  };

  const handleCommentChange = (productId, comment) => {
    setComments((prev) => ({
      ...prev,
      [productId]: comment,
    }));
  };

  const handleSubmitRating = async (productId) => {
    console.log("handleSubmitRating called with:", productId);
    if (!ratings[productId]) {
      setRatingErrors((prev) => ({
        ...prev,
        [productId]: "Vui lòng chọn số sao đánh giá",
      }));
      return;
    }

    try {
      console.log("Submitting rating with data:", {
        productId,
        orderId: order._id,
        rating: ratings[productId],
        comment: comments[productId] || "",
      });
      let response;
      const ratingData = {
        productId,
        orderId: order._id,
        rating: ratings[productId],
        comment: comments[productId] || "",
      };

      const existingRating = order.orderItems.find(
        (item) => item.product._id === productId && item.rating
      );

      if (existingRating) {
        response = await updateProductRating(
          existingRating.rating._id,
          {
            rating: ratings[productId],
            comment: comments[productId] || "",
          },
          access_token
        );
      } else {
        response = await createProductRating(ratingData, access_token);
      }

      if (response.status === "OK") {
        const updatedOrderItems = order.orderItems.map((item) => {
          if (item.product._id === productId) {
            return {
              ...item,
              rating: response.data,
            };
          }
          return item;
        });

        setOrder((prevOrder) => ({
          ...prevOrder,
          orderItems: updatedOrderItems,
        }));

        setEditingRatings((prev) => ({
          ...prev,
          [productId]: false,
        }));

        alert(
          existingRating
            ? "Cập nhật đánh giá thành công!"
            : "Đánh giá thành công!"
        );

        const allRated = updatedOrderItems.every((item) => item.rating);
        if (allRated) {
          alert("Bạn đã đánh giá xong tất cả sản phẩm!");
          navigate("/");
        }
      }
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra khi đánh giá");
    }
  };

  const handleBack = () => {
    navigate("/profile");
  };

  return (
    <div className="container-xl">
      <div className="rating-page">
        <div className="rating-header">
          <div className="back-icon-wrapper">
            <BackIconComponent onClick={handleBack} />
          </div>
          <h2 className="rating-title">Đánh giá sản phẩm</h2>
        </div>

        <div className="order-info mb-4">
          <p>Mã đơn hàng: {order.orderCode}</p>
          <p>
            Ngày đặt: {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </div>

        <div className="products-list">
          {order.orderItems.map(
            (item, index) =>
              item.product && (
                <Card key={index} className="mb-4 product-rating-card">
                  <Card.Body>
                    <div className="d-flex">
                      <img
                        src={item.product.productImage}
                        alt={item.product.productName}
                        className="product-image"
                      />
                      <div className="product-info">
                        <h5>{item.product.productName}</h5>
                        <p>Kích thước: {item.product.productSize} cm</p>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                    </div>

                    <div className="rating-section mt-3">
                      {editingRatings[item.product._id] ? (
                        <>
                          <div className="mb-2">
                            <label>Chọn số sao:</label>
                            <RatingStar
                              rating={ratings[item.product._id] || 0}
                              setRating={(rating) =>
                                handleRatingChange(item.product._id, rating)
                              }
                              isEditable={true}
                              size={24}
                              showRating={false}
                            />
                            {ratingErrors[item.product._id] && (
                              <div className="text-danger mt-1">
                                {ratingErrors[item.product._id]}
                              </div>
                            )}
                          </div>

                          <Form.Group className="mb-3">
                            <Form.Label>Nhận xét của bạn:</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={comments[item.product._id] || ""}
                              onChange={(e) =>
                                handleCommentChange(
                                  item.product._id,
                                  e.target.value
                                )
                              }
                              placeholder="Nhập nhận xét của bạn về sản phẩm..."
                              maxLength={500}
                            />
                            <Form.Text className="text-muted">
                              {(comments[item.product._id] || "").length}/500 ký
                              tự
                            </Form.Text>
                          </Form.Group>

                          <div className="d-flex gap-2">
                            <ButtonComponent
                              variant="primary"
                              onClick={() =>
                                handleSubmitRating(item.product._id)
                              }
                            >
                              Cập nhật đánh giá
                            </ButtonComponent>
                            <ButtonComponent
                              variant="secondary"
                              onClick={() => handleCancelEdit(item.product._id)}
                            >
                              Hủy
                            </ButtonComponent>
                          </div>
                        </>
                      ) : (
                        <>
                          {item.rating ? (
                            <>
                              <div className="mb-2">
                                <RatingStar
                                  rating={ratings[item.product._id]}
                                  setRating={() => {}}
                                  isEditable={false}
                                  size={24}
                                  showRating={true}
                                />
                                {comments[item.product._id] && (
                                  <p className="mt-2">
                                    {comments[item.product._id]}
                                  </p>
                                )}
                              </div>
                              <ButtonComponent
                                variant="outline-primary"
                                onClick={() =>
                                  handleEditClick(item.product._id)
                                }
                              >
                                Sửa đánh giá
                              </ButtonComponent>
                            </>
                          ) : (
                            <>
                              <div className="mb-2">
                                <label>Chọn số sao:</label>
                                <RatingStar
                                  rating={ratings[item.product._id] || 0}
                                  setRating={(rating) =>
                                    handleRatingChange(item.product._id, rating)
                                  }
                                  isEditable={true}
                                  size={24}
                                  showRating={false}
                                />
                                {ratingErrors[item.product._id] && (
                                  <div className="text-danger mt-1">
                                    {ratingErrors[item.product._id]}
                                  </div>
                                )}
                              </div>

                              <Form.Group className="mb-3">
                                <Form.Label>Nhận xét của bạn:</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  value={comments[item.product._id] || ""}
                                  onChange={(e) =>
                                    handleCommentChange(
                                      item.product._id,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Nhập nhận xét của bạn về sản phẩm..."
                                  maxLength={500}
                                />
                                <Form.Text className="text-muted">
                                  {(comments[item.product._id] || "").length}
                                  /500 ký tự
                                </Form.Text>
                              </Form.Group>

                              <ButtonComponent
                                variant="primary"
                                onClick={() =>
                                  handleSubmitRating(item.product._id)
                                }
                              >
                                Gửi đánh giá
                              </ButtonComponent>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderRatingPage;
