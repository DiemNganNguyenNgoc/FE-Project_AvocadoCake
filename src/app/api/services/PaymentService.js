// import axios from "axios";

// export const createPayment = async (paymentData) => {
//   try {
//     // const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
//     //   "base64"
//     // );

//     const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
//     const tokenResponse = await axios.post(
//       `${PAYPAL_API_URL}/v1/oauth2/token`,
//       "grant_type=client_credentials",
//       {
//         headers: {
//           Authorization: `Basic ${auth}`,
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     const accessToken = tokenResponse.data.access_token;

//     const response = await axios.post(
//       `${PAYPAL_API_URL}/v2/checkout/orders`,
//       {
//         intent: "CAPTURE",
//         purchase_units: [
//           {
//             amount: {
//               currency_code: "USD",
//               value: (paymentData.totalPrice / 23000).toFixed(2),
//             },
//           },
//         ],
//         application_context: {
//           return_url: "http://localhost:3000/payment-result?status=success",
//           cancel_url: "http://localhost:3000/payment-result?status=cancel",
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const paymentUrl = response.data.links.find(
//       (link) => link.rel === "approve"
//     ).href;

//     return {
//       status: "OK",
//       message: "SUCCESS",
//       data: { paymentUrl },
//     };
//   } catch (error) {
//     console.error("PayPal error:", error);
//     throw error;
//   }
// };

// export const createQrPayment = async (paymentData) => {
//   const response = await axios.post(
//     "http://localhost:3001/api/payment/create-qr-payment",
//     paymentData
//   );
//   return response.data;
// };
import axios from "axios";

// Xóa các biến môi trường vì không cần thiết ở frontend
// const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
const API_URL = process.env.REACT_APP_API_URL_BACKEND;

export const createPayment = async (paymentData) => {
  try {
    // Gọi API backend thay vì gọi trực tiếp PayPal API
    const response = await axios.post(
      `${API_URL}/payment/create-payment`,
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating PayPal payment:", error);
    throw error;
  }
};

export const createQrPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/create-qr-payment`,
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating QR payment:", error);
    throw error;
  }
};

// ============ SEPAY PAYMENT SERVICES ============

/**
 * Tạo thanh toán Sepay
 * @param {Object} sepayData - Dữ liệu thanh toán Sepay
 * @param {string} sepayData.paymentCode - Mã thanh toán
 * @param {string} sepayData.orderId - ID đơn hàng
 * @param {number} sepayData.totalPrice - Tổng tiền thanh toán
 * @param {string} sepayData.sepayPaymentMethod - Phương thức thanh toán Sepay ('BANK_TRANSFER' | 'CARD' | 'NAPAS_BANK_TRANSFER')
 * @param {Object} sepayData.customerInfo - Thông tin khách hàng (optional)
 * @returns {Promise} Response từ API
 */
export const createSepayPayment = async (sepayData) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/sepay/create`,
      sepayData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating Sepay payment:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết thanh toán Sepay
 * @param {string} paymentCode - Mã thanh toán
 * @returns {Promise} Chi tiết thanh toán
 */
export const getSepayPaymentDetail = async (paymentCode) => {
  try {
    const response = await axios.get(
      `${API_URL}/payment/sepay/detail/${paymentCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting Sepay payment detail:", error);
    throw error;
  }
};

/**
 * Hủy đơn hàng Sepay
 * @param {string} paymentCode - Mã thanh toán
 * @returns {Promise} Kết quả hủy đơn
 */
export const cancelSepayOrder = async (paymentCode) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment/sepay/cancel/${paymentCode}`
    );
    return response.data;
  } catch (error) {
    console.error("Error canceling Sepay order:", error);
    throw error;
  }
};
