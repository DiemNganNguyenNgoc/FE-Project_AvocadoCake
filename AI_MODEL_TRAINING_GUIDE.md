# AI Model Training - Admin Guide

## 📍 Vị trí

Admin Dashboard → Settings → **AI Model**

## 🎯 Mục đích

Huấn luyện lại mô hình AI recommendation system để cải thiện độ chính xác gợi ý sản phẩm cho khách hàng dựa trên:

- Lịch sử đơn hàng mới
- Tương tác của người dùng
- Xu hướng mua sắm

## 🔧 API Endpoints

### Backend (RCM_System)

```
Base URL: http://localhost:8000 (local) hoặc https://rcm-system.onrender.com (production)

POST /model/update     - Train model (bất đồng bộ - recommended)
POST /model/train      - Train model (đồng bộ - blocking)
GET  /model/evaluate   - Đánh giá hiệu suất model
```

### Frontend Configuration

File: `.env`

```env
REACT_APP_RECSYS_API_URL=http://localhost:8000
```

## 📊 Metrics Hiển thị

1. **Precision** (Độ chính xác dự đoán)

   - Tỷ lệ sản phẩm được gợi ý đúng / tổng số sản phẩm được gợi ý
   - Cao = ít gợi ý sai

2. **Recall** (Tỷ lệ phát hiện)

   - Tỷ lệ sản phẩm quan tâm được gợi ý / tổng số sản phẩm quan tâm
   - Cao = không bỏ sót sản phẩm quan trọng

3. **F1 Score** (Hiệu suất tổng thể)
   - Trung bình điều hòa của Precision và Recall
   - Chỉ số đánh giá tổng thể model

## 🚀 Cách sử dụng

### 1. Kiểm tra hiện trạng

- Vào Settings → AI Model
- Xem các metrics hiện tại (Precision, Recall, F1)

### 2. Khi nào nên train lại?

✅ **NÊN train khi:**

- Có thêm 50-100+ đơn hàng mới
- Sau 2-4 tuần hoạt động
- F1 Score < 70%
- Thêm nhiều sản phẩm mới
- Thay đổi chiến lược kinh doanh

❌ **KHÔNG nên train khi:**

- Ít hơn 50 đơn hàng trong hệ thống
- Vừa train trong vòng 1 tuần qua
- Đang giờ cao điểm (9-11h, 14-17h)

### 3. Thực hiện training

1. Nhấn nút **"Bắt đầu huấn luyện model"**
2. Đợi thông báo thành công (vài phút)
3. Kiểm tra lại metrics sau khi hoàn tất
4. So sánh metrics mới với cũ

### 4. Đánh giá kết quả

- **F1 Score tăng** = Model cải thiện ✅
- **F1 Score giảm** = Có thể cần thêm dữ liệu hoặc điều chỉnh
- **F1 > 80%** = Rất tốt
- **F1 70-80%** = Tốt
- **F1 < 70%** = Cần cải thiện

## ⚠️ Lưu ý quan trọng

### Yêu cầu hệ thống

- Tối thiểu 50 đơn hàng trong database
- RCM_System backend đang chạy
- Kết nối MongoDB ổn định
- Kết nối Redis cache hoạt động

### Best Practices

1. **Backup trước khi train:**

   - Model cũ sẽ được ghi đè
   - Không thể rollback tự động

2. **Thời gian phù hợp:**

   - Nên train vào sáng sớm (6-8h) hoặc đêm khuya
   - Tránh giờ cao điểm mua sắm

3. **Giám sát sau training:**

   - Theo dõi conversion rate trong 1-2 ngày
   - Kiểm tra feedback từ khách hàng
   - Xem báo cáo sản phẩm được gợi ý

4. **Tần suất training:**
   - Không quá 1 lần/tuần
   - Lý tưởng: 1 lần/2-4 tuần
   - Tùy thuộc vào lượng đơn hàng mới

## 🐛 Troubleshooting

### Lỗi "Model not ready"

- Kiểm tra RCM_System backend có chạy không
- Verify `REACT_APP_RECSYS_API_URL` trong .env

### Training thất bại

- Kiểm tra logs trong RCM_System
- Đảm bảo có đủ dữ liệu trong MongoDB
- Kiểm tra Redis connection

### Metrics không cập nhật

- Đợi 5-10 giây sau khi training
- Refresh page
- Gọi lại GET /model/evaluate

## 📞 Support

- Check RCM_System logs: `docker logs rcm-system`
- API health: `GET /health`
- Model status: `GET /model/evaluate`

## 🔗 Related Files

- Frontend: `src/app/pages/Admin/AdminSetting/usecases/ModelTraining.jsx`
- Backend: `RCM_System/app/api/v1/model.py`
- Training logic: `RCM_System/app/services/hybrid.py`
