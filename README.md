# 🍰 Avocado Cake – Website Bán Bánh Ngọt Thông Minh

Avocado Cake là nền tảng thương mại điện tử chuyên về bánh ngọt, kết hợp công nghệ AI nhằm mang đến trải nghiệm mua sắm cá nhân hóa và sáng tạo cho người dùng.
Website không chỉ bán bánh mà còn hỗ trợ khách hàng tự thiết kế bánh theo ý tưởng riêng, nhận gợi ý từ chatbot AI và cung cấp các phân tích, đề xuất chiến lược kinh doanh cho quản trị viên.

---

## 🌟 Các tính năng nổi bật

### 1. 💬 Chatbot AI

* Tư vấn các nghiệp vụ cơ bản (cách tạo tài khoản, cách mua hàng, thanh toán, hoàn hàng,...).
* Trả lời nhanh các câu hỏi về sản phẩm, giá cả và chương trình khuyến mãi.


### 2. 🎯 Recommendation System

* Gợi ý sản phẩm dựa trên lịch sử mua hàng và hành vi duyệt web.
* Đề xuất combo bánh hoặc sản phẩm kèm theo phù hợp với người dùng.

### 3. 🎨 Tự Thiết Kế Bánh

* Cho phép khách hàng chọn cốt bánh, màu sắc, topping và hình trang trí.
* Hiển thị bản xem trước trực quan trước khi đặt hàng.
* Tự động tính giá dựa trên nguyên liệu và tùy chọn đã chọn.
* Generate ảnh bánh theo mô tả của khách hàng

### 4. 📊 Gợi Ý Chiến Lược Kinh Doanh (Admin)

* Phân tích dữ liệu bán hàng và xu hướng mua sắm.
* Đề xuất chiến lược khuyến mãi, sản phẩm mới hoặc gói combo.
* Hiển thị báo cáo trực quan bằng biểu đồ.

### 5. 🛒 Chức Năng Mua Sắm Cơ Bản

* Xem sản phẩm theo danh mục.
* Thêm vào giỏ hàng, áp dụng mã giảm giá và thanh toán trực tuyến.
* Theo dõi đơn hàng và lịch sử mua sắm.

---

## ⚙️ Công nghệ sử dụng

* **Frontend**: React / Next.js
* **Backend**: Node.js (API)
* **AI**: Chatbot & Recommendation (tích hợp API)
* **CI**: GitHub Actions
* **CD (Production)**: Vercel (GitHub Integration)
* **CD (Local)**: PowerShell Script (Pull-based)

---

## 🔄 CI/CD Pipeline

### 🔹 Continuous Integration (CI)

* Được cấu hình bằng **GitHub Actions**.
* Tự động chạy khi push hoặc tạo pull request lên nhánh `main`.
* Bao gồm các bước:

  1. Cài đặt dependencies
  2. Chạy unit test
  3. Build project 

---

### 🔹 Continuous Deployment (CD) – Production

* Repository đã được **kết nối trực tiếp với Vercel**.
* Khi code được push lên nhánh `main` và CI hoàn tất, **Vercel sẽ tự động deploy** phiên bản mới nhất.
* Không cần thao tác deploy thủ công trong workflow.

---

## 🔄 Continuous Deployment (CD) – Môi trường Local

### 📌 Mục đích

Ngoài môi trường production, project hỗ trợ **CD cho môi trường local** theo mô hình **pull-based**.
Cách tiếp cận này phù hợp với máy cá nhân **không có IP tĩnh** và **không hoạt động 24/7**.

---

### 📁 File liên quan

```
auto-update.ps1
```

File này nằm tại **thư mục gốc của project**.

---

### ⚙️ Cách hoạt động

Khi chạy script `auto-update.ps1`, hệ thống sẽ:

1. Kiểm tra repository có commit mới trên nhánh `main`.
2. Nếu có thay đổi:

   * Pull code mới nhất từ GitHub.
   * Cài đặt lại dependencies.
   * Build project.
   * Chạy ứng dụng ở môi trường local.
3. Nếu không có thay đổi → không thực hiện hành động nào.

---

### ▶️ Cách sử dụng

#### ✅ Chạy thủ công

```powershell
cd <đường-dẫn-project>
.\auto-update.ps1
```

#### ✅ Tự động chạy khi mở máy (khuyên dùng)

* Sử dụng **Windows Task Scheduler**.
* Cấu hình chạy lệnh:

```text
powershell.exe -ExecutionPolicy Bypass -File "<đường-dẫn-project>\auto-update.ps1"
```

---

### ⚠️ Lưu ý

* Script chỉ áp dụng cho **môi trường local**.
* Không gọi `auto-update.ps1` bên trong chính file `auto-update.ps1`.
* CD production được triển khai riêng thông qua **Vercel**.

---

### 🧠 Ghi chú kiến trúc

> CI sử dụng GitHub Actions để đảm bảo chất lượng mã nguồn.
> CD production sử dụng cơ chế push-based thông qua Vercel, trong khi CD local sử dụng cơ chế pull-based thông qua script cục bộ.

---

## 📌 Ghi chú

Dự án được phát triển phục vụ mục đích học tập và nghiên cứu, tập trung vào việc áp dụng CI/CD, AI và các mô hình thương mại điện tử hiện đại trong thực tế.
