# 🚀 Quick Start Guide - AI Recipe Generator

## ⚡ Chạy nhanh trong 3 bước

### 1. Start Backend (RCM_RECIPE_2)

```bash
cd RCM_RECIPE_2
python run_server.py
```

Kiểm tra: http://localhost:8000/health

### 2. Start Frontend (FE-Project_AvocadoCake)

```bash
cd FE-Project_AvocadoCake
npm start
```

Truy cập: http://localhost:3000

### 3. Navigate to AdminRecipe

Trong app, điều hướng đến trang Admin Recipe hoặc truy cập trực tiếp route của AdminRecipe component.

## 📋 Checklist trước khi chạy

### Backend

- [x] Python 3.8+ đã cài
- [x] Dependencies đã cài: `pip install -r requirements.txt`
- [x] File `.env` có GEMINI_API_KEY
- [x] Server chạy ở port 8000

### Frontend

- [x] Node.js đã cài
- [x] Dependencies đã cài: `npm install`
- [x] File `.env` có REACT_APP_RECIPE_API_URL=http://localhost:8000/api/v1
- [x] React app chạy ở port 3000

## 🎯 Các tính năng chính

### Tab 1: Tạo từ Nguyên liệu 🥄

Input: `bột mì, đường, trứng, bơ, chocolate`
→ Output: Công thức bánh chocolate hoàn chỉnh

### Tab 2: Tạo từ Xu hướng 🔥

Input: `Matcha + Gen Z segment`
→ Output: Công thức matcha cake trendy cho Gen Z

### Tab 3: Phân tích & Dự báo 📊

- Dự báo xu hướng 30 ngày
- Phân tích thị trường
- Gợi ý theo segment

### Tab 4: Lịch sử 📚

Xem lại tất cả công thức đã tạo

## ⚠️ Lỗi thường gặp

### "Không thể kết nối backend"

**Fix**: Đảm bảo backend đang chạy tại http://localhost:8000

### "GEMINI_API_KEY not found"

**Fix**: Thêm GEMINI_API_KEY vào file `.env` của backend

### "Module not found"

**Fix**: Chạy `npm install` (frontend) hoặc `pip install -r requirements.txt` (backend)

## 🎨 Demo Flow

1. **Mở AdminRecipe page**
2. **Chọn tab "Tạo từ Xu hướng"**
3. **Chọn một trending flavor** (vd: Matcha)
4. **Chọn segment**: Gen Z
5. **Click "Tạo Công Thức"**
6. **Xem kết quả** → Công thức chi tiết với ingredients, instructions, tips
7. **Công thức tự động lưu vào "Lịch sử"**

## 📞 Need Help?

1. Check console logs (F12)
2. Xem backend logs
3. API Docs: http://localhost:8000/docs
4. README_INTEGRATION.md (chi tiết đầy đủ)

---

**Ready to create amazing recipes with AI! 🎂✨**
