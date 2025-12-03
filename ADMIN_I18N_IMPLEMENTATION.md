# Admin Panel Internationalization (i18n) Implementation

## 📋 Overview

Hệ thống đa ngôn ngữ cho Admin Panel hỗ trợ **Tiếng Anh** và **Tiếng Việt**. Chỉ áp dụng cho phần Admin, không ảnh hưởng đến phần Client.

## 🏗️ Architecture

### 1. **AdminLanguageContext** (`src/app/contexts/AdminLanguageContext.jsx`)

Context Provider quản lý ngôn ngữ cho toàn bộ Admin Panel:

```jsx
import { useAdminLanguage } from "../../../contexts/AdminLanguageContext";

const { t, language, changeLanguage } = useAdminLanguage();
```

**API:**

- `t(key)`: Translate function - lấy text theo key
- `language`: Ngôn ngữ hiện tại ('en' hoặc 'vi')
- `changeLanguage(lang)`: Thay đổi ngôn ngữ

**Features:**

- ✅ localStorage persistence - lưu ngôn ngữ đã chọn
- ✅ Default language: Vietnamese ('vi')
- ✅ Automatic state management
- ✅ Translation fallback - hiển thị key nếu không tìm thấy translation

### 2. **LanguageSelector Component** (`src/app/pages/Admin/AdminDashboard/partials/LanguageSelector.jsx`)

Dropdown selector với cờ quốc gia:

- 🇺🇸 English (EN)
- 🇻🇳 Tiếng Việt (VI)

**Features:**

- ✅ Click outside to close
- ✅ Visual feedback cho ngôn ngữ đang chọn (checkmark)
- ✅ Hover effects
- ✅ Flag icons

## 📦 Implementation Guide

### Step 1: Import Provider

Provider đã được tích hợp vào `AdminLayout.jsx`:

```jsx
import { AdminLanguageProvider } from "../../contexts/AdminLanguageContext";

const AdminLayout = ({ children }) => {
  return <AdminLanguageProvider>{/* Admin content */}</AdminLanguageProvider>;
};
```

### Step 2: Use in Components

```jsx
import { useAdminLanguage } from "../../../contexts/AdminLanguageContext";

const MyComponent = () => {
  const { t } = useAdminLanguage();

  return (
    <div>
      <h1>{t("dashboard")}</h1>
      <p>{t("dashboardSubtitle")}</p>
    </div>
  );
};
```

### Step 3: Add New Translations

Edit `src/app/contexts/AdminLanguageContext.jsx`:

```javascript
const translations = {
  en: {
    myNewKey: "My New Text",
    // ... other keys
  },
  vi: {
    myNewKey: "Văn bản mới của tôi",
    // ... other keys
  },
};
```

## 🔑 Available Translation Keys

### Header

- `search` - Search placeholder
- `accountSettings` - Account Settings
- `logout` - Log Out
- `selectLanguage` - Select Language
- `english` - English
- `vietnamese` - Vietnamese

### Sidebar - Main

- `main` - MAIN section
- `dashboard` - Dashboard
- `analytics` - Analytics

### Sidebar - Management

- `management` - MANAGEMENT section
- `products` - Products
- `orders` - Orders
- `users` - Users
- `categories` - Categories
- `status` - Status
- `discounts` - Discounts
- `recipe` - Recipe
- `quiz` - Quiz
- `aiStrategy` - AI Strategy

### Sidebar - System

- `system` - SYSTEM section
- `language` - Language
- `settings` - Settings
- `uiDemo` - UI Demo
- `backToHome` - Back to home

### Dashboard

- `dashboardTitle` - Dashboard page title
- `dashboardSubtitle` - Dashboard subtitle
- `newOrdersThisWeek` - New Orders This Week
- `newCustomersThisWeek` - New Customers This Week
- `newProductsThisWeek` - New Products This Week
- `totalUsers` - Total Users
- `totalOrders` - Total Orders
- `productsSold` - Products Sold
- `totalRevenue` - Total Revenue
- `lastWeek` - Last week
- `progress` - Progress
- `vsLastPeriod` - vs last period

### Charts & Tables

- `revenueOverview` - Revenue Overview
- `recentOrders` - Recent Orders
- `recentOrdersSubtitle` - List of latest orders
- `topProducts` - Top Products
- `topProductsSubtitle` - Top selling products
- `orderCode` - Order Code
- `customer` - Customer
- `value` - Value
- `statusLabel` - Status
- `sold` - Sold
- `revenue` - Revenue
- `viewAll` - View All
- `noData` - No data available

### Status Values

- `all` - All
- `delivered` - Delivered
- `processing` - Processing
- `cancelled` - Cancelled
- `pending` - Pending

### Business Overview

- `businessPerformance` - Business Performance Overview
- `trackKeyMetrics` - Track important business metrics
- `compareMonth` - Compare Month
- `compareYear` - Compare Year
- `sales` - Sales
- `quantity` - Quantity
- `profit` - Profit

## 🎯 Updated Components

### ✅ HeaderAdmin

- Search placeholder
- Account Settings menu
- Log Out button
- **Language Selector** (NEW)

### ✅ AdminSidebar

- Section labels (MAIN, MANAGEMENT, SYSTEM)
- All menu items
- Translated dynamically

### ✅ AdminDashboard

- Page title and subtitle
- Weekly stat cards
- Overview stat cards
- All Vietnamese text → Translation keys

## 🚀 Usage Examples

### Example 1: Simple Translation

```jsx
const { t } = useAdminLanguage();

// Before
<h1>Bảng điều khiển</h1>

// After
<h1>{t('dashboardTitle')}</h1>
```

### Example 2: Dynamic Content

```jsx
const { t } = useAdminLanguage();

const stats = [
  {
    title: t("newOrdersThisWeek"),
    subtitle: `${t("lastWeek")}: 123`,
  },
];
```

### Example 3: Menu Items

```jsx
const { t } = useAdminLanguage();

const menuItems = [
  { title: t("dashboard"), url: "/admin/dashboard" },
  { title: t("products"), url: "/admin/products" },
  { title: t("orders"), url: "/admin/orders" },
];
```

## 📝 Best Practices

### ✅ DO:

- Use `t()` function for all user-facing text
- Add descriptive translation keys (e.g., `newOrdersThisWeek`)
- Keep English and Vietnamese translations in sync
- Test both languages before committing

### ❌ DON'T:

- Hardcode text strings
- Mix languages in the same component
- Forget to add both EN and VI translations
- Use translation in client-facing components

## 🧪 Testing Checklist

- [ ] Language selector works in HeaderAdmin
- [ ] All admin sidebar menu items translated
- [ ] Dashboard stats show correct translations
- [ ] Language preference persists on reload
- [ ] Switching languages updates all text
- [ ] No console errors
- [ ] Client section remains untranslated

## 🔧 Troubleshooting

### Issue: Translation not showing

**Solution:** Check if translation key exists in both `en` and `vi` objects

### Issue: Language not persisting

**Solution:** Check browser localStorage for 'adminLanguage' key

### Issue: Component not updating

**Solution:** Ensure component is wrapped in `AdminLanguageProvider` and using `useAdminLanguage()` hook

## 📂 File Structure

```
src/
├── app/
│   ├── contexts/
│   │   └── AdminLanguageContext.jsx          # ⭐ Main i18n context
│   ├── components/
│   │   └── AdminLayout/
│   │       ├── AdminLayout.jsx                # Provider wrapper
│   │       └── AdminSidebar.jsx               # ✅ Translated
│   └── pages/
│       └── Admin/
│           └── AdminDashboard/
│               ├── AdminDashboard.jsx         # ✅ Translated
│               └── partials/
│                   ├── HeaderAdmin.jsx        # ✅ Translated
│                   └── LanguageSelector.jsx   # ⭐ NEW Component
```

## 🌐 Future Enhancements

- [ ] Add more languages (Spanish, French, etc.)
- [ ] Implement pluralization rules
- [ ] Add date/time localization
- [ ] Number formatting by locale
- [ ] RTL language support
- [ ] Translation management UI
- [ ] Import/Export translation files

## 📞 Support

Nếu bạn cần thêm translation keys hoặc có vấn đề, hãy:

1. Check `AdminLanguageContext.jsx` để xem danh sách keys hiện có
2. Thêm keys mới vào cả `en` và `vi` objects
3. Use `t('yourKey')` trong component

---

**Last Updated:** $(date)  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
