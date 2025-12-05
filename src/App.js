import "@glints/poppins";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-datepicker";
import "./app/assets/css/reset.css";
import "./app/assets/css/style.css";
import DefaultComponent from "./app/components/DefaultComponent/DefaultComponent";
import FooterComponent from "./app/components/FooterComponent/FooterComponent";
import { routes } from "./app/routes";
import { AuthProvider } from "./app/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { updateUser } from "./app/redux/slides/userSlide";
import * as UserService from "./app/api/services/UserService";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./app/components/LoadingComponent/Loading";

function App() {
  const dispatch = useDispatch();
  const [showLoading, setShowLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Poppins"],
      },
    });
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    // console.log("storageData", storageData);

    let decoded = {};
    if (storageData) {
      try {
        decoded = jwtDecode(storageData);
        console.log("decoded", decoded);
      } catch (error) {
        console.error("Token không hợp lệ", error);
        localStorage.removeItem("access_token");
        storageData = null;
      }
    }
    return { decoded, storageData };
  };

  useEffect(() => {
    const initAuth = async () => {
      setShowLoading(true);
      let { storageData, decoded } = handleDecoded();
      // let newAccessToken = storageData;
      // Nếu không có token hoặc token hết hạn, thử refresh
      if (!decoded || decoded.exp < Date.now() / 1000) {
        try {
          const data = await UserService.refreshToken();
          storageData = data?.access_token;
          localStorage.setItem("access_token", storageData);
          decoded = jwtDecode(storageData);
        } catch (error) {
          console.warn("Không thể refresh token, yêu cầu đăng nhập lại.");
          localStorage.removeItem("access_token");
          setShowLoading(false);
          return;
        }
      }

      if (decoded?.id) {
        await handleGetDetailsUser(decoded.id, storageData);
      }
      setShowLoading(false);
    };

    initAuth();
  }, []);

  // Tự động refresh token trước khi hết hạn
  useEffect(() => {
    const setupAutoRefresh = () => {
      const { decoded } = handleDecoded();

      if (!decoded || !decoded.exp) return;

      // Tính thời gian còn lại của token (tính bằng milliseconds)
      const timeUntilExpiry = decoded.exp * 1000 - Date.now();

      // Refresh token 1 phút trước khi hết hạn
      const refreshTime = Math.max(timeUntilExpiry - 60000, 0);

      console.log(
        `Token sẽ hết hạn sau ${Math.floor(
          timeUntilExpiry / 1000
        )} giây. Sẽ refresh sau ${Math.floor(refreshTime / 1000)} giây.`
      );

      const refreshTimer = setTimeout(async () => {
        try {
          console.log("Tự động refresh token...");
          const data = await UserService.refreshToken();
          if (data?.access_token) {
            localStorage.setItem("access_token", data.access_token);
            console.log("Token đã được refresh thành công");

            // Cập nhật user info với token mới
            const newDecoded = jwtDecode(data.access_token);
            if (newDecoded?.id) {
              await handleGetDetailsUser(newDecoded.id, data.access_token);
            }

            // Thiết lập lại timer cho lần refresh tiếp theo
            setupAutoRefresh();
          }
        } catch (error) {
          console.error("Lỗi khi tự động refresh token:", error);
          // Nếu refresh thất bại, có thể redirect về trang login
          localStorage.removeItem("access_token");
          window.location.href = "/sign-in";
        }
      }, refreshTime);

      // Cleanup timer khi component unmount
      return () => clearTimeout(refreshTimer);
    };

    // Chỉ thiết lập auto refresh nếu user đã đăng nhập
    if (user?.id) {
      const cleanup = setupAutoRefresh();
      return cleanup;
    }
  }, [user?.id]);

  //token hết hạn
  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      let { decoded, storageData } = handleDecoded();
      let newAccessToken = storageData; // Fix lỗi 'storageData' undefined

      if (!decoded || decoded.exp < Date.now() / 1000) {
        try {
          let data = await UserService.refreshToken(); // Fix lỗi 'data' undefined
          newAccessToken = data?.access_token;
          localStorage.setItem("access_token", newAccessToken);
          decoded = jwtDecode(newAccessToken);
        } catch (error) {
          console.error("Lỗi khi làm mới token", error);
          // Không reject ngay, để request có thể tiếp tục với token cũ
          // Nếu request thất bại, sẽ được xử lý trong response interceptor
        }
      }

      config.headers["token"] = `Bearer ${newAccessToken}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Thêm response interceptor để xử lý lỗi 401
  UserService.axiosJWT.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const data = await UserService.refreshToken();
          if (data?.access_token) {
            localStorage.setItem("access_token", data.access_token);
            originalRequest.headers["token"] = `Bearer ${data.access_token}`;
            return UserService.axiosJWT(originalRequest);
          }
        } catch (refreshError) {
          console.error("Không thể refresh token:", refreshError);
          // Redirect về trang login nếu refresh thất bại
          localStorage.removeItem("access_token");
          window.location.href = "/sign-in";
        }
      }

      return Promise.reject(error);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      console.log("🎖️ User details from API:", res?.data);
      console.log("🎖️ CurrentRank:", res?.data?.currentRank);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Lỗi lấy thông tin người dùng:", error);
    }
  };

  // useEffect(() => {
  //   fetchApi();
  // }, []);

  // console.log(
  //   "REACT_APP_API_URL_BACKEND: ",
  //   process.env.REACT_APP_API_URL_BACKEND
  // );

  // const fetchApi = async () => {
  //   const res = await axios.get(
  //     `${process.env.REACT_APP_API_URL_BACKEND}/user/get-all-user`
  //   );
  //   return res.data;
  // };

  // const query = useQuery({ queryKey: ["todos"], queryFn: fetchApi });
  // console.log("query: ", query);

  return (
    <div style={{ fontFamily: "poppins" }}>
      <Loading isLoading={showLoading} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {!showLoading && (
        <Router>
          <AuthProvider>
            <Routes>
              {routes.map((route) => {
                const Page = route.page;
                const isCheckAuth = !route.isPrivate || user.isAdmin;
                // console.log(`Route: ${route.path}, isCheckAuth: ${isCheckAuth}`);

                const Header = route.isShowHeader ? DefaultComponent : Fragment;
                const Footer = route.isShowFooter ? FooterComponent : Fragment;
                return (
                  <Route
                    key={route.path}
                    path={isCheckAuth ? route.path : undefined}
                    // path={route.path}
                    element={
                      <div>
                        <Header />
                        <Page />
                        <Footer />
                      </div>
                    }
                  />
                );
              })}
            </Routes>
          </AuthProvider>
        </Router>
      )}
      {/* </Loading> */}
    </div>
  );
}

export default App;
