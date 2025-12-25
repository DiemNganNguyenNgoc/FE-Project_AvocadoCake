# Admin i18n Quick Reference 🚀

## Sử dụng nhanh

### 1. Import hook

```jsx
import { useAdminLanguage } from "../../../contexts/AdminLanguageContext";
```

### 2. Sử dụng trong component

```jsx
const { t, language, changeLanguage } = useAdminLanguage();

// Translate
<h1>{t("dashboard")}</h1>;

// Check current language
{
  language === "en" ? "English" : "Vietnamese";
}

// Change language programmatically
<button onClick={() => changeLanguage("en")}>EN</button>;
```

## Translation Keys Cheat Sheet

| Key                 | EN                     | VI                      |
| ------------------- | ---------------------- | ----------------------- |
| `dashboard`         | Dashboard              | Bảng điều khiển         |
| `products`          | Products               | Sản phẩm                |
| `orders`            | Orders                 | Đơn hàng                |
| `users`             | Users                  | Người dùng              |
| `settings`          | Settings               | Cài đặt                 |
| `logout`            | Log Out                | Đăng xuất               |
| `search`            | Search or type command | Tìm kiếm hoặc nhập lệnh |
| `totalRevenue`      | Total Revenue          | Tổng doanh thu          |
| `newOrdersThisWeek` | New Orders This Week   | Đơn hàng mới tuần này   |

## Thêm Translation Mới

**File:** `src/app/contexts/AdminLanguageContext.jsx`

```javascript
const translations = {
  en: {
    myNewKey: "My English Text",
  },
  vi: {
    myNewKey: "Văn bản Tiếng Việt",
  },
};
```

## Components Đã Tích Hợp

✅ HeaderAdmin - Header với Language Selector  
✅ AdminSidebar - Menu navigation  
✅ AdminDashboard - Dashboard page  
✅ AdminLayout - Provider wrapper

## Language Selector

Component tự động được thêm vào `HeaderAdmin`:

- Hiển thị cờ quốc gia (🇺🇸 🇻🇳)
- Lưu preference vào localStorage
- Click outside để đóng dropdown

## Testing Quick

```bash
# 1. Mở Admin Panel
# 2. Click Language Selector trên Header
# 3. Chọn EN hoặc VI
# 4. Kiểm tra tất cả text đã thay đổi
# 5. Reload page - ngôn ngữ vẫn giữ nguyên
```

---

📖 Full Documentation: `ADMIN_I18N_IMPLEMENTATION.md`
