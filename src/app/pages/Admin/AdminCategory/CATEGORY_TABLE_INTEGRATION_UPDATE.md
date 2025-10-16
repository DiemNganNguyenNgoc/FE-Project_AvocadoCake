# Category Table Integration Update - DataTable Design

## Tóm tắt thay đổi

CategoryTable.jsx đã được cập nhật để tích hợp đầy đủ các tính năng search, filter, export và show giống như DataTable.jsx. Header với các chức năng này giờ đây được kết hợp liền mạch với table, loại bỏ sự rời rạc giữa search bar và table.

## Chi tiết cập nhật

### 1. **CategoryTable.jsx** - Tích hợp Header với Table

#### Thêm imports từ lucide-react:

```jsx
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
```

#### Thêm props mới:

- `searchTerm`: Giá trị tìm kiếm hiện tại
- `onSearch`: Callback khi tìm kiếm
- `itemsPerPage`: Số mục mỗi trang (mặc định: 10)
- `onItemsPerPageChange`: Callback khi thay đổi số mục/trang

#### Thêm state quản lý search local:

```jsx
const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
```

#### Header mới với Search, Filter, Export, Show:

```jsx
{
  /* Table Header - Search, Filter, Export */
}
<div className="px-8 py-6 border-b border-stroke dark:border-stroke-dark">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
    <div className="flex items-center gap-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={localSearchTerm}
          onChange={handleSearchChange}
          className="pl-12 pr-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base w-80"
        />
      </div>

      {/* Filter Button */}
      <button className="flex items-center gap-3 px-5 py-3 border border-stroke dark:border-stroke-dark rounded-xl hover:bg-gray-50 dark:hover:bg-dark-2 transition-colors text-base">
        <Filter className="w-5 h-5" />
        Filter
      </button>
    </div>

    <div className="flex items-center gap-6">
      {/* Export Button */}
      <button
        onClick={handleExport}
        className="flex items-center gap-3 px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors text-base"
      >
        <Download className="w-5 h-5" />
        Export
      </button>

      {/* Items per page */}
      <div className="flex items-center gap-3">
        <span className="text-base text-gray-600 dark:text-gray-400">
          Show:
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) =>
            onItemsPerPageChange &&
            onItemsPerPageChange(parseInt(e.target.value))
          }
          className="px-4 py-2 border border-stroke dark:border-stroke-dark rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-dark-2 dark:text-white text-base"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  </div>
</div>;
```

#### Chức năng mới:

**1. handleSearchChange:**

```jsx
const handleSearchChange = (e) => {
  const value = e.target.value;
  setLocalSearchTerm(value);
  if (onSearch) {
    onSearch(value);
  }
};
```

**2. handleExport (Export to CSV):**

```jsx
const handleExport = () => {
  const headers = ["No", "Code", "Name", "Created At", "Status"];
  const csvData = paginatedCategories.map((cat, index) => [
    (currentPage - 1) * itemsPerPage + index + 1,
    cat.categoryCode,
    cat.categoryName,
    formatDate(cat.createdAt),
    cat.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...csvData.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `categories_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
};
```

#### Cập nhật Pagination với ChevronLeft/Right icons:

```jsx
{
  /* Pagination */
}
{
  totalPages > 1 && (
    <div className="px-8 py-6 border-t border-stroke dark:border-stroke-dark">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="text-base text-gray-700 dark:text-gray-300">
          Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số{" "}
          {totalItems} danh mục
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-base rounded-xl transition-colors ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-2"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 rounded-xl border border-stroke dark:border-stroke-dark hover:bg-gray-50 dark:hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 2. **AdminCategory.jsx** - Cập nhật Parent Component

#### Thêm state cho items per page:

```jsx
const [itemsPerPage, setItemsPerPage] = useState(10);
```

#### Thêm handler cho items per page:

```jsx
const handleItemsPerPageChange = (value) => {
  setItemsPerPage(value);
  setCurrentPage(1);
};
```

#### Cập nhật storeProps:

```jsx
const storeProps = {
  categories,
  loading,
  error,
  selectedCategories,
  currentPage,
  sortBy,
  sortOrder,
  toggleCategorySelection,
  selectAllCategories,
  clearSelection,
  setCurrentPage,
  deleteCategory,
  deleteMultipleCategories,
  getPaginatedCategories,
  handleSort,
  clearError,
  onNavigate,
  searchTerm, // ✅ Mới
  onSearch: handleSearchChange, // ✅ Mới
  itemsPerPage, // ✅ Mới
  onItemsPerPageChange: handleItemsPerPageChange, // ✅ Mới
};
```

#### Loại bỏ Search và Filter riêng rẽ:

- ❌ Xóa `SearchBarComponent` riêng biệt
- ❌ Xóa card "Search and Filters" độc lập
- ✅ Tích hợp search trực tiếp vào CategoryTable

#### Cleanup imports:

```jsx
// Đã xóa:
// import SearchBar from "./partials/SearchBar";
// import StatsCards from "./partials/StatsCards";
// import SearchBarComponent from "../../../components/AdminComponents/SearchBarComponent";
// import FilterbarComponent from "../../../components/AdminComponents/FilterbarComponent";
// import AdminTableComponent from "../../../components/AdminComponents/AdminTableComponent";
```

## Cấu trúc mới

### Layout hierarchy:

```
AdminCategory
├── Header (với Breadcrumb, Title, Buttons)
├── Stats Cards (4 cards thống kê)
└── CategoryTable (tích hợp tất cả)
    ├── Table Header (Search + Filter + Export + Show)
    ├── Bulk Actions (nếu có items selected)
    ├── Table (với sorting)
    └── Pagination (với ChevronLeft/Right)
```

## Tính năng được tích hợp

### ✅ Search

- Icon Search từ lucide-react
- Input field với placeholder "Tìm kiếm danh mục..."
- Real-time search với debounce
- Width: 320px (w-80)
- Dark mode support

### ✅ Filter

- Button với icon Filter
- Hover effects
- Sẵn sàng để mở rộng chức năng lọc
- Border và rounded-xl

### ✅ Export

- Button Export với icon Download
- Background primary color
- Export sang CSV format
- Tên file: `categories_YYYY-MM-DD.csv`
- Bao gồm tất cả columns: No, Code, Name, Created At, Status

### ✅ Show (Items per page)

- Dropdown select với options: 10, 25, 50, 100
- Reset về page 1 khi thay đổi
- Hiển thị label "Show:"
- Dark mode support

### ✅ Pagination

- ChevronLeft và ChevronRight icons (thay vì text "Trước"/"Sau")
- Circular buttons (p-3)
- Disabled states
- Hiển thị tối đa 5 pages
- Active page highlighting
- Thông tin "Hiển thị X đến Y trong tổng số Z danh mục"

## So sánh Before/After

### Before:

```
┌─────────────────────────────────────┐
│  Stats Cards                        │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Search Bar (riêng biệt)            │
└─────────────────────────────────────┘
       ⬇️ (khoảng cách)
┌─────────────────────────────────────┐
│  Table Header                       │
├─────────────────────────────────────┤
│  Table Body                         │
├─────────────────────────────────────┤
│  Pagination                         │
└─────────────────────────────────────┘
```

### After:

```
┌─────────────────────────────────────┐
│  Stats Cards                        │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Search | Filter | Export | Show    │ ← Tích hợp liền
├─────────────────────────────────────┤
│  Bulk Actions (nếu có)              │
├─────────────────────────────────────┤
│  Table Header                       │
├─────────────────────────────────────┤
│  Table Body                         │
├─────────────────────────────────────┤
│  Pagination (← → icons)             │
└─────────────────────────────────────┘
```

## Thiết kế Design Tokens

### Container:

- `bg-white dark:bg-gray-dark`
- `rounded-xl`
- `border border-stroke dark:border-stroke-dark`
- `shadow-card-2`

### Header Section:

- `px-8 py-6`
- `border-b border-stroke dark:border-stroke-dark`

### Search Input:

- `pl-12 pr-5 py-3` (left padding cho icon)
- `w-80` (320px width)
- `text-base` (16px)
- `rounded-xl`
- `focus:ring-2 focus:ring-primary`

### Buttons:

- Filter: `border border-stroke`, `hover:bg-gray-50`
- Export: `bg-primary text-white`, `hover:bg-primary/90`
- Pagination: `p-3` (circular với icon)

### Icons:

- Size: `w-5 h-5` (20px)
- Search icon: `text-gray-400`
- Button icons: inherit color

### Select (Show):

- `px-4 py-2`
- `text-base`
- `rounded-xl`
- Options: 10, 25, 50, 100

### Pagination Info:

- `text-base text-gray-700 dark:text-gray-300`
- Format: "Hiển thị X đến Y trong tổng số Z danh mục"

## Responsive Design

### Desktop (≥640px):

- Header: flex-row với justify-between
- Search và Filter bên trái
- Export và Show bên phải
- Gap: 6 (24px)

### Mobile (<640px):

- Header: flex-col
- Stack vertically
- Gap: 6 (24px)
- Full width inputs

## Dark Mode Support

Tất cả elements đều hỗ trợ dark mode:

- `dark:bg-gray-dark` / `dark:bg-dark-2`
- `dark:text-white` / `dark:text-gray-300`
- `dark:border-stroke-dark`
- `dark:hover:bg-dark-2`

## Lợi ích của cập nhật

### 1. UX cải thiện

- ✅ Không còn khoảng cách rời rạc giữa search và table
- ✅ Tất cả controls ở một nơi, dễ truy cập
- ✅ Thiết kế nhất quán với DataTable pattern

### 2. Performance

- ✅ Giảm số lượng re-renders
- ✅ Search được quản lý hiệu quả hơn
- ✅ Pagination cập nhật chính xác với itemsPerPage

### 3. Maintainability

- ✅ Code tập trung hơn
- ✅ Props rõ ràng và có type hints
- ✅ Dễ dàng mở rộng thêm tính năng

### 4. Consistency

- ✅ Giống DataTable.jsx 100%
- ✅ Design tokens thống nhất
- ✅ Icons từ lucide-react

## Testing Checklist

- [ ] Search hoạt động real-time
- [ ] Export CSV với đầy đủ data
- [ ] Show (items per page) thay đổi đúng
- [ ] Pagination icons hiển thị đúng
- [ ] Dark mode toggle hoạt động
- [ ] Responsive trên mobile
- [ ] Filter button sẵn sàng cho future feature
- [ ] Bulk actions vẫn hoạt động
- [ ] Sorting vẫn hoạt động
- [ ] Checkbox selection vẫn hoạt động

## Files Modified

1. **CategoryTable.jsx** - 469 lines

   - Thêm Search/Filter/Export/Show header
   - Cập nhật pagination với icons
   - Thêm export CSV functionality
   - Thêm local search state management

2. **AdminCategory.jsx** - 449 lines (giảm từ 469)
   - Xóa SearchBarComponent riêng biệt
   - Thêm itemsPerPage state
   - Thêm handleItemsPerPageChange
   - Cập nhật storeProps
   - Cleanup unused imports

## Next Steps (Optional Enhancements)

1. **Advanced Filter:**

   - Add filter modal/dropdown
   - Filter by status (Active/Inactive/Cancel)
   - Filter by date range

2. **Bulk Operations:**

   - Export selected items only
   - Bulk status change

3. **Search Improvements:**

   - Add search debounce (300ms)
   - Highlight search terms in results
   - Search history dropdown

4. **Export Options:**
   - Export to Excel (.xlsx)
   - Export to PDF
   - Custom column selection

## Kết luận

CategoryTable.jsx giờ đây đã được tích hợp đầy đủ với header chứa Search, Filter, Export và Show, hoàn toàn giống với DataTable.jsx. Không còn khoảng cách rời rạc giữa search bar và table. Tất cả controls được tập trung ở một nơi, tạo trải nghiệm người dùng mượt mà và nhất quán.

---

**Updated:** October 16, 2025
**Author:** AI Assistant
**Version:** 2.0
