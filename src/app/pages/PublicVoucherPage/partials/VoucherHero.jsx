import React from "react";
import { Ticket } from "lucide-react";

const VoucherHero = () => {
  return (
    <div className="border-b-4 border-[#b1e321] py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-[#b1e321]/10 rounded-full mb-6">
            <Ticket className="w-10 h-10 text-[#b1e321]" />
          </div> */}
          <h1 className="text-[40px] font-bold mb-4 text-[#212529] dark:text-white">
            KHO VOUCHER SIÊU HẤP DẪN
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Săn ngay các mã giảm giá hấp dẫn cho đơn hàng của bạn!
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoucherHero;
