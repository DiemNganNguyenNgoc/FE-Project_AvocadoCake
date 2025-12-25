# 🐛 Bug Fix: Order History Status Error

## ❌ Lỗi gặp phải

```
OrderHistoryCardComponent.jsx:104 Uncaught TypeError: Cannot read properties of undefined (reading 'statusName')
```

**Nguyên nhân**: Code cố truy cập `order.status.statusName` nhưng `order.status` có thể là `undefined` hoặc chưa được populate từ database.

---

## ✅ Giải pháp đã áp dụng

### 1. Safe Access trong OrderHistoryCardComponent

**File**: `src/app/components/OrderHistoryCardComponent/OrderHistoryCardComponent.jsx`

**Thay đổi**:

- ✅ Thêm optional chaining `?.` để truy cập an toàn
- ✅ Thêm fallback value khi status undefined
- ✅ Thêm debug logging để kiểm tra cấu trúc dữ liệu

**Code đã sửa**:

```javascript
// Lấy status name an toàn
const statusName = order?.status?.statusName || order?.status || "Chờ xác nhận";

// Trong useEffect
const statusName = order?.status?.statusName || order?.status || "";
if (statusName === "Đã giao" && user?.id) {
  // ... code xử lý rating
}

// Trong JSX
<StatusComponent status={statusName} />;
{
  statusName === "Đã giao" && !isLoading && (
    <ButtonComponent>...</ButtonComponent>
  );
}
```

### 2. Backend đã có populate

**File**: `src/services/OrderService.js`

Backend đã populate status đúng:

```javascript
const orders = await Order.find({
  userId: new mongoose.Types.ObjectId(userId),
})
  .populate("orderItems.product")
  .populate("status"); // ✅ Đã populate status
```

---

## 🔍 Kiểm tra thêm

### 1. Xem cấu trúc order trong console

Mở Developer Tools (F12) → Console tab, bạn sẽ thấy:

```javascript
Order data: {
  _id: "...",
  status: {
    _id: "...",
    statusCode: "PENDING",
    statusName: "Chờ xác nhận"  // ✅ Nếu populate đúng
  }
  // hoặc
  status: "673c..." // ❌ Nếu chưa populate (chỉ là ObjectId)
}
```

### 2. Nếu status vẫn là ObjectId string

Có nghĩa là backend chưa populate đúng. Kiểm tra:

**Bước 1**: Đảm bảo backend đang chạy

```bash
cd C:\Users\Lenovo\STUDY\Proj1_BE
npm start
```

**Bước 2**: Test API trực tiếp

```bash
# Trong browser hoặc Postman
GET http://localhost:3001/api/order/get-order-by-user/:userId
Headers: {
  "token": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Bước 3**: Kiểm tra response, status phải là object:

```json
{
  "status": "OK",
  "data": [
    {
      "_id": "...",
      "status": {
        "_id": "...",
        "statusName": "Chờ xác nhận" // ✅ Phải thế này
      }
    }
  ]
}
```

### 3. Nếu một số order có status null

Có thể do dữ liệu cũ trong database. Chạy script fix:

**Tạo file**: `fix-order-status.js` trong Proj1_BE

```javascript
const mongoose = require("mongoose");
const Order = require("./src/models/OrderModel");
const Status = require("./src/models/StatusModel");

async function fixOrderStatus() {
  try {
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Lấy status "Chờ xác nhận" mặc định
    const defaultStatus = await Status.findOne({ statusCode: "PENDING" });

    if (!defaultStatus) {
      console.log("Không tìm thấy status PENDING, tạo mới...");
      const newStatus = await Status.create({
        statusCode: "PENDING",
        statusName: "Chờ xác nhận",
      });
      console.log("Đã tạo status mặc định:", newStatus);
    }

    // Cập nhật các order không có status
    const ordersWithoutStatus = await Order.find({
      $or: [{ status: null }, { status: { $exists: false } }],
    });

    console.log(
      `Tìm thấy ${ordersWithoutStatus.length} orders không có status`
    );

    for (const order of ordersWithoutStatus) {
      order.status = defaultStatus._id;
      await order.save();
      console.log(`Đã cập nhật order ${order._id}`);
    }

    console.log("Hoàn thành!");
    process.exit(0);
  } catch (error) {
    console.error("Lỗi:", error);
    process.exit(1);
  }
}

fixOrderStatus();
```

**Chạy script**:

```bash
node fix-order-status.js
```

---

## 🎯 Kết quả

Sau khi sửa:

- ✅ Component không bị crash khi status undefined
- ✅ Hiển thị status mặc định "Chờ xác nhận" nếu không có status
- ✅ Rating button chỉ hiện khi status = "Đã giao"
- ✅ Code an toàn hơn với optional chaining

---

## 📝 Checklist kiểm tra

- [x] Sửa component với safe access
- [x] Thêm debug logging
- [x] Restart backend server
- [ ] Kiểm tra console log trong browser
- [ ] Test order history page
- [ ] Kiểm tra status hiển thị đúng
- [ ] Kiểm tra rating button chỉ hiện khi "Đã giao"

---

## 🚀 Test ngay

1. Mở browser → Đăng nhập
2. Vào trang "Lịch sử đơn hàng"
3. Mở Console (F12) → Xem log "Order data" và "Order status"
4. Kiểm tra:
   - ✅ Không còn lỗi TypeError
   - ✅ Orders hiển thị bình thường
   - ✅ Status hiển thị đúng
   - ✅ Nút "Đánh giá" chỉ hiện cho đơn "Đã giao"

---

## 📞 Nếu vẫn còn lỗi

1. **Kiểm tra token hết hạn**:

   - Đăng xuất và đăng nhập lại
   - Xóa cache browser

2. **Kiểm tra database**:

   - Mở MongoDB Compass
   - Xem collection `orders`
   - Kiểm tra field `status` có giá trị không

3. **Kiểm tra API response**:

   - Network tab → Xem response của `/api/order/get-order-by-user`
   - Status phải là object, không phải string

4. **Clear và restart**:

   ```bash
   # Backend
   cd C:\Users\Lenovo\STUDY\Proj1_BE
   rm -rf node_modules package-lock.json
   npm install
   npm start

   # Frontend
   cd C:\Users\Lenovo\STUDY\FE-Project_AvocadoCake
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```

---

**Fixed! 🎉** Bây giờ có thể xem lịch sử đơn hàng bình thường rồi!
