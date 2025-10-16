# Modal Z-Index Fix - Header Overlay Issue

## Vấn đề

Khi mở modal (AddCategory, UpdateCategory), header vẫn hiển thị phía trên modal, gây ra hiện tượng "nổi lên cùng modal".

## Nguyên nhân

- **AdminHeader** có `position: sticky` và `z-index: 10`
- **Modal** ban đầu chỉ có `z-index: 70`
- Do header sticky nên nó vẫn nổi lên và đè lên modal

## Giải pháp

### 1. Giảm Z-Index của Header

**File:** `AdminHeader.jsx`

```jsx
// TRƯỚC
<header className="sticky top-0 z-10 ...">

// SAU
<header className="sticky top-0 z-[9] ...">
```

### 2. Giảm Z-Index của User Dropdown Menu

**File:** `AdminHeader.jsx`

```jsx
// TRƯỚC
<div className="... z-[55]">

// SAU
<div className="... z-[10]">
```

### 3. Tăng Z-Index của Modal lên cực cao

**Files Updated:**

- `UpdateCategory.jsx`
- `AddCategory.jsx`

```jsx
// TRƯỚC
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] ...">

// SAU
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] ...">
```

## Z-Index Hierarchy mới

```
┌─────────────────────────────────────┐
│  Modal/Overlay          z-[9999]    │ ← Cao nhất (modals, overlays)
├─────────────────────────────────────┤
│  Toasts/Notifications   z-[1000]    │ ← Toast messages
├─────────────────────────────────────┤
│  Dropdowns              z-[100]     │ ← Dropdown menus
├─────────────────────────────────────┤
│  User Menu Dropdown     z-[10]      │ ← Header user menu
├─────────────────────────────────────┤
│  Sticky Header          z-[9]       │ ← AdminHeader
├─────────────────────────────────────┤
│  Content                z-[1-5]     │ ← Normal content
├─────────────────────────────────────┤
│  Background             z-0         │ ← Base layer
└─────────────────────────────────────┘
```

## Files Modified

### 1. **AdminHeader.jsx**

```diff
- <header className="sticky top-0 z-10 ...">
+ <header className="sticky top-0 z-[9] ...">

- <div className="... z-[55]">
+ <div className="... z-[10]">
```

### 2. **UpdateCategory.jsx**

```diff
Loading state:
- <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] ...">
+ <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] ...">

Modal overlay:
- <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] ...">
+ <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] ...">
```

### 3. **AddCategory.jsx**

```diff
- <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] ...">
+ <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] ...">
```

## Kết quả

### ✅ Before Fix:

```
┌─────────────────────────────┐
│  Header (z-10)              │ ← Sticky, nổi lên
└─────────────────────────────┘
     ▼ (đè lên modal)
┌─────────────────────────────┐
│  Modal (z-70)               │ ← Bị đè
│  [Content không click được] │
└─────────────────────────────┘
```

### ✅ After Fix:

```
┌─────────────────────────────┐
│  Modal (z-9999)             │ ← Cao nhất
│  [Content click được]       │
│  [Header ẩn phía sau]       │
└─────────────────────────────┘
     ▼ (header bị che)
┌─────────────────────────────┐
│  Header (z-9)               │ ← Ẩn phía sau
└─────────────────────────────┘
```

## Testing Checklist

- [x] Mở modal AddCategory - Header không hiển thị phía trên
- [x] Mở modal UpdateCategory - Header không hiển thị phía trên
- [x] Click vào backdrop để đóng modal - Hoạt động bình thường
- [x] Click nút X để đóng modal - Hoạt động bình thường
- [x] User dropdown menu vẫn hoạt động khi không có modal
- [x] Header sticky vẫn hoạt động khi scroll (không có modal)

## Best Practices

### Z-Index Guidelines:

1. **Modals & Overlays:** `z-[9999]` hoặc `z-[10000]`
   - Critical UI elements cần hiển thị trên tất cả
2. **Toasts/Notifications:** `z-[1000]`
   - Thông báo tạm thời
3. **Dropdowns:** `z-[100]` đến `z-[500]`
   - Menus, selects, tooltips
4. **Sticky Headers:** `z-[9]` đến `z-[10]`
   - Navigation bars, headers
5. **Normal Content:** `z-[0]` đến `z-[5]`
   - Cards, sections, images

### Tại sao dùng z-[9999]?

- **z-[70]:** Quá thấp, có thể bị đè bởi các elements khác
- **z-[100]:** Vẫn có thể xung đột với dropdowns
- **z-[1000]:** An toàn nhưng có thể xung đột với toasts
- **z-[9999]:** ✅ Đảm bảo modal luôn ở trên cùng, không xung đột

## Áp dụng cho Modal khác

Nếu tạo modal mới, luôn dùng z-index cao:

```jsx
// Template cho Modal mới
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl">
    {/* Modal content */}
  </div>
</div>
```

## Notes

- **Không** giảm z-index của modal xuống dưới `z-[1000]`
- **Luôn** kiểm tra modal hoạt động với header sticky
- **Tránh** dùng inline z-index, ưu tiên Tailwind classes
- **Nhất quán** z-index hierarchy trong toàn bộ app

---

**Fixed Date:** October 16, 2025
**Issue:** Modal bị header đè lên
**Solution:** Tăng modal z-index từ 70 lên 9999
**Status:** ✅ Resolved
