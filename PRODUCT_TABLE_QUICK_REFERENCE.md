# ProductTable Quick Reference Guide

## 🎯 Usage Examples

### 1. Search Products

```jsx
// Type in search box
"Bánh" → filters products containing "Bánh" in name or description
```

### 2. Filter by Category

```jsx
// Click Filter button → Select category
Filter → Danh mục → "Bánh ngọt" → Áp dụng
```

### 3. Filter by Price Range

```jsx
// Click Filter button → Enter prices
Filter → Khoảng giá → Min: 50000, Max: 200000 → Áp dụng

// Min only (products >= 50000)
Min: 50000, Max: [empty]

// Max only (products <= 200000)
Min: [empty], Max: 200000
```

### 4. Combine Filters

```jsx
// Search + Category + Price
Search: "Bánh"
Category: "Bánh ngọt"
Price: 50000 - 200000
→ Shows only "Bánh ngọt" products with name containing "Bánh" and price 50k-200k
```

### 5. Select Multiple Products

```jsx
// Select all visible
Click checkbox in header

// Select specific products
Click individual checkboxes

// Bulk delete
Select products → "Xóa đã chọn" → Confirm
```

### 6. Export Data

```jsx
// Export all filtered products
Click "Export" button → downloads products_2025-10-18.csv
```

### 7. Change Items Per Page

```jsx
// Show more items
Show: [10] → [50] → displays 50 items per page
```

---

## 🔧 State Management

### Context State

```javascript
{
  products: [],              // All products
  searchTerm: "",            // Search query
  filterCategory: "all",     // Selected category or "all"
  filterPriceMin: "",        // Min price filter
  filterPriceMax: "",        // Max price filter
  sortField: "createdAt",    // Sort column
  sortDirection: "desc",     // "asc" or "desc"
  currentPage: 1,            // Current page number
  itemsPerPage: 10,          // Items per page (10/25/50/100)
  selectedProducts: [],      // Array of selected product IDs
  categories: [],            // Available categories
}
```

### Actions Available

```javascript
// Search
setSearchTerm(string);

// Filters
setFilterCategory(categoryId | "all");
setFilterPriceMin(string);
setFilterPriceMax(string);

// Sort
setSort(field, direction);

// Pagination
setCurrentPage(number);
setItemsPerPage(number);

// Selection
toggleProductSelection(productId);
toggleSelectAll();
clearSelection();

// CRUD
deleteProduct(productId);
deleteMultipleProducts([productIds]);
```

---

## 📊 Computed Values

```javascript
// Filtered products (after search + category + price filters)
const filtered = filteredProducts();

// Sorted products (after filtering + sorting)
const sorted = sortedProducts();

// Paginated products (for current page)
const paginated = paginatedProducts();

// Total pages
const pages = totalPages();
```

---

## 🎨 Styling Classes

### Container

```css
.rounded-2xl           /* Rounded corners */
/* Rounded corners */
.overflow-hidden       /* Clip content */
.shadow-card-2         /* Shadow */
.border-stroke; /* Border color */
```

### Header Section

```css
.px-8 .py-6           /* Padding */
.border-b              /* Bottom border */
.flex .justify-between /* Flexbox layout */
.gap-6; /* Gap between items */
```

### Search Box

```css
.w-80                  /* Fixed width 320px */
.pl-12 .pr-5 .py-3    /* Padding for icon + text */
.rounded-xl            /* Rounded */
.focus:ring-2          /* Focus outline */
```

### Filter Dropdown

```css
.absolute              /* Positioned */
/* Positioned */
.top-full .left-0      /* Below button */
.mt-2                  /* Margin top */
.w-80                  /* Width 320px */
.z-50                  /* Above other elements */
.shadow-lg; /* Large shadow */
```

### Bulk Actions Bar

```css
.bg-blue-light-5       /* Light blue background */
/* Light blue background */
.px-8 .py-6           /* Padding */
.border-b; /* Bottom border */
```

### Table

```css
.overflow-x-auto       /* Horizontal scroll */
.divide-y              /* Row dividers */
.hover:bg-gray-50      /* Hover effect */
```

### Pagination

```css
.px-8 .py-6           /* Padding */
.border-t              /* Top border */
.flex .justify-between /* Flexbox layout */
.gap-3; /* Gap between buttons */
```

---

## 🎭 Interactive States

### Checkbox States

```javascript
// Unchecked
checked={false}
indeterminate={false}

// Checked
checked={true}
indeterminate={false}

// Indeterminate (some selected)
checked={false}
indeterminate={true}
```

### Filter Dropdown States

```javascript
// Closed
showFilterDropdown={false}

// Open
showFilterDropdown={true}
```

### Button States

```javascript
// Normal
className="px-4 py-2 bg-primary"

// Hover
className="hover:bg-primary/90"

// Disabled
className="disabled:opacity-50 disabled:cursor-not-allowed"
disabled={true}
```

---

## 🔍 Filter Logic Flow

```
1. User types search
   → setSearchTerm()
   → getFilteredProducts() runs
   → Products filtered by name/description

2. User selects category
   → setFilterCategory()
   → getFilteredProducts() runs
   → Products filtered by category

3. User enters price range
   → setFilterPriceMin() / setFilterPriceMax()
   → getFilteredProducts() runs
   → Products filtered by price

4. All filters combine (AND logic)
   → Result = products matching ALL active filters

5. Sorting applied
   → getSortedProducts() runs on filtered results

6. Pagination applied
   → getPaginatedProducts() runs on sorted results
   → Only current page items returned
```

---

## 📝 CSV Export Format

```csv
STT,Tên sản phẩm,Giá bán,Danh mục,Kích thước,Ngày tạo
1,"Bánh sinh nhật",500000,"Bánh ngọt","M","18/10/2025"
2,"Cà phê sữa",45000,"Đồ uống","L","17/10/2025"
3,"Bánh kem dâu",350000,"Bánh ngọt","S","16/10/2025"
...
```

### Export Features:

- ✅ Exports ALL filtered products (not just current page)
- ✅ Headers in Vietnamese
- ✅ Values quoted to handle commas
- ✅ Filename: `products_YYYY-MM-DD.csv`
- ✅ Encoding: UTF-8

---

## 🐛 Troubleshooting

### Issue: Filters not working

```javascript
// Check context state
console.log(searchTerm, filterCategory, filterPriceMin, filterPriceMax);

// Check if getFilteredProducts is called
console.log(filteredProducts());
```

### Issue: Pagination shows wrong count

```javascript
// Check total items
console.log(sortedProducts().length);

// Check pagination calculation
console.log(totalPages());
console.log(currentPage, itemsPerPage);
```

### Issue: Checkbox indeterminate not showing

```javascript
// Check ref is set
console.log(checkboxRef.current);

// Check someSelected value
console.log(someSelected);

// Verify useEffect runs
useEffect(() => {
  console.log("Setting indeterminate:", someSelected);
  if (checkboxRef.current) {
    checkboxRef.current.indeterminate = someSelected;
  }
}, [someSelected]);
```

### Issue: Export empty or missing data

```javascript
// Check allProducts
const allProducts = sortedProducts();
console.log("Exporting", allProducts.length, "products");

// Check CSV generation
console.log(csvContent);
```

---

## 🚀 Performance Tips

### 1. Debounce Search

```javascript
// Add debounce to search input
const debouncedSearch = useMemo(
  () => debounce((value) => setSearchTerm(value), 300),
  [setSearchTerm]
);
```

### 2. Memoize Expensive Computations

```javascript
// Memoize filtered products
const filtered = useMemo(
  () => getFilteredProducts(state),
  [state.products, state.searchTerm, state.filterCategory, ...]
)
```

### 3. Virtual Scrolling (for large datasets)

```javascript
// Use react-window for 1000+ items
import { FixedSizeList } from "react-window";
```

### 4. Lazy Load Images

```javascript
// Add loading="lazy" to images
<img loading="lazy" src={imageUrl} alt={productName} />
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile (< 640px) */
- Stack search and filters vertically
- Full width buttons
- Hide some columns in table

/* Tablet (640px - 1024px) */
- 2 columns for filters
- Show most columns
- Scrollable table

/* Desktop (> 1024px) */
- Full layout
- All columns visible
- No scrolling needed
```

---

## 🔐 Security Considerations

### 1. Input Validation

```javascript
// Validate price inputs
const minPrice = parseFloat(filterPriceMin);
if (isNaN(minPrice)) return; // Ignore invalid input
```

### 2. SQL Injection Prevention

```javascript
// Context filters client-side only
// Backend should validate all queries
```

### 3. XSS Prevention

```javascript
// React auto-escapes by default
// Be careful with dangerouslySetInnerHTML
```

---

## 🎯 Key Features Summary

| Feature         | Status | Description                          |
| --------------- | ------ | ------------------------------------ |
| Search          | ✅     | Real-time search by name/description |
| Category Filter | ✅     | Dropdown select from categories      |
| Price Filter    | ✅     | Min-max range inputs                 |
| Export          | ✅     | CSV download of all filtered items   |
| Items/Page      | ✅     | 10/25/50/100 options                 |
| Bulk Select     | ✅     | Select all with indeterminate state  |
| Bulk Delete     | ✅     | Delete multiple products at once     |
| Sort            | ✅     | Click columns to sort asc/desc       |
| Pagination      | ✅     | Navigate pages with info display     |
| Empty State     | ✅     | Friendly message when no results     |
| Dark Mode       | ✅     | Full dark mode support               |
| Responsive      | ✅     | Mobile/tablet/desktop layouts        |

---

## 📞 Support

### Common Questions:

**Q: How to reset all filters?**
A: Click Filter → "Xóa bộ lọc"

**Q: How to select all products across pages?**
A: Currently only selects visible page. For all pages, would need backend support.

**Q: Can I filter by multiple categories?**
A: Not yet. Current design supports single category. Easy to extend.

**Q: Export format?**
A: CSV with UTF-8 encoding. Can be extended to XLSX.

**Q: Performance with 10,000 products?**
A: Client-side filtering works up to ~5000. Above that, consider server-side.

---

Made with ❤️ for a better admin experience!
