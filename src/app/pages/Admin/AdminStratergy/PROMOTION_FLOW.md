# 🎯 Flow Thêm Khuyến Mãi từ AI Strategy

## 📋 Tổng Quan

Flow mới cho phép thêm khuyến mãi **trực tiếp trong AdminStratergy** thông qua modal, không cần chuyển trang.

---

## 🔄 Flow Chi Tiết

### 1️⃣ User chọn promotion từ AI

```
AdminStratergy
  ↓
User click "Thêm khuyến mãi này" trên PromotionCard
  ↓
handleAddPromotion() được gọi
```

### 2️⃣ Hiển thị Modal với data auto-fill

```javascript
// AdminStratergy.jsx
const handleAddPromotion = (promotion) => {
  const discountData = {
    eventName: promotion.eventName || promotion.promotion_name,
    eventType: promotion.eventType || promotion.event_info?.event_type,
    startDate: promotion.startDate || promotion.start_date,
    endDate: promotion.endDate || promotion.end_date,
    products: promotion.products || promotion.target_products,
    description: promotion.description,
  };

  setSelectedPromotion(discountData);
  setShowAddDiscountModal(true); // Open modal
};
```

### 3️⃣ Modal tự động điền thông tin

```javascript
// AddDiscountModal.jsx
useEffect(() => {
  if (promotionData && isOpen) {
    const aiProducts = promotionData.products || [];
    const productIds = aiProducts
      .map((p) => p.id || p.product_id)
      .filter(Boolean);

    setFormData({
      discountCode: generateDiscountCode(promotionData.eventName), // Auto-gen
      discountName: promotionData.eventName,
      discountValue: aiProducts[0]?.discountPercent,
      discountProduct: productIds, // Pre-select products
      discountStartDate: promotionData.startDate,
      discountEndDate: promotionData.endDate,
    });
  }
}, [promotionData, isOpen]);
```

### 4️⃣ User review & submit

```
AddDiscountModal
  ↓
User review thông tin (có thể chỉnh sửa)
  ↓
Click "Thêm khuyến mãi"
  ↓
Validation
  ↓
Call API createDiscount()
  ↓
Success → Show message → Close modal
```

---

## 🎨 UI/UX Features

### ✅ Auto-fill từ AI

- **Mã khuyến mãi**: Auto-generate từ event name + random string
- **Tên khuyến mãi**: Lấy từ `eventName`
- **Giá trị (%)**: Lấy từ product đầu tiên
- **Ngày bắt đầu/kết thúc**: Lấy từ AI recommendation
- **Sản phẩm**: Pre-select tất cả products được đề xuất

### 🎯 Banner thông tin AI

```jsx
{
  promotionData && (
    <div className="bg-avocado-green-10 border border-avocado-green-30">
      🤖 Đề xuất từ AI: {promotionData.description}
    </div>
  );
}
```

### ✨ Success/Error Messages

- **Success**: Hiển thị 1.5s trước khi close modal
- **Error**: Hiển thị error từ API response
- **Validation**: Real-time validation cho từng field

---

## 📁 Component Structure

```
AdminStratergy/
├── AdminStratergy.jsx          # Main component
│   ├── State: showAddDiscountModal
│   ├── State: selectedPromotion
│   └── Handler: handleAddPromotion()
│
└── partials/
    ├── PromotionCard.jsx       # Card với button "Thêm khuyến mãi"
    │   └── onClick={onAddPromotion}
    │
    └── AddDiscountModal.jsx    # Modal thêm nhanh
        ├── Props: isOpen, onClose, promotionData
        ├── Auto-fill form data
        ├── Validation
        └── Submit → API createDiscount()
```

---

## 🔌 API Integration

### Service sử dụng

```javascript
// partials/AddDiscountModal.jsx
import {
  getAllProducts, // Lấy danh sách products
  createDiscount, // Tạo discount mới
} from "../../AdminDiscount/services/DiscountService";
```

### API Call

```javascript
const handleSubmit = async (e) => {
  const formDataToSend = new FormData();
  formDataToSend.append("discountCode", formData.discountCode);
  formDataToSend.append("discountName", formData.discountName);
  formDataToSend.append("discountValue", formData.discountValue);
  formDataToSend.append("discountStartDate", formData.discountStartDate);
  formDataToSend.append("discountEndDate", formData.discountEndDate);

  formData.discountProduct.forEach((productId) => {
    formDataToSend.append("discountProduct[]", productId);
  });

  if (formData.discountImage) {
    formDataToSend.append("discountImage", formData.discountImage);
  }

  await createDiscount(formDataToSend);
};
```

---

## ✅ Validation Rules

| Field               | Rule                             |
| ------------------- | -------------------------------- |
| `discountCode`      | Required, không để trống         |
| `discountName`      | Required, không để trống         |
| `discountValue`     | Required, 1-100%                 |
| `discountProduct`   | Required, ít nhất 1 sản phẩm     |
| `discountStartDate` | Required                         |
| `discountEndDate`   | Required, sau startDate          |
| `discountImage`     | Optional, max 5MB, JPEG/PNG/WEBP |

---

## 🎯 User Journey

### Happy Path

1. ✅ User xem AI recommendations
2. ✅ Click "Thêm khuyến mãi này"
3. ✅ Modal hiển thị với data auto-fill
4. ✅ User review (có thể sửa)
5. ✅ Click "Thêm khuyến mãi"
6. ✅ Success message → Modal close
7. ✅ Discount đã được tạo

### Alternative Path

1. User xem AI recommendations
2. Click "Thêm khuyến mãi này"
3. Modal hiển thị
4. User chỉnh sửa thông tin (tên, %, sản phẩm...)
5. User upload ảnh khuyến mãi
6. Click "Thêm khuyến mãi"
7. Success → Modal close

### Error Path

1. User xem AI recommendations
2. Click "Thêm khuyến mãi này"
3. Modal hiển thị
4. User xóa hết thông tin / nhập sai
5. Click "Thêm khuyến mãi"
6. ❌ Validation error → Show error messages
7. User sửa lại
8. Submit lại

---

## 🔧 Customization

### Change Modal Width

```jsx
// AddDiscountModal.jsx
<div className="max-w-4xl w-full"> {/* Change to max-w-6xl */}
```

### Change Auto-gen Code Format

```javascript
const generateDiscountCode = (eventName) => {
  const prefix = eventName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .substring(0, 6); // Change length
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${random}`; // Change format
};
```

### Change Success Message Duration

```javascript
setTimeout(() => {
  // ...
  onClose();
}, 1500); // Change from 1500ms to 2000ms
```

---

## 🐛 Troubleshooting

### Issue: Modal không hiển thị

**Check:**

- `showAddDiscountModal` state có được set = true?
- `isOpen` prop có được pass vào modal?

### Issue: Form không tự động điền

**Check:**

- `promotionData` có data?
- `products` array có mapping đúng format?
- `useEffect` dependency array có đầy đủ?

### Issue: Submit lỗi

**Check:**

- API endpoint có đúng?
- FormData có đầy đủ fields?
- Token authentication?

---

## 📊 Performance

### Optimization Points

1. **Lazy Load Modal**: Chỉ render khi `isOpen = true` ✅
2. **Memoize Products**: Cache danh sách products
3. **Debounce Validation**: Giảm số lần validate
4. **Image Preview Cleanup**: Revoke ObjectURL khi unmount ✅

---

## 🎨 Design System Compliance

### Colors

- **Primary**: `avocado-green-100` (#b1e321)
- **Text**: `avocado-brown-100` (#3a060e)
- **Border**: `avocado-brown-30`
- **Background**: `white`, `grey9`

### Typography

- **Title**: 2xl, font-bold
- **Label**: base, font-semibold
- **Body**: base
- **Error**: sm, text-red-500

### Spacing

- **Modal padding**: p-6
- **Form gap**: space-y-6
- **Grid gap**: gap-4

### Border Radius

- **Modal**: rounded-lg (8px)
- **Inputs**: rounded-lg (8px)
- **Buttons**: rounded-lg (8px)

---

## 🚀 Future Enhancements

### Phase 2

- [ ] Multi-step wizard cho complex promotions
- [ ] Preview khuyến mãi trước khi tạo
- [ ] Duplicate promotion từ AI
- [ ] Bulk create nhiều promotions

### Phase 3

- [ ] AI suggest optimal discount value
- [ ] A/B test suggestions
- [ ] Schedule promotion
- [ ] Integration với email marketing

---

## 📝 Notes

- Modal sử dụng API trực tiếp, không qua Context
- Form data được validate trước khi submit
- Success message tự động close sau 1.5s
- Preview image được cleanup để tránh memory leak

---

**Created:** 2025-11-08  
**Last Updated:** 2025-11-08  
**Author:** AvocadoCake Team
