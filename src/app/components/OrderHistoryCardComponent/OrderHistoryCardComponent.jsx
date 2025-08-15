import React, { useState, useEffect } from "react";
import ProductRowComponent from "../ProductRowComponent/ProductRowComponent";
import StatusComponent from "../StatusComponent/StatusComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import "./OrderHistoryCardComponent.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import ProductInforCustom from "../../components/ProductInfor/ProductInforCustom";
import RatingStar from "../RatingStar/RatingStar";
import { getUserProductRating } from "../../services/OrderService";
import { useSelector } from "react-redux";

const OrderHistoryCardComponent = ({ order, onRateClick }) => {
  const navigate = useNavigate(); // Hook điều hướng
  const [hasRating, setHasRating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const access_token = localStorage.getItem("access_token");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const checkOrderRating = async () => {
      if (order.status.statusName === "Đã giao" && user?.id) {
        try {
          setIsLoading(true);
          // Kiểm tra đánh giá của sản phẩm đầu tiên trong đơn hàng
          // (vì nếu có một sản phẩm được đánh giá thì đơn hàng đã được đánh giá)
          const firstProduct = order.orderItems[0]?.product;
          if (firstProduct) {
            const response = await getUserProductRating(
              firstProduct._id,
              order._id,
              access_token
            );
            setHasRating(response.status === "OK" && response.data !== null);
          }
        } catch (error) {
          console.error("Error checking rating:", error);
          setHasRating(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkOrderRating();
  }, [order, user?.id, access_token]);

  const handleViewDetails = (id) => {
    console.log("ORDERID", id);

    console.log("ITEM", order);
    navigate(`/order-detail-history/${id}`, { state: { order } }); // Chuyển hướng với dữ liệu
  };

  const handleRateOrder = (orderId) => {
    navigate(`/order-rating/${orderId}`, { state: { order } });
  };

  // const totalAmount = order.products.reduce((acc, product) => {
  //   return acc + parseInt(product.price) * parseInt(product.quantity); // Tổng tiền của tất cả sản phẩm
  // }, 0);
  const totalAmount = order.totalPrice;
  // console.log("ORDERCOMPONENT", order.orderItems)
  console.log("ORDERCOMPONENT1313", totalAmount);

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "SHIPPING":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "CONFIRMED":
        return "status-confirmed";
      case "SHIPPING":
        return "status-shipping";
      case "DELIVERED":
        return "status-delivered";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="order-card">
      <div className="order-title d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <StatusComponent status={order.status.statusName} />
          {order.status.statusName === "Đã giao" && !isLoading && (
            <ButtonComponent
              variant="outline-primary"
              size="sm"
              className="rate-order-button"
              onClick={() => handleRateOrder(order._id)}
            >
              {hasRating ? "Cập nhật đánh giá" : "Đánh giá"}
            </ButtonComponent>
          )}
        </div>
      </div>
      <div className="order-products">
        {Array.isArray(order.orderItems) && order.orderItems.length > 0 ? (
          order.orderItems.map((item, index) => (
            <div key={index} className="product-item">
              {item.product ? (
                <>
                  <ProductInforCustom
                    image={item.product.productImage}
                    name={item.product.productName}
                    size={item.product.productSize}
                    quantity={item.quantity}
                    price={item.total}
                  />
                  {item.rating && (
                    <div className="product-rating">
                      <RatingStar
                        rating={item.rating.rating}
                        setRating={() => {}}
                        isEditable={false}
                        size={16}
                        showCount={false}
                      />
                      {item.rating.comment && (
                        <div className="rating-comment">
                          {item.rating.comment}
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted">Sản phẩm không còn tồn tại</div>
              )}
            </div>
          ))
        ) : (
          <div>Không có sản phẩm nào trong đơn hàng này.</div>
        )}

        <div className="order-footer d-flex justify-content-between align-items-center">
          <ButtonComponent
            className="btn-detail"
            onClick={() => handleViewDetails(order._id)}
          >
            Chi tiết
          </ButtonComponent>
          <div className="order-total d-flex text-center gap-5">
            <label>Tổng số tiền: </label>{" "}
            <div>{totalAmount.toLocaleString()} VND</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryCardComponent;
