import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-avocado-green-10 via-grey9 to-white flex items-center justify-center px-6 sm:px-9 lg:px-12">
      <div className="max-w-4xl w-full text-center">
        {/* Animated Avocado Illustration */}
        <div className="mb-12 relative">
          <div className="text-[10rem] sm:text-[14rem] inline-block animate-bounce">
            🥑
          </div>
        </div>

        {/* 404 Error Code - Avocado Theme */}
        <div className="mb-9">
          <h1 className="text-[8rem] sm:text-[12rem] font-black text-grey-700f bg-clip-text bg-gradient-to-r from-avocado-green-100 to-avocado-brown-100">
            404
          </h1>
        </div>

        {/* Error Message - Minimal & Elegant */}
        <div className="mb-12 space-y-6">
          <h2 className="text-5xl sm:text-6xl font-semibold text-avocado-brown-100">
            Trang không tồn tại
          </h2>
          <p className="text-3xl text-avocado-brown-50 font-light max-w-2xl mx-auto leading-relaxed">
            Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
            chuyển. Hãy quay về trang chủ để khám phá thêm nhiều món bánh ngon!
          </p>
        </div>

        {/* Suggestions Card - Clean Design */}
        {/* <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border-2 border-avocado-brown-30">
          <h3 className="text-3xl font-medium text-avocado-brown-100 mb-8">
            Gợi ý cho bạn
          </h3>
          <ul className="text-left space-y-5 text-avocado-brown-100 max-w-2xl mx-auto">
            <li className="flex items-start gap-5 text-2xl">
              <span className="flex-shrink-0 w-3 h-3 mt-3 rounded-full bg-avocado-green-100"></span>
              <span className="font-light">
                Quay về trang chủ để xem các sản phẩm mới nhất
              </span>
            </li>
            <li className="flex items-start gap-5 text-2xl">
              <span className="flex-shrink-0 w-3 h-3 mt-3 rounded-full bg-avocado-green-100"></span>
              <span className="font-light">
                Sử dụng thanh tìm kiếm để tìm món bánh yêu thích
              </span>
            </li>
            <li className="flex items-start gap-5 text-2xl">
              <span className="flex-shrink-0 w-3 h-3 mt-3 rounded-full bg-avocado-green-100"></span>
              <span className="font-light">
                Liên hệ với chúng tôi nếu cần hỗ trợ
              </span>
            </li>
          </ul>
        </div> */}

        {/* Action Buttons - Avocado Theme */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={handleGoHome}
            className="group relative w-full sm:w-auto px-12 py-6 bg-avocado-green-100 text-grey-700 font-medium text-2xl rounded-2xl shadow-lg hover:shadow-xl hover:bg-avocado-green-80 transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-3">
              <span>Về Trang Chủ</span>
            </span>
          </button>

          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto px-12 py-6 bg-white text-avocado-brown-100 font-medium text-2xl rounded-2xl shadow-md hover:shadow-lg border-2 border-avocado-brown-30 hover:border-avocado-green-100 hover:bg-avocado-green-10 transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center justify-center gap-3">
              <span>←</span>
              <span>Quay Lại</span>
            </span>
          </button>
        </div>

        {/* Decorative Pattern - Minimal */}
        <div className="mt-16 flex items-center justify-center gap-8 opacity-30">
          <div className="w-3 h-3 rounded-full bg-avocado-green-100 animate-pulse"></div>
          <div
            className="w-3 h-3 rounded-full bg-avocado-green-100 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-avocado-green-100 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-avocado-green-100 animate-pulse"
            style={{ animationDelay: "0.6s" }}
          ></div>
          <div
            className="w-3 h-3 rounded-full bg-avocado-green-100 animate-pulse"
            style={{ animationDelay: "0.8s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
