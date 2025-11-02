import React, { useEffect, useRef, useState } from "react";
import styles from "./HeaderComponent.module.css";
import img from "../../assets/img/AVOCADO.png";
import SearchBoxComponent from "../SearchBoxComponent/SearchBoxComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import ButtonNoBGComponent from "../ButtonNoBGComponent/ButtonNoBGComponent";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { Popover, OverlayTrigger, Button } from "react-bootstrap";
import SideMenuComponent from "../SideMenuComponent/SideMenuComponent";
import * as UserService from "../../api/services/UserService";
import { resetUser, updateUserCoins } from "../../redux/slides/userSlide";
import Loading from "../LoadingComponent/Loading";
import UserIconComponent from "../UserIconComponent/UserIconComponent";
import CartIconComponent from "../CartIconComponent/CartIconComponent";
import VoiceComponent from "../VoiceComponent/VoiceComponent";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showLoading, setShowLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const [isLoadingCoins, setIsLoadingCoins] = useState(false);

  const handleNavigationLogin = () => {
    navigate("/login");
  };
  const handleClickCart = () => {
    navigate("/cart");
  };

  const user = useSelector((state) => state.user);
  const access_token = localStorage.getItem("access_token");

  //Lấy số lượng sản phẩm trong giỏ
  const cartItems = useSelector((state) => state.cart.products);
  const cartQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  ); // Tính tổng số lượng sản phẩm

  // Lấy thông tin xu của user
  const fetchUserCoins = async () => {
    if (!user?.id || !access_token) {
      console.log("Missing user ID or access token:", {
        userId: user?.id,
        hasToken: !!access_token,
      });
      return;
    }

    try {
      setIsLoadingCoins(true);
      console.log("Fetching user coins for user:", user.id);
      const response = await UserService.checkUserCoins(access_token);
      console.log("User coins response:", response);
      if (response.status === "OK") {
        console.log("Setting coins to:", response.data.coins);
        dispatch(updateUserCoins(response.data.coins || 0));
      } else {
        console.log("Response status not OK:", response);
      }
    } catch (error) {
      console.error("Error fetching user coins:", error);
    } finally {
      setIsLoadingCoins(false);
    }
  };

  const handleLogout = async () => {
    setShowLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("cart");
    // localStorage.removeItem("cart");
    // localStorage.removeItem("cart");
    // localStorage.removeItem("cart");
    // console.log(
    //   "Access token after removal:",
    //   localStorage.getItem("access-token")
    // ); // Kiểm tra xem token đã bị xóa chưa
    dispatch(resetUser());
    setShowLoading(false);
    handleNavigationLogin();
  };

  useEffect(() => {
    setShowLoading(true);
    setUserName(user?.userName);
    setShowLoading(false);
  }, [user?.userName, user?.userImage]);

  // Lấy thông tin xu khi user đăng nhập
  useEffect(() => {
    if (user?.id && access_token) {
      fetchUserCoins();
    }
  }, [user?.id, access_token]);

  useEffect(() => {
    let timer;
    if (showPopover) {
      timer = setTimeout(() => {
        setShowPopover(false);
      }, 3000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showPopover]);

  //Click Search
  const handleSearch = (query) => {
    if (!query.trim()) {
      alert("Vui lòng nhập từ khóa để tìm kiếm!");
      return;
    }
    navigate(`/search?search=${encodeURIComponent(query.trim())}`);
  };

  const handleUserInfo = () => {
    navigate("/profile"); // Navigate to user information page
  };

  //Voice search
  // const handleVoiceSearch = (query) => {
  //   if (!query.trim()) {
  //     alert("Không nhận diện được giọng nói. Vui lòng thử lại!");
  //     return;
  //   }
  //   navigate(`/search?search=${encodeURIComponent(query.trim())}`);
  // };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        <div className="d-flex flex-column">
          <SideMenuComponent
            variant="link"
            className="text-start"
            onClick={handleUserInfo}
          >
            Thông tin người dùng
          </SideMenuComponent>
          <SideMenuComponent
            variant="link"
            className="text-start"
            onClick={handleLogout}
          >
            Đăng xuất
          </SideMenuComponent>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <div className={`${styles["bg-white"]} ${styles["bg-shadow"]}`}>
        <div className="container-xl">
          <div className={styles.navbar}>
            <div className="container-fluid">
              {/* nav top */}
              <div className="row">
                <div className="col">
                  <a className="navbar-brand" href="/">
                    <img src={img} alt="Avocado" className="navbar__img" />
                  </a>
                </div>
                <div className={`col ${styles.navbar__search__form}`}>
                  <SearchBoxComponent
                    onSearch={handleSearch}
                    onButtonClick={(query) => handleSearch(query)}
                  />
                  {/* <VoiceComponent onVoiceSearch={handleVoiceSearch} /> */}
                </div>

                <div className={`col ${styles.nav__cart}`}>
                  {user?.isAdmin === false && (
                    <div className={styles.cart__icon__wrapper}>
                      <CartIconComponent onClick={handleClickCart} />
                      {cartQuantity > 0 && (
                        <span className={styles.cart__quantity}>
                          {cartQuantity}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {/* Thêm cột mới cho Xu */}
                <div
                  className="col d-flex align-items-center justify-content-center"
                  style={{ minWidth: "120px" }}
                >
                  {user?.isAdmin === false && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        padding: "5px 10px",
                        // background: "#f8f9fa",
                        borderRadius: "20px",
                        // border: "1px solid #dee2e6",
                      }}
                    >
                      <span style={{ fontSize: "1.6rem" }}>🪙</span>
                      <span
                        style={{
                          fontSize: "1.6rem",
                          fontWeight: "bold",
                          color: "#3a060e",
                        }}
                      >
                        {isLoadingCoins ? "..." : user.coins.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className={`col text-end ${styles.btn__container}`}>
                  <Loading isLoading={showLoading} />
                  {!showLoading && user?.isLoggedIn ? (
                    <div className="d-flex align-items-center gap-3">
                      {/* Hiển thị số xu */}
                      {/* ĐÃ DI CHUYỂN PHẦN NÀY RA NGOÀI */}
                      <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        show={showPopover}
                        onToggle={(nextShow) => setShowPopover(nextShow)}
                        overlay={popover}
                        rootClose
                      >
                        <div className={styles.user__icon}>
                          {userImage ? (
                            <img
                              src={userImage}
                              alt="avatar"
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <UserIconComponent />
                          )}
                          <span style={{ color: "var(--brown100)" }}>
                            {user.userName || user.userEmail || "User"}
                          </span>
                        </div>
                      </OverlayTrigger>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <Link to="/signup" className={styles.btn__signup}>
                        Đăng kí
                      </Link>
                      <div className={styles.btn__signup}>
                        <ButtonComponent onClick={handleNavigationLogin}>
                          Đăng nhập
                        </ButtonComponent>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* nav bottom */}
              <div className={`row ${styles.nav__bot}`}>
                <div className={styles.nav__content}>
                  {/* nav admin */}
                  {user?.isAdmin ? (
                    <>
                      <ButtonNoBGComponent to="/admin/">
                        Trang chủ
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent to="/admin/products">
                        Sản phẩm
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent to="/admin/news">
                        Tin tức
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent to="/introduce">
                        Giới thiệu
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent to="/admin/introduce">
                        Liên hệ
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent to="/admin/dashboard">
                        Quản lí
                      </ButtonNoBGComponent>
                    </>
                  ) : (
                    // nav user
                    <>
                      <ButtonNoBGComponent to="/">
                        Trang chủ
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent to="/products">
                        Sản phẩm
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent to="/news">
                        Tin tức
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent to="/introduce">
                        Giới thiệu
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent to="/contact">
                        Liên hệ
                      </ButtonNoBGComponent>
                      {/* <ButtonNoBGComponent to="/create-cake">
                        Sáng tạo
                      </ButtonNoBGComponent> */}
                      <ButtonNoBGComponent to="/quizz">
                        Gợi ý
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent to="/minigame">
                        Game
                      </ButtonNoBGComponent>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Thêm div giả để tạo khoảng trống cho header */}
      <div className={styles.headerPlaceholder}></div>
    </>
  );
};

export default HeaderComponent;
