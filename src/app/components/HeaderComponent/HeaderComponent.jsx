import React, { useEffect, useRef, useState } from "react";
import styles from "./HeaderComponent.module.css";
import img from "../../assets/img/AVOCADO.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SearchBoxComponent from "../SearchBoxComponent/SearchBoxComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import ButtonNoBGComponent from "../ButtonNoBGComponent/ButtonNoBGComponent";
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
import RankBadge from "../RankBadge/RankBadge";
import { getUserRank } from "../../api/services/RankService";

const HeaderComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [showLoading, setShowLoading] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const [isLoadingCoins, setIsLoadingCoins] = useState(false);
  const [userRankData, setUserRankData] = useState(null);
  const [isLoadingRank, setIsLoadingRank] = useState(false);
  const [showOthersDropdown, setShowOthersDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigationLogin = () => {
    navigate("/login");
  };

  const handleIntroduce = () => {
    console.log("Navigating to introduce");
    setShowOthersDropdown(false);
    navigate("/introduce");
  };

  const handleContact = () => {
    console.log("Navigating to contact");
    setShowOthersDropdown(false);
    navigate("/contact");
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

  // Lấy thông tin rank của user
  const fetchUserRank = async () => {
    if (!user?.id || !access_token) {
      return;
    }

    try {
      setIsLoadingRank(true);
      const response = await getUserRank(user.id, access_token);
      if (response.status === "OK") {
        setUserRankData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user rank:", error);
    } finally {
      setIsLoadingRank(false);
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

  useEffect(() => {
    if (user?.id && access_token) {
      fetchUserCoins();
      fetchUserRank();
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showOthersDropdown &&
        !event.target.closest(`.${styles.others__dropdown}`)
      ) {
        setShowOthersDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOthersDropdown]);

  // Đóng mobile menu khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest(`.${styles.mobile__menu}`) &&
        !event.target.closest(`.${styles.hamburger__button}`)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Cập nhật activePath và đóng dropdown khi location thay đổi
  useEffect(() => {
    setActivePath(location.pathname);
    setShowOthersDropdown(false);
    setIsMobileMenuOpen(false); // Đóng mobile menu khi chuyển trang
  }, [location.pathname]);

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
  const handleVoucher = () => {
    navigate("/my-vouchers"); // Navigate to voucher page
  };

  const handleRankBenefits = () => {
    navigate("/rank-benefits");
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
            onClick={handleVoucher}
          >
            Voucher của tôi
          </SideMenuComponent>
          <SideMenuComponent
            variant="link"
            className="text-start"
            onClick={handleRankBenefits}
          >
            Quyền lợi Rank
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

  const othersPopover = (
    <Popover id="popover-others">
      <Popover.Body>
        <div className="d-flex flex-column">
          <SideMenuComponent
            variant="link"
            className="text-start"
            onClick={handleIntroduce}
          >
            Giới thiệu
          </SideMenuComponent>
          <SideMenuComponent
            variant="link"
            className="text-start"
            onClick={handleContact}
          >
            Liên hệ
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
              <div className="row align-items-center">
                {/* Hamburger Menu - chỉ hiện trên mobile */}
                <div className="col-auto d-md-none ps-2">
                  <button
                    className={styles.hamburger__button}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Menu"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={
                          isMobileMenuOpen
                            ? "M6 18L18 6M6 6l12 12"
                            : "M4 6h16M4 12h16M4 18h16"
                        }
                      />
                    </svg>
                  </button>
                </div>

                {/* Logo */}
                <div className="col-auto col-md-2 px-1">
                  <a
                    className="navbar-brand d-flex align-items-center"
                    href="/"
                  >
                    <img
                      src={img}
                      alt="Avocado"
                      className={`${styles.navbar__img} img-fluid`}
                    />
                  </a>
                </div>

                {/* Search - responsive width */}
                <div className="col col-md-6 px-1">
                  <SearchBoxComponent
                    onSearch={handleSearch}
                    onButtonClick={(query) => handleSearch(query)}
                  />
                </div>

                {/* Cart + Coins + Rank + User */}
                <div className="col-auto col-md-4 d-flex justify-content-end align-items-center gap-2 gap-md-3 pe-2">
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

                  {/* Ẩn coins và rank trên mobile */}
                  {user?.isAdmin === false && (
                    <div className={`${styles.coins__wrapper} d-none d-md-flex`}>
                      <span className="fs-5">🪙</span>
                      <span className={styles.coins__text}>
                        {isLoadingCoins ? "..." : user.coins.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {user?.isAdmin === false && user?.isLoggedIn && (
                    <div className="d-none d-md-block">
                      <RankBadge
                        userRankData={userRankData}
                        loading={isLoadingRank}
                      />
                    </div>
                  )}

                  <Loading isLoading={showLoading} />
                  {!showLoading && user?.isLoggedIn ? (
                    <OverlayTrigger
                      trigger="click"
                      placement="bottom"
                      show={showPopover}
                      onToggle={(nextShow) => setShowPopover(nextShow)}
                      overlay={popover}
                      rootClose
                    >
                      <div className={`${styles.user__icon} d-none d-md-flex`}>
                        {userImage ? (
                          <img
                            src={userImage}
                            alt="avatar"
                            className={styles.user__avatar}
                          />
                        ) : (
                          <UserIconComponent />
                        )}
                        <span className={styles.user__name}>
                          {user.userName || user.userEmail || "User"}
                        </span>
                      </div>
                    </OverlayTrigger>
                  ) : (
                    <div className="d-none d-md-flex gap-2">
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

              {/* nav bottom - chỉ hiện trên desktop */}
              <div className={`row mt-3 ${styles.nav__bot} d-none d-md-flex`}>
                <div
                  className={`${styles.nav__content} d-flex flex-wrap justify-content-center gap-3`}
                >
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
                    <>
                      <ButtonNoBGComponent
                        to="/"
                        isActive={activePath.startsWith("/")}
                      >
                        Trang chủ
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent
                        to="/products"
                        isActive={activePath.startsWith("/products")}
                      >
                        Sản phẩm
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent
                        to="/vouchers"
                        isActive={activePath.startsWith("/vouchers")}
                      >
                        Voucher
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent
                        to="/rank-benefits"
                        isActive={activePath.startsWith("/rank-benefits")}
                      >
                        Rank
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent
                        to="/design-cake"
                        isActive={activePath.startsWith("/design-cake")}
                      >
                        Thiết kế
                      </ButtonNoBGComponent>
                      {/* <ButtonNoBGComponent
                        to="/create-cake"
                        isActive={activePath.startsWith("/create-cake")}
                      >
                        Thiết kế 2
                      </ButtonNoBGComponent> */}
                      <ButtonNoBGComponent
                        to="/news"
                        isActive={activePath.startsWith("/news")}
                      >
                        Tin tức
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent
                        to="/quizz"
                        isActive={activePath === "/quizz"}
                      >
                        Gợi ý
                      </ButtonNoBGComponent>
                      <ButtonNoBGComponent
                        to="/minigame"
                        isActive={activePath === "/minigame"}
                      >
                        Game
                      </ButtonNoBGComponent>
                      <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        show={showOthersDropdown}
                        onToggle={(nextShow) => setShowOthersDropdown(nextShow)}
                        overlay={othersPopover}
                        rootClose
                      >
                        <div>
                          <ButtonNoBGComponent
                            className={`${styles.others__button} ${
                              ["/introduce", "/contact"].includes(activePath)
                                ? styles.active
                                : ""
                            }`}
                            onClick={() => {
                              console.log("Nút Khác được click!");
                            }}
                          >
                            Khác
                            <svg
                              className={`${styles.dropdown__icon} ${
                                showOthersDropdown ? styles.rotate : ""
                              }`}
                              width="12"
                              height="8"
                              viewBox="0 0 12 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6 8L0.803848 0.5L11.1962 0.5L6 8Z"
                                fill="currentColor"
                              />
                            </svg>
                          </ButtonNoBGComponent>
                        </div>
                      </OverlayTrigger>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Sidebar */}
        <div
          className={`${styles.mobile__menu} ${
            isMobileMenuOpen ? styles.mobile__menu__open : ""
          }`}
        >
          <div className={styles.mobile__menu__content}>
            {/* User Info Section */}
            {user?.isLoggedIn ? (
              <div className={styles.mobile__user__section}>
                <div className={styles.mobile__user__info}>
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="avatar"
                      className={styles.mobile__user__avatar}
                    />
                  ) : (
                    <UserIconComponent />
                  )}
                  <span className={styles.mobile__user__name}>
                    {user.userName || user.userEmail || "User"}
                  </span>
                </div>
                
                {/* Coins và Rank cho mobile */}
                {user?.isAdmin === false && (
                  <div className={styles.mobile__stats}>
                    <div className={styles.mobile__coins}>
                      <span className="fs-5">🪙</span>
                      <span className={styles.coins__text}>
                        {isLoadingCoins ? "..." : user.coins.toLocaleString()}
                      </span>
                    </div>
                    {user?.isLoggedIn && (
                      <RankBadge
                        userRankData={userRankData}
                        loading={isLoadingRank}
                      />
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.mobile__auth__buttons}>
                <Link to="/signup" className={styles.mobile__signup__btn}>
                  Đăng kí
                </Link>
                <button
                  className={styles.mobile__login__btn}
                  onClick={handleNavigationLogin}
                >
                  Đăng nhập
                </button>
              </div>
            )}

            {/* Navigation Links */}
            <nav className={styles.mobile__nav}>
              {user?.isAdmin ? (
                <>
                  <Link
                    to="/admin/"
                    className={`${styles.mobile__nav__item} ${
                      activePath === "/admin/" ? styles.active : ""
                    }`}
                  >
                    Trang chủ
                  </Link>
                  <Link
                    to="/admin/products"
                    className={`${styles.mobile__nav__item} ${
                      activePath.startsWith("/admin/products")
                        ? styles.active
                        : ""
                    }`}
                  >
                    Sản phẩm
                  </Link>
                  <Link
                    to="/admin/news"
                    className={`${styles.mobile__nav__item} ${
                      activePath.startsWith("/admin/news") ? styles.active : ""
                    }`}
                  >
                    Tin tức
                  </Link>
                  <Link
                    to="/introduce"
                    className={`${styles.mobile__nav__item} ${
                      activePath === "/introduce" ? styles.active : ""
                    }`}
                  >
                    Giới thiệu
                  </Link>
                  <Link
                    to="/admin/introduce"
                    className={`${styles.mobile__nav__item} ${
                      activePath === "/admin/introduce" ? styles.active : ""
                    }`}
                  >
                    Liên hệ
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className={`${styles.mobile__nav__item} ${
                      activePath.startsWith("/admin/dashboard")
                        ? styles.active
                        : ""
                    }`}
                  >
                    Quản lí
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={`${styles.mobile__nav__item} ${
                      activePath === "/" ? styles.active : ""
                    }`}
                  >
                    Trang chủ
                  </Link>
                  <Link
                    to="/products"
                    className={`${styles.mobile__nav__item} ${
                      activePath.startsWith("/products") ? styles.active : ""
                    }`}
                  >
                    Sản phẩm
                  </Link>
                  <Link
                    to="/vouchers"
                    className={`${styles.mobile__nav__item} ${
                      activePath.startsWith("/vouchers") ? styles.active : ""
                    }`}
                  >
                    Voucher
                  </Link>
                  <Link
                    to="/rank-benefits"
                    className={`${styles.mobile__nav__item} ${
                      activePath.startsWith("/rank-benefits")
                        ? styles.active
                        : ""
                    }`}
                  >
                    Rank
                  </Link>
                  <Link
                    to="/design-cake"
                    className={`${styles.mobile__nav__item} ${
                      activePath.startsWith("/design-cake") ? styles.active : ""
                    }`}
                  >
                    Thiết kế
                  </Link>
                  <Link
                    to="/news"
                    className={`${styles.mobile__nav__item} ${
                      activePath.startsWith("/news") ? styles.active : ""
                    }`}
                  >
                    Tin tức
                  </Link>
                  <Link
                    to="/quizz"
                    className={`${styles.mobile__nav__item} ${
                      activePath === "/quizz" ? styles.active : ""
                    }`}
                  >
                    Gợi ý
                  </Link>
                  <Link
                    to="/minigame"
                    className={`${styles.mobile__nav__item} ${
                      activePath === "/minigame" ? styles.active : ""
                    }`}
                  >
                    Game
                  </Link>
                  <Link
                    to="/introduce"
                    className={`${styles.mobile__nav__item} ${
                      activePath === "/introduce" ? styles.active : ""
                    }`}
                  >
                    Giới thiệu
                  </Link>
                  <Link
                    to="/contact"
                    className={`${styles.mobile__nav__item} ${
                      activePath === "/contact" ? styles.active : ""
                    }`}
                  >
                    Liên hệ
                  </Link>
                </>
              )}
            </nav>

            {/* User Menu Actions */}
            {user?.isLoggedIn && (
              <div className={styles.mobile__user__actions}>
                <button
                  className={styles.mobile__action__btn}
                  onClick={handleUserInfo}
                >
                  Thông tin người dùng
                </button>
                {user?.isAdmin === false && (
                  <>
                    <button
                      className={styles.mobile__action__btn}
                      onClick={handleVoucher}
                    >
                      Voucher của tôi
                    </button>
                    <button
                      className={styles.mobile__action__btn}
                      onClick={handleRankBenefits}
                    >
                      Quyền lợi Rank
                    </button>
                  </>
                )}
                <button
                  className={`${styles.mobile__action__btn} ${styles.logout__btn}`}
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Overlay khi mobile menu mở */}
        {isMobileMenuOpen && (
          <div
            className={styles.mobile__menu__overlay}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
      <div className={styles.headerPlaceholder}></div>
    </>
  );
};

export default HeaderComponent;
