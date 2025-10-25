# 🤖 AI Recipe Generator - Integration Guide

## Tổng quan

Hệ thống **AI Recipe Generator** kết nối giữa backend **RCM_RECIPE_2** (FastAPI + Python) và frontend **FE-Project_AvocadoCake** (React), cho phép tạo công thức bánh thông minh dựa trên AI & Machine Learning.

## 🎯 Tính năng chính

### 1. 🥄 Tạo Công Thức Từ Nguyên Liệu

- Nhập danh sách nguyên liệu có sẵn
- AI tạo công thức hoàn chỉnh với T5 Model (Vietnamese NLP)
- Templates nhanh cho các loại bánh phổ biến

### 2. 🔥 Tạo Công Thức Từ Xu Hướng

- Phân tích xu hướng mạng xã hội (TikTok, Instagram)
- Theo dõi trending flavors real-time
- Tạo công thức theo phân khúc khách hàng (Gen Z, Millennials, Gym, Kids)
- Phù hợp với dịp đặc biệt (sinh nhật, Tết, Halloween...)

### 3. 📊 Phân Tích & Dự Báo

- **Dự báo xu hướng**: Predict trends 7-90 ngày
- **Market insights**: Phân tích thị trường theo segment
- **Viral potential score**: Đánh giá tiềm năng viral của công thức
- **Success factors**: Xác định yếu tố thành công

### 4. 📚 Quản Lý Lịch Sử

- Lưu trữ tự động các công thức đã tạo
- Filter theo loại (Nguyên liệu, Xu hướng, Smart Recipe)
- Xem lại và quản lý công thức

## 🚀 Cài đặt & Chạy

### Backend (RCM_RECIPE_2)

```bash
cd RCM_RECIPE_2

# Cài đặt dependencies
pip install -r requirements.txt

# Cấu hình .env
# Đảm bảo có GEMINI_API_KEY, DATABASE_URL, REDIS_URL

# Chạy server
python run_server.py
# hoặc
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server sẽ chạy tại: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

### Frontend (FE-Project_AvocadoCake)

```bash
cd FE-Project_AvocadoCake

# Cài đặt dependencies
npm install

# Cấu hình .env
# Thêm: REACT_APP_RECIPE_API_URL=http://localhost:8000/api/v1

# Chạy frontend
npm start
```

Frontend sẽ chạy tại: **http://localhost:3000**

## 📁 Cấu trúc Code

```
FE-Project_AvocadoCake/
└── src/app/pages/Admin/AdminRecipe/
    ├── AdminRecipe.jsx              # Main component với tabs
    ├── AdminRecipe.css              # Styles chính
    ├── adminRecipeStore.jsx         # Zustand state management
    │
    ├── services/
    │   └── RecipeService.js         # API service layer
    │
    ├── usecases/
    │   ├── GenerateFromIngredient.jsx    # Tạo từ nguyên liệu
    │   ├── GenerateFromIngredient.css
    │   ├── GenerateFromTrend.jsx         # Tạo từ xu hướng
    │   ├── GenerateFromTrend.css
    │   ├── RecipeAnalytics.jsx           # Analytics & forecasting
    │   ├── RecipeAnalytics.css
    │   ├── RecipeHistory.jsx             # Lịch sử công thức
    │   └── RecipeHistory.css
    │
    └── components/
        ├── RecipeDisplay.jsx             # Hiển thị công thức
        └── RecipeDisplay.css
```

## 🔌 API Endpoints

### Recipes

- `POST /api/v1/recipes/generate-from-ingredients` - Tạo từ nguyên liệu
- `POST /api/v1/recipes/generate-from-trend` - Tạo từ xu hướng

### Trends

- `GET /api/v1/trends/current` - Xu hướng hiện tại

### Analytics

- `POST /api/v1/analytics/predict-trends` - Dự đoán xu hướng
- `POST /api/v1/analytics/forecast-and-generate` - Dự báo & tạo công thức
- `POST /api/v1/analytics/generate-smart-recipe` - Tạo công thức thông minh
- `GET /api/v1/analytics/market-insights/{segment}` - Phân tích thị trường
- `GET /api/v1/analytics/trending-now` - Trending real-time
- `GET /api/v1/analytics/segment-recommendations/{segment}` - Gợi ý segment

## 💡 Hướng dẫn sử dụng

### 1. Tạo công thức từ nguyên liệu

1. Vào tab **"Tạo từ Nguyên liệu"**
2. Chọn template nhanh hoặc nhập nguyên liệu tự do
3. Chọn ngôn ngữ (Tiếng Việt/English)
4. Bật/tắt T5 Model
5. Click **"Tạo Công Thức"**

### 2. Tạo công thức từ xu hướng

1. Vào tab **"Tạo từ Xu hướng"**
2. Xem xu hướng hot hiện tại
3. Chọn trending keyword hoặc nhập tự do
4. Chọn phân khúc khách hàng
5. (Tùy chọn) Chọn dịp đặc biệt
6. Click **"Tạo Công Thức"**

### 3. Phân tích & Dự báo

**Dự báo xu hướng:**

1. Chọn segment khách hàng
2. Đặt số ngày dự báo (7-90)
3. Click **"Dự báo & Tạo Công Thức"**
4. Xem các công thức đề xuất cho sự kiện sắp tới

**Phân tích thị trường:**

1. Chọn segment
2. Click **"Phân tích Thị trường"**
3. Xem insights, opportunity score, strategies

**Gợi ý Segment:**

1. Chọn segment
2. Click **"Xem Gợi ý"**
3. Xem products, marketing tips cho segment

### 4. Quản lý lịch sử

1. Vào tab **"Lịch sử"**
2. Filter theo loại công thức
3. Xem chi tiết hoặc xóa công thức
4. Export/Print công thức

## 🎨 Design System

### Colors

- **Primary**: `#667eea` → `#764ba2` (Gradient)
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`
- **Background**: `#f5f7fa` → `#c3cfe2`

### Typography

- **Font**: Inter, -apple-system, BlinkMacSystemFont
- **Heading**: 700 weight
- **Body**: 400-600 weight

### Components Style

- **Minimal & Clean**: Flat design với subtle shadows
- **Rounded corners**: 8-16px border-radius
- **Smooth transitions**: 0.3s ease
- **Gradient accents**: Linear gradients cho CTA buttons

## ⚠️ Error Handling

Hệ thống có comprehensive error handling:

1. **Connection errors**: Thông báo khi không kết nối được backend
2. **Validation errors**: Kiểm tra input trước khi gửi API
3. **API errors**: Hiển thị lỗi từ backend với message rõ ràng
4. **Loading states**: Loading spinners khi đang xử lý
5. **Toast notifications**: Thông báo success/error/info

## 🔧 Troubleshooting

### Backend không kết nối được

1. Kiểm tra backend server đang chạy: `http://localhost:8000/health`
2. Xác nhận CORS settings trong `app/main.py`
3. Check `.env` có đủ API keys

### T5 Model không hoạt động

1. Kiểm tra T5 model đã được load: xem logs backend
2. Restart backend server
3. Fallback: Tắt T5 mode, dùng pure Gemini

### Lỗi "Module not found"

```bash
# Frontend
npm install

# Backend
pip install -r requirements.txt
```

## 📊 Performance

- **API Response**: ~3-10s (phụ thuộc vào Gemini API)
- **T5 Model**: ~2-5s processing time
- **Local Storage**: Lưu max 20 recipes gần nhất
- **Forecast**: ~10-15s cho 30 days forecast

## 🔐 Security

- API keys được lưu trong `.env`, không commit
- CORS configured cho localhost development
- Input validation trên cả frontend & backend
- Rate limiting (nếu có) trên backend

## 📈 Future Enhancements

- [ ] Export công thức to PDF
- [ ] Share công thức qua social media
- [ ] Recipe rating & feedback system
- [ ] Multi-language support mở rộng
- [ ] Batch recipe generation
- [ ] Custom ML model training interface
- [ ] Real-time collaboration
- [ ] Mobile responsive improvements

## 🤝 Contributing

Để contribute:

1. Follow coding standards hiện tại
2. Maintain minimal & professional design
3. Add comprehensive error handling
4. Document new features
5. Test thoroughly before commit

## 📝 Notes

- Code được viết với **ES6+ syntax**
- Sử dụng **Zustand** cho state management (lightweight alternative to Redux)
- **Toast notifications** với react-toastify
- **CSS Modules** không được dùng, dùng global CSS với BEM naming
- Responsive design cho mobile/tablet

## 📞 Support

Nếu có vấn đề:

1. Check console logs (F12)
2. Check backend logs
3. Xem API docs: http://localhost:8000/docs
4. Review integration guide này

---

**Built with ❤️ using React + FastAPI + AI/ML**
