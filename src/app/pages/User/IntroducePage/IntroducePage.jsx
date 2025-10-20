import React from "react";
import img1 from "../../../assets/img/hero_2.jpg";
import story from "../../../assets/img/story.jpg";
import ChatbotComponent from "../../../components/ChatbotComponent/ChatbotComponent";

const IntroducePage = () => {
  return (
    <div className="w-full py-10">
      <div className="w-full mx-auto px-4 py-10">
        {/* Chatbot */}
        <ChatbotComponent />

        <div className="text-center mb-12">
          <h1 className="introduce__title">GIỚI THIỆU</h1>
          <h3 className="text-xl mt-4 text-gray-700">
            Chào mừng bạn đến với Avocado Bakery
          </h3>
        </div>

        {/* Block 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          {/* Left image */}
          <div className="relative flex justify-center">
            <img
              src={img1}
              alt="Ảnh cái bánh"
              className="rounded-xl shadow-lg h-[408px] w-[612px] object-cover"
            />
            <div className="absolute top-4 left-4 w-full h-full border-4 border-green-400 rounded-xl -z-10"></div>
          </div>

          {/* Right text */}
          <div>
            <h4 className="text-2xl font-semibold text-green-700 mb-4">
              Câu chuyện thương hiệu
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Là một hệ thống đội ngũ nhân viên và lãnh đạo chuyên nghiệp, gồm
              CBCNV và những người thợ đã có kinh nghiệm lâu năm trong các công
              ty đầu ngành. Mô hình vận hành hoạt động công ty được bố trí theo
              chiều ngang, làm gia tăng sự thuận tiện trong việc vận hành cỗ máy
              kinh doanh và gia tăng sự phối hợp thống nhất giữa các bộ phận
              trong công ty.
            </p>
          </div>
        </div>

        {/* Block 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Right text */}
          <div>
            <h4 className="text-2xl font-semibold text-green-700 mb-4">
              Sứ mệnh - tầm nhìn
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Avocado tự hào là một thương hiệu bánh ngọt Việt Nam chất lượng
              cao, được xây dựng từ chính tình yêu và tâm huyết dành trọn cho
              khách hàng. Với sứ mệnh mang đến những chiếc bánh thơm ngon, tươi
              mới, và đầy sáng tạo, Avocado không chỉ là nơi cung cấp bánh mà
              còn là cầu nối gắn kết những khoảnh khắc hạnh phúc của mọi người.
              <br />
              <br />
              Từ nguyên liệu được chọn lọc kỹ lưỡng, quy trình sản xuất nghiêm
              ngặt đến việc thiết kế từng chiếc bánh theo phong cách tinh tế,
              chúng tôi luôn nỗ lực để mang lại trải nghiệm tuyệt vời nhất cho
              khách hàng. Bất kể là bữa tiệc sinh nhật, lễ cưới hay một buổi họp
              mặt ấm cúng, Avocado luôn đồng hành để tạo nên những ký ức đáng
              nhớ và ý nghĩa nhất.
              <br />
              <br />
              Chúng tôi trân trọng sự tin yêu của khách hàng và cam kết không
              ngừng sáng tạo để mang đến những sản phẩm vượt trên cả mong đợi.
              Với Avocado, mỗi chiếc bánh không chỉ là món ăn, mà còn là thông
              điệp của tình yêu, sự tận tâm và chất lượng.
            </p>
          </div>

          {/* Left image */}
          <div className="relative flex justify-center order-first md:order-last">
            <img
              src={story}
              alt="Ảnh cái bánh"
              className="rounded-xl shadow-lg max-w-full h-auto"
            />
            <div className="absolute top-4 left-4 w-full h-full border-4 border-green-400 rounded-xl -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroducePage;
