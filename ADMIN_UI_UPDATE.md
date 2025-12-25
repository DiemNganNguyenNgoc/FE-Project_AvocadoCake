# Admin UI Update - AvocadoCake

## Tổng quan

Đã cập nhật giao diện admin của website bán bánh ngọt AvocadoCake theo phong cách hiện đại, tham khảo từ nextjs-admin-dashboard-main.

## Những thay đổi chính

### 1. Layout mới

- **AdminLayout**: Layout chính với sidebar và header hiện đại
- **AdminSidebar**: Sidebar với navigation đẹp, responsive
- **AdminHeader**: Header với search, notifications, user menu

### 2. Components UI mới

- **StatCard**: Card hiển thị thống kê với progress bar
- **ChartCard**: Card wrapper cho charts
- **DataTable**: Bảng dữ liệu với search, filter, pagination
- **Button**: Button component với nhiều variants
- **Modal**: Modal component hiện đại
- **Input**: Input component với validation

### 3. Cập nhật Tailwind Config

- Thêm color palette giống reference
- Thêm spacing và typography
- Thêm box shadows và animations
- Hỗ trợ dark mode

### 4. Cập nhật trang admin

- **HomeAdminPage**: Sử dụng StatCard và ChartCard mới
- **AdminDashboard**: Layout mới với spacing tốt hơn
- **AdminTab**: Sử dụng AdminLayout thay vì layout cũ

## Cách sử dụng

### Import components

```jsx
import {
  AdminLayout,
  StatCard,
  ChartCard,
  DataTable,
  Button,
  Modal,
  Input,
} from "../components/AdminLayout";
```

### Sử dụng StatCard

```jsx
<StatCard
  title="Total Users"
  value="1,234"
  change={12.5}
  icon={<Users className="w-6 h-6 text-white" />}
  color="bg-blue-500"
  progress={75}
/>
```

### Sử dụng DataTable

```jsx
<DataTable
  columns={columns}
  data={data}
  onSearch={handleSearch}
  onFilter={handleFilter}
  onExport={handleExport}
  showSearch
  showFilter
  showExport
/>
```

### Sử dụng Button

```jsx
<Button
  variant="primary"
  size="md"
  icon={<Plus className="w-4 h-4" />}
  loading={isLoading}
>
  Add New
</Button>
```

## Demo

Truy cập `/admin/demo` để xem demo tất cả components UI mới.

## Tính năng

- ✅ Responsive design
- ✅ Dark mode support
- ✅ Modern UI/UX
- ✅ Reusable components
- ✅ TypeScript ready
- ✅ Accessibility friendly
- ✅ Performance optimized

## Cấu trúc thư mục

```
src/app/components/AdminLayout/
├── AdminLayout.jsx
├── AdminSidebar.jsx
├── AdminHeader.jsx
├── StatCard.jsx
├── ChartCard.jsx
├── DataTable.jsx
├── Button.jsx
├── Modal.jsx
├── Input.jsx
└── index.js
```

## Lưu ý

- Tất cả components đều tương thích với React 18+
- Sử dụng Tailwind CSS cho styling
- Icons sử dụng Lucide React
- Charts sử dụng Chart.js
- Không thay đổi logic nghiệp vụ, chỉ cập nhật UI
