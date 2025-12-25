# AdminLanguage Module

Module quản lý ngôn ngữ cho admin panel, được thiết kế theo design Figma với giao diện hiện đại và dễ sử dụng.

## Tính năng

### 1. Language Selector

- Chọn ngôn ngữ với checkbox và lá cờ
- Hiển thị tên ngôn ngữ bằng tiếng Anh và tiếng bản địa
- Nút "Apply" để áp dụng thay đổi

### 2. Language Manager

- Danh sách các ngôn ngữ hiện có
- Thêm ngôn ngữ mới
- Chỉnh sửa ngôn ngữ
- Xóa ngôn ngữ (không thể xóa ngôn ngữ mặc định)

### 3. Add Language

- Form thêm ngôn ngữ mới với các trường:
  - Mã ngôn ngữ (ISO 639-1)
  - Tên ngôn ngữ (tiếng Anh)
  - Tên bản địa
  - Emoji cờ
  - Trạng thái kích hoạt

### 4. Edit Language

- Form chỉnh sửa thông tin ngôn ngữ
- Không thể thay đổi mã ngôn ngữ
- Có thể xóa ngôn ngữ (trừ ngôn ngữ mặc định)

## Cấu trúc thư mục

```
AdminLanguage/
├── AdminLanguage.jsx          # Component chính
├── partials/
│   ├── LanguageSelector.jsx   # Component chọn ngôn ngữ
│   └── LanguageManager.jsx    # Component quản lý ngôn ngữ
└── usecases/
    ├── AddLanguage.jsx        # Form thêm ngôn ngữ
    └── EditLanguage.jsx       # Form chỉnh sửa ngôn ngữ
```

## Sử dụng

### Trong AdminTab

```jsx
import AdminLanguage from "../AdminLanguage/AdminLanguage";

// Thêm vào navItems
{
  id: "language",
  text: "Language",
  icon: <LibraryBig />,
  path: "/admin/language",
  component: AdminLanguage,
}

// Thêm vào moduleConfigs
language: {
  main: AdminLanguage,
  subPages: {
    add: AddLanguage,
    edit: EditLanguage,
  },
  basePath: "/admin/language",
},
```

### Props

- `onNavigate`: Function để điều hướng giữa các trang
- `languages`: Array chứa danh sách ngôn ngữ
- `selectedLanguages`: Array chứa các ngôn ngữ được chọn
- `onLanguageChange`: Function xử lý khi thay đổi ngôn ngữ được chọn

## Data Structure

```javascript
const language = {
  code: "vi", // Mã ngôn ngữ (ISO 639-1)
  name: "Vietnamese", // Tên tiếng Anh
  nativeName: "Tiếng Việt", // Tên bản địa
  flag: "🇻🇳", // Emoji cờ
  isActive: true, // Trạng thái kích hoạt
  isDefault: true, // Có phải ngôn ngữ mặc định
};
```

## Hard-coded Data

Hiện tại module sử dụng hard-coded data với 2 ngôn ngữ:

- **Vietnamese (vi)**: Ngôn ngữ mặc định
- **English (en)**: Ngôn ngữ thứ hai

## Tích hợp với i18n

Module tự động tích hợp với hệ thống i18n hiện có:

- Sử dụng `useTranslation` hook
- Thay đổi ngôn ngữ chính khi apply
- Lưu cài đặt vào localStorage

## Responsive Design

- Grid layout 2 cột trên desktop
- Stack layout 1 cột trên mobile
- Sử dụng Tailwind CSS cho styling
- Hover effects và transitions mượt mà

## Future Improvements

- Kết nối với API backend
- Thêm validation cho form
- Hỗ trợ upload ảnh cờ thay vì emoji
- Thêm tính năng import/export ngôn ngữ
- Hỗ trợ RTL languages
