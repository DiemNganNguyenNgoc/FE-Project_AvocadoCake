import React, { useEffect, useState } from "react";
import ButtonFormComponent from "../../components/ButtonFormComponent/ButtonFormComponent";
import FormComponent from "../../components/FormComponent/FormComponent";
import "./SignUpPage.css";
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
        <div className="signup-container">
          <div className="signup-container__img">
            <img className="signup__img" src={img1} alt="Hình cái bánh" />
            <img className="signup__logo" src={img2} alt="Signup logo" />
          </div>
          <div className="signup__right">
            <h1 className="signup__title">ĐĂNG KÍ</h1>

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
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                  width="300"
                />
              </div>
            )}

            <div className="case__login">
              Bạn đã có tài khoản?
              <u>
                <Link to="/login" className="btn__goto__login">
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
