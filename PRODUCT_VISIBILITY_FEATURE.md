# Tính năng Ẩn/Hiện Sản phẩm (Product Visibility Feature)

## 📋 Tổng quan

Tính năng cho phép Admin ẩn hoặc hiện sản phẩm với khách hàng. Khi sản phẩm được ẩn, khách hàng sẽ không thể thấy sản phẩm đó trên website, nhưng Admin vẫn có thể quản lý và xem được trong trang Admin.

## 🏗️ Kiến trúc

### Backend

```
src/
├── models/
│   └── ProductModel.js           # Thêm field isHidden: Boolean
├── services/
│   └── ProductService.js         # Thêm toggleProductVisibility()
├── controllers/
│   └── ProductController.js      # Thêm toggleProductVisibility()
└── routes/
    └── ProductRouter.js          # Thêm PATCH /toggle-visibility/:id
```

### Frontend

```
src/app/
├── context/
│   └── AdminLanguageContext.jsx  # Thêm i18n translations
└── pages/Admin/AdminProduct/
    ├── AdminProductContext.jsx   # Thêm action TOGGLE_PRODUCT_VISIBILITY
    ├── services/
    │   └── ProductService.js     # Thêm toggleProductVisibility()
    └── partials/
        ├── ProductTable.jsx      # Thêm cột Visibility + toggle button
        └── ProductCard.jsx       # Thêm badge + toggle button
```

## 🔧 Chi tiết Implementation

### 1. Backend Changes

#### ProductModel.js

```javascript
isHidden: { type: Boolean, default: false }, // Ẩn/hiện sản phẩm với client
```

#### ProductService.js

```javascript
const toggleProductVisibility = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(id);
      if (!product) {
        return resolve({ status: "ERR", message: "Product not found" });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { isHidden: !product.isHidden },
        { new: true }
      );

      resolve({
        status: "OK",
        message: `Product ${
          updatedProduct.isHidden ? "hidden" : "visible"
        } successfully`,
        data: updatedProduct,
      });
    } catch (e) {
      reject({ status: "ERR", message: e.message });
    }
  });
};
```

#### ProductController.js

```javascript
const toggleProductVisibility = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const response = await ProductService.toggleProductVisibility(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || "Something went wrong",
    });
  }
};
```

#### ProductRouter.js

```javascript
router.patch(
  "/toggle-visibility/:id",
  authMiddleware,
  productController.toggleProductVisibility
);
```

### 2. Frontend Changes

#### AdminLanguageContext.jsx

Thêm translations cho cả tiếng Anh và tiếng Việt:

```javascript
// English
productVisibility: "Visibility",
visible: "Visible",
hidden: "Hidden",
hideProduct: "Hide from customers",
showProduct: "Show to customers",
hideProductConfirm: "Are you sure you want to hide this product from customers?",
showProductConfirm: "Are you sure you want to show this product to customers?",

// Vietnamese
productVisibility: "Hiển thị",
visible: "Hiển thị",
hidden: "Ẩn",
hideProduct: "Ẩn khỏi khách hàng",
showProduct: "Hiển thị cho khách hàng",
hideProductConfirm: "Bạn có chắc chắn muốn ẩn sản phẩm này khỏi khách hàng?",
showProductConfirm: "Bạn có chắc chắn muốn hiển thị sản phẩm này cho khách hàng?",
```

#### AdminProductContext.jsx

```javascript
// Action Type
TOGGLE_PRODUCT_VISIBILITY: "TOGGLE_PRODUCT_VISIBILITY",

// Reducer
case ActionTypes.TOGGLE_PRODUCT_VISIBILITY:
  return {
    ...state,
    products: state.products.map((product) =>
      product._id === action.payload.id
        ? { ...product, isHidden: action.payload.isHidden }
        : product
    ),
  };

// Action Creator
toggleProductVisibility: (id, isHidden) =>
  dispatch({
    type: ActionTypes.TOGGLE_PRODUCT_VISIBILITY,
    payload: { id, isHidden },
  }),
```

#### ProductService.js (Frontend)

```javascript
static async toggleProductVisibility(id) {
  try {
    const response = await apiClient.patch(
      `/product/toggle-visibility/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to toggle product visibility"
    );
  }
}
```

#### ProductTable.jsx

Thêm:

- Import `EyeOff` icon và `useAdminLanguage` hook
- Handler function `handleToggleVisibility()`
- Cột "Hiển thị" với toggle button trong table header
- Toggle button trong mỗi row hiển thị trạng thái và cho phép toggle

#### ProductCard.jsx

Thêm:

- Import `EyeOff` icon và `useAdminLanguage` hook
- Handler function `handleToggleVisibility()`
- Badge hiển thị trạng thái "Ẩn" ở top-left của card
- Toggle button ở phần actions

## 🎨 UI/UX Features

### Table View (ProductTable)

- **Cột mới**: "Hiển thị" với khả năng sort
- **Toggle Button**:
  - 🟢 Xanh lá: "Hiển thị" (visible)
  - 🔴 Đỏ: "Ẩn" (hidden)
- **Confirmation**: Hiển thị confirm dialog trước khi toggle

### Grid View (ProductCard)

- **Badge**: Hiển thị badge "Ẩn" màu đỏ ở top-left khi sản phẩm bị ẩn
- **Toggle Button**: Nút toggle ở phần actions với màu tương ứng trạng thái
- **Confirmation**: Hiển thị confirm dialog trước khi toggle

## 🌐 Internationalization (i18n)

Tất cả text đều support cả tiếng Anh và tiếng Việt thông qua `AdminLanguageContext`.

## 🔐 Security

- API endpoint được bảo vệ bởi `authMiddleware`
- Chỉ Admin có quyền toggle visibility
- Validation productId bắt buộc

## 🧪 Testing Checklist

### Backend

- [ ] Field `isHidden` được lưu đúng vào database
- [ ] API endpoint `PATCH /product/toggle-visibility/:id` hoạt động
- [ ] Toggle từ `false` → `true` và `true` → `false`
- [ ] Error handling khi productId không tồn tại
- [ ] Authentication middleware hoạt động

### Frontend

- [ ] Toggle button hiển thị đúng trong Table view
- [ ] Toggle button hiển thị đúng trong Grid view
- [ ] Badge "Ẩn" hiển thị khi product.isHidden = true
- [ ] Màu sắc thay đổi đúng theo trạng thái
- [ ] Confirmation dialog hiển thị trước khi toggle
- [ ] State cập nhật realtime sau khi toggle
- [ ] i18n hoạt động cho cả EN và VI
- [ ] Sort theo cột Visibility hoạt động

## 📝 Sử dụng

### Từ Table View:

1. Vào trang Admin Product
2. Tìm sản phẩm cần ẩn/hiện
3. Click vào button ở cột "Hiển thị"
4. Confirm trong dialog
5. Trạng thái cập nhật ngay lập tức

### Từ Grid View:

1. Switch sang Grid view
2. Tìm product card cần ẩn/hiện
3. Click vào button toggle ở phần actions
4. Confirm trong dialog
5. Badge "Ẩn" sẽ hiển thị nếu product bị ẩn

## 🔄 API Endpoint

### Toggle Product Visibility

```
PATCH /api/product/toggle-visibility/:id
```

**Headers:**

```
token: Bearer <access_token>
```

**Response:**

```json
{
  "status": "OK",
  "message": "Product hidden successfully", // or "Product visible successfully"
  "data": {
    "_id": "...",
    "productName": "...",
    "isHidden": true
    // ... other product fields
  }
}
```

## 🚀 Flow hoạt động

```
User clicks toggle button
     ↓
Confirmation dialog
     ↓
Call ProductService.toggleProductVisibility(id)
     ↓
API: PATCH /product/toggle-visibility/:id
     ↓
Backend: Toggle isHidden field
     ↓
Response with updated product
     ↓
Update Context state via toggleProductVisibility action
     ↓
UI re-renders with new state
```

## ✅ Clean Code Principles

- ✨ **Single Responsibility**: Mỗi function chỉ làm một việc
- 🔄 **DRY**: Code không bị duplicate
- 📦 **Separation of Concerns**: Logic tách biệt giữa Service, Controller, Context
- 🎯 **Clear Naming**: Tên biến, function rõ ràng, dễ hiểu
- 🌐 **i18n Support**: Tất cả text đều có translation
- 🎨 **Consistent UI**: Design pattern nhất quán trong Table và Grid view

## 📌 Notes

- Sản phẩm bị ẩn sẽ KHÔNG hiển thị với khách hàng (client-side)
- Admin vẫn thấy tất cả sản phẩm kể cả đã ẩn
- Field `isHidden` default là `false` (visible)
- Toggle hoạt động theo kiểu flip: `isHidden = !isHidden`

---

Created: November 19, 2025
Author: GitHub Copilot
