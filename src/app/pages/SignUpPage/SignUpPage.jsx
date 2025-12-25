import React, { useEffect, useState } from "react";
import ButtonFormComponent from "../../components/ButtonFormComponent/ButtonFormComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import styles from "./SignUpPage.module.css";
import img1 from "../../assets/img/hero_2.jpg";
import img2 from "../../assets/img/AVOCADO.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as UserService from "../../api/services/UserService";
import * as AuthService from "../../api/services/AuthService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import Message from "../../components/MessageComponent/Message";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    familyName: "",
    userName: "",
    userPhone: "",
    userEmail: "",
    userPassword: "",
    userConfirmPassword: "",
  });
  const navigate = useNavigate();
  const { login } = useAuth();
  const dispatch = useDispatch();

  const [showLoading, setShowLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const mutation = useMutationHook((data) => UserService.signupUser(data));
  const { data, isSuccess, isError } = mutation;

  useEffect(() => {
    if (mutation.isSuccess) {
      setShowLoading(false);
      setStatusMessage({
        type: "Success",
        message: "Đăng ký thành công! Đang chuyển đến trang đăng nhập...",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else if (mutation.isError) {
      setShowLoading(false);
      const errorMessage =
        mutation.error?.message?.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      setStatusMessage({
        type: "Error",
        message:
          typeof errorMessage === "object"
            ? JSON.stringify(errorMessage)
            : errorMessage,
      });
    }
  }, [mutation.isSuccess, mutation.isError, mutation.error, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    mutation.mutate(formData);
  };

  const isValid = () => {
    const {
      familyName,
      userName,
      userPhone,
      userEmail,
      userPassword,
      userConfirmPassword,
    } = formData;
    return (
      familyName.trim() !== "" &&
      userName.trim() !== "" &&
      userPhone.trim() !== "" &&
      userEmail.trim() !== "" &&
      userPassword.trim() !== "" &&
      userPassword === userConfirmPassword
    );
  };

  // Google Signup Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setShowLoading(true);
      const token = credentialResponse.credential;
      const response = await AuthService.loginWithGoogle(token);

      if (response.status === "OK") {
        localStorage.setItem("access_token", response.access_token);

        const decoded = jwtDecode(response.access_token);
        if (decoded?.id) {
          const userDetails = await UserService.getDetailsUser(
            decoded.id,
            response.access_token
          );
          dispatch(
            updateUser({
              ...userDetails?.data,
              access_token: response.access_token,
            })
          );
        }

        setStatusMessage({
          type: "Success",
          message: "Đăng ký Google thành công! Đang chuyển đến trang chủ...",
        });
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      setStatusMessage({
        type: "Error",
        message: error.message || "Đăng ký Google thất bại!",
      });
    } finally {
      setShowLoading(false);
    }
  };

  const handleGoogleError = () => {
    setStatusMessage({
      type: "Error",
      message: "Đăng ký Google thất bại!",
    });
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="container-xl container-signup">
        {statusMessage && (
          <Message
            type={statusMessage.type}
            message={statusMessage.message}
            duration={3000}
            onClose={() => setStatusMessage(null)}
          />
        )}
        <div className={styles["signup-container"]}>
          <div className={styles["signup-container__img"]}>
            <img
              className={styles.signup__img}
              src={img1}
              alt="Hình cái bánh"
            />
            <img className={styles.signup__logo} src={img2} alt="Signup logo" />
          </div>
          <div className={styles.signup__right}>
            <h1 className={styles.signup__title}>ĐĂNG KÍ</h1>

            <Loading isLoading={showLoading} />
            {!showLoading && (
              <form onSubmit={handleSubmit}>
                <FormComponent
                  name="familyName"
                  label="FamilyName"
                  type="text"
                  placeholder="Họ"
                  value={formData.familyName}
                  onChange={handleChange}
                />
                <FormComponent
                  name="userName"
                  label="Name"
                  type="text"
                  placeholder="Tên"
                  value={formData.userName}
                  onChange={handleChange}
                />
                <FormComponent
                  name="userPhone"
                  label="Phone"
                  type="tel"
                  placeholder="Số điện thoại"
                  value={formData.userPhone}
                  onChange={handleChange}
                />
                <FormComponent
                  name="userEmail"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  value={formData.userEmail}
                  onChange={handleChange}
                />
                <FormComponent
                  name="userPassword"
                  label="Password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.userPassword}
                  onChange={handleChange}
                />
                <FormComponent
                  name="userConfirmPassword"
                  label="ConfirmPassword"
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  value={formData.userConfirmPassword}
                  onChange={handleChange}
                />
                <ButtonFormComponent type="submit" disabled={!isValid()}>
                  Đăng kí tài khoản
                </ButtonFormComponent>
              </form>
            )}

            {/* Google Signup Button */}
            {!showLoading && (
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{ flex: 1, height: "1px", background: "#ddd" }}
                  ></div>
                  <span style={{ color: "#666", fontSize: "14px" }}>hoặc</span>
                  <div
                    style={{ flex: 1, height: "1px", background: "#ddd" }}
                  ></div>
                </div>
                <div className={styles.google__login__wrapper}>
                  <div style={{ display: "none" }}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                    />
                  </div>
                  <ButtonFormComponent
                    className={styles.google__login__custom}
                    onClick={() => {
                      document.querySelector('[role="button"]')?.click();
                    }}
                  >
                    <svg className={styles.google__icon} viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Đăng ký với Google
                  </ButtonFormComponent>
                </div>
              </div>
            )}

            <div className={styles.case__login}>
              Bạn đã có tài khoản?
              <u>
                <Link to="/login" className={styles.btn__goto__login}>
                  Đăng nhập
                </Link>
              </u>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUpPage;
