# 🚀 Deployment Guide - Product Visibility Feature

## 📋 Pre-deployment Checklist

### Backend

- [ ] Đảm bảo MongoDB đang chạy
- [ ] Kiểm tra file `.env` có đủ các biến môi trường
- [ ] Backup database trước khi deploy

### Frontend

- [ ] Kiểm tra `REACT_APP_API_URL_BACKEND` trong `.env`
- [ ] Clear browser cache và localStorage

## 🔄 Deployment Steps

### 1. Backend Deployment

#### Bước 1: Cập nhật database schema

Database sẽ tự động thêm field `isHidden` cho documents mới. Đối với documents cũ, field này sẽ mặc định là `undefined` và được coi như `false`.

**Optional**: Nếu muốn cập nhật tất cả documents cũ, chạy MongoDB query:

```javascript
db.products.updateMany(
  { isHidden: { $exists: false } },
  { $set: { isHidden: false } }
);
```

#### Bước 2: Start backend server

```powershell
cd C:\Users\Lenovo\STUDY\Proj1_BE
npm start
```

**Kiểm tra console log:**

- ✅ Server running on port 3001
- ✅ MongoDB connected successfully

#### Bước 3: Test API endpoint

Sử dụng Postman hoặc curl:

```bash
# Toggle visibility
curl -X PATCH http://localhost:3001/api/product/toggle-visibility/<product_id> \
  -H "token: Bearer <your_token>"
```

**Expected response:**

```json
{
  "status": "OK",
  "message": "Product hidden successfully",
  "data": {
    "_id": "...",
    "isHidden": true,
    ...
  }
}
```

### 2. Frontend Deployment

#### Bước 1: Install dependencies (nếu có thay đổi)

```powershell
cd C:\Users\Lenovo\STUDY\FE-Project_AvocadoCake
npm install
```

#### Bước 2: Start development server

```powershell
npm start
```

#### Bước 3: Test trong browser

1. Mở http://localhost:3000/admin/products
2. Login với admin account
3. Kiểm tra cột "Hiển thị" trong table
4. Test toggle button
5. Switch sang grid view và test lại

## 🧪 Testing Scenarios

### Test Case 1: Toggle từ Visible → Hidden

1. Tìm sản phẩm đang visible (nút màu xanh)
2. Click vào nút toggle
3. Confirm trong dialog
4. **Expected**:
   - Nút chuyển sang màu đỏ
   - Text đổi thành "Ẩn"
   - Badge "Ẩn" xuất hiện trong grid view

### Test Case 2: Toggle từ Hidden → Visible

1. Tìm sản phẩm đang hidden (nút màu đỏ)
2. Click vào nút toggle
3. Confirm trong dialog
4. **Expected**:
   - Nút chuyển sang màu xanh
   - Text đổi thành "Hiển thị"
   - Badge "Ẩn" biến mất trong grid view

### Test Case 3: Cancel Toggle

1. Click vào nút toggle
2. Click "Cancel" trong dialog
3. **Expected**: Không có gì thay đổi

### Test Case 4: Language Switch

1. Toggle sang tiếng Anh
2. Kiểm tra tất cả text được dịch đúng
3. Test toggle button với tiếng Anh
4. Switch lại tiếng Việt

### Test Case 5: Sort by Visibility

1. Click vào header "Hiển thị"
2. **Expected**: Products được sort theo isHidden (hidden first hoặc visible first)

### Test Case 6: Multiple Products

1. Thử toggle nhiều products liên tiếp
2. Refresh page
3. **Expected**: Tất cả changes được persist

## 🐛 Troubleshooting

### Backend Issues

#### Issue: "Product not found"

**Cause**: Product ID không tồn tại
**Solution**: Kiểm tra product ID trong database

#### Issue: "Unauthorized"

**Cause**: Token không hợp lệ hoặc expired
**Solution**: Login lại để lấy token mới

#### Issue: Database connection error

**Cause**: MongoDB không chạy
**Solution**:

```powershell
# Start MongoDB
mongod
```

### Frontend Issues

#### Issue: Toggle button không hoạt động

**Cause**: API endpoint không đúng hoặc backend chưa chạy
**Solution**:

1. Check console log
2. Verify `REACT_APP_API_URL_BACKEND` in `.env`
3. Ensure backend is running

#### Issue: i18n không hoạt động

**Cause**: AdminLanguageProvider chưa wrap component
**Solution**: Kiểm tra component hierarchy

#### Issue: State không update sau toggle

**Cause**: Context không được kết nối đúng
**Solution**: Verify `useAdminProductStore()` hook

## 📊 Performance Considerations

### Database Indexes

Nếu có nhiều products, nên tạo index cho field `isHidden`:

```javascript
db.products.createIndex({ isHidden: 1 });
```

### Frontend Optimization

- Toggle chỉ update local state, không refetch toàn bộ products
- Use optimistic UI updates

## 🔒 Security Notes

### Backend

- ✅ API được bảo vệ bởi `authMiddleware`
- ✅ Chỉ admin có quyền toggle
- ⚠️ Không có rate limiting (cân nhắc thêm nếu cần)

### Frontend

- ✅ Token được lưu trong localStorage
- ✅ Confirmation dialog trước mỗi action
- ⚠️ Không có undo feature (cân nhắc thêm nếu cần)

## 🎯 Post-deployment Verification

### Backend Checklist

- [ ] API endpoint `/product/toggle-visibility/:id` hoạt động
- [ ] Database lưu `isHidden` đúng
- [ ] Error handling hoạt động
- [ ] Authentication middleware hoạt động

### Frontend Checklist

- [ ] Table view hiển thị cột visibility
- [ ] Grid view hiển thị badge và toggle button
- [ ] Toggle button hoạt động
- [ ] Confirmation dialog xuất hiện
- [ ] State cập nhật realtime
- [ ] i18n hoạt động (EN + VI)
- [ ] Sort by visibility hoạt động
- [ ] Không có console errors

## 📝 Rollback Plan

Nếu có issues nghiêm trọng:

### Backend Rollback

```powershell
cd C:\Users\Lenovo\STUDY\Proj1_BE
git revert HEAD
npm start
```

### Frontend Rollback

```powershell
cd C:\Users\Lenovo\STUDY\FE-Project_AvocadoCake
git revert HEAD
npm start
```

### Database Rollback

Restore từ backup:

```javascript
mongorestore --db <database_name> <backup_path>
```

## 📞 Support

Nếu gặp vấn đề:

1. Check console logs (browser + terminal)
2. Check network tab trong DevTools
3. Verify database state trong MongoDB Compass
4. Review error messages trong API response

## ✅ Success Criteria

Deployment thành công khi:

- ✅ Backend API responses đúng
- ✅ Frontend UI hiển thị và hoạt động tốt
- ✅ Database lưu trữ data đúng
- ✅ Không có errors trong console
- ✅ i18n hoạt động cho cả EN và VI
- ✅ Performance không bị ảnh hưởng

---

Last Updated: November 19, 2025
