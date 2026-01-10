// Script để test rating API
const axios = require("axios");

async function testRatingAPI() {
  try {
    // Thay đổi productId này thành ID của sản phẩm bạn đang test
    const productId = "PRODUCT_ID_CUA_BAN"; // <-- THAY ĐỔI CHỖ NÀY
    const backendUrl =
      process.env.REACT_APP_API_URL_BACKEND || "http://localhost:3001/api";

    const url = `${backendUrl}/rating/product/${productId}`;
    console.log("🔍 Testing URL:", url);

    const response = await axios.get(url);

    console.log("\n✅ API Response:");
    console.log("Status:", response.data.status);
    console.log("Message:", response.data.message);
    console.log("Number of ratings:", response.data.data?.length || 0);
    console.log("\nRatings data:");
    console.log(JSON.stringify(response.data.data, null, 2));

    // Kiểm tra từng rating
    if (response.data.data?.length > 0) {
      response.data.data.forEach((rating, index) => {
        console.log(`\n--- Rating ${index + 1} ---`);
        console.log("UserName:", rating.userName);
        console.log("Rating:", rating.rating);
        console.log("Comment:", rating.comment);
        console.log("IsVisible:", rating.isVisible);
        console.log("CreatedAt:", rating.createdAt);
      });
    } else {
      console.log("\n⚠️ No ratings found!");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

testRatingAPI();
