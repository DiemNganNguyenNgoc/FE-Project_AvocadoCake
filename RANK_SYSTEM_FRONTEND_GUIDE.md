# 🎖️ RANK SYSTEM - FRONTEND SUMMARY

## ✅ CÁC FILE ĐÃ TẠO

### Admin Components

```
src/app/pages/Admin/AdminRank/
├── index.js                          # Export default
├── AdminRank.jsx                     # Main component với state management
├── models/Rank.js                    # Rank model class
├── schemas/rankSchema.js             # Yup validation schema
├── services/RankService.js           # Business logic layer
└── partials/
    ├── Breadcrumb.jsx               # Breadcrumb navigation
    └── RankTable.jsx                # Table với CRUD operations
```

### Client Components

```
src/app/pages/Client/RankBenefitsPage/
├── index.js                          # Export default
└── RankBenefitsPage.jsx             # Trang hiển thị đặc quyền ranks
```

### Shared Components

```
src/app/components/RankBadge/
├── index.js                          # Export default
└── RankBadge.jsx                    # Badge hiển thị rank ở header
```

### API Services

```
src/app/api/services/
└── RankService.js                    # API calls đến backend
```

---

## 🔧 CẤU HÌNH CẦN THIẾT

### 1. Thêm Routes

File: `src/app/routes/...` hoặc `App.js`

```jsx
import AdminRank from "./pages/Admin/AdminRank";
import RankBenefitsPage from "./pages/Client/RankBenefitsPage";

// Admin Routes
<Route path="/admin/rank" element={<AdminRank />} />
<Route path="/admin/rank/add" element={<AddRank />} /> // Tùy chọn
<Route path="/admin/rank/update" element={<UpdateRank />} /> // Tùy chọn

// Client Routes
<Route path="/rank-benefits" element={<RankBenefitsPage />} />
```

### 2. Thêm Navigation Links

#### Admin Navigation

```jsx
<NavItem>
  <NavLink to="/admin/rank">
    <span className="icon">🎖️</span>
    <span>Quản lý Rank</span>
  </NavLink>
</NavItem>
```

#### Client Navigation (Header/Footer)

```jsx
<NavLink to="/rank-benefits">Đặc quyền thành viên</NavLink>
```

---

## 🎨 UI COMPONENTS

### AdminRank.jsx

**Features:**

- ✅ Danh sách ranks với sorting, pagination
- ✅ Search ranks
- ✅ Bulk actions (delete multiple)
- ✅ Stats cards (tổng ranks, active, selected...)
- ✅ Error handling
- ✅ Loading states

**State Management:**

```jsx
- ranks: Array<Rank>
- loading: boolean
- error: string | null
- selectedRanks: Array<string>
- searchTerm: string
- sortBy: string
- sortOrder: 'asc' | 'desc'
- currentPage: number
- itemsPerPage: number
```

### RankTable.jsx

**Features:**

- ✅ Sortable columns
- ✅ Select all checkbox với indeterminate state
- ✅ Individual row actions (Edit, Delete)
- ✅ Bulk delete
- ✅ Export to CSV
- ✅ Pagination
- ✅ Responsive design

**Columns:**

1. Checkbox
2. Thứ tự (Priority + Icon)
3. Tên Rank (Color + Display Name + Code)
4. Giảm giá (%)
5. Hạn mức
6. Đặc quyền (benefits preview)
7. Trạng thái (Active/Inactive badge)
8. Actions (Edit, Delete buttons)

### RankBenefitsPage.jsx

**Features:**

- ✅ Hiển thị user rank hiện tại (nếu đã login)
- ✅ Progress bar đến rank tiếp theo
- ✅ Grid 3 cột hiển thị tất cả ranks
- ✅ Highlight current rank
- ✅ Màu sắc động theo rank.color
- ✅ Benefits list với checkmark icons
- ✅ Call-to-action cho guest users
- ✅ How it works section

**Sections:**

1. **Header**: Tiêu đề + mô tả
2. **User Current Rank Card**: Rank hiện tại + progress
3. **Ranks Grid**: 3 ranks cards
4. **CTA**: Đăng nhập (nếu chưa login)
5. **Info**: Cách thức hoạt động

### RankBadge.jsx

**Features:**

- ✅ Compact design cho header
- ✅ Hiển thị icon + tên rank
- ✅ Discount badge
- ✅ Mini progress bar
- ✅ Click để navigate đến /rank-benefits
- ✅ Tooltip info
- ✅ Responsive

**Display:**

```
[🥉 Đồng] [-5%]
Progress: ████░░ 67% đến Bạc
```

---

## 🔌 API INTEGRATION

### RankService.js Methods

```javascript
getAllRanks(); // Public - Lấy tất cả ranks
getUserRank(userId, token); // User - Lấy rank của user
getUserRankHistory(userId, token); // User - Lịch sử thăng hạng
createRank(data, token); // Admin - Tạo rank
getRankDetails(id, token); // Admin - Chi tiết rank
updateRank(id, token, data); // Admin - Update rank
deleteRank(id, token); // Admin - Xóa rank
initializeDefaultRanks(token); // Admin - Init mặc định
```

### Usage Example

```jsx
import { getAllRanks } from "../../api/services/RankService";

const fetchRanks = async () => {
  try {
    const response = await getAllRanks();
    if (response.status === "OK") {
      setRanks(response.data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

---

## 🎯 REDUX INTEGRATION (Optional)

Nếu cần quản lý rank trong Redux:

### rankSlice.js

```javascript
import { createSlice } from "@reduxjs/toolkit";

const rankSlice = createSlice({
  name: "rank",
  initialState: {
    currentRank: null,
    totalSpending: 0,
    progressToNextRank: null,
  },
  reducers: {
    setUserRank: (state, action) => {
      state.currentRank = action.payload.currentRank;
      state.totalSpending = action.payload.totalSpending;
      state.progressToNextRank = action.payload.progressToNextRank;
    },
    clearRank: (state) => {
      state.currentRank = null;
      state.totalSpending = 0;
      state.progressToNextRank = null;
    },
  },
});

export const { setUserRank, clearRank } = rankSlice.actions;
export default rankSlice.reducer;
```

---

## 🎨 STYLING GUIDELINES

### Tailwind Classes Sử Dụng

```css
/* Containers */
rounded-2xl, rounded-xl      # Soft corners
border, border-2             # Subtle borders
shadow-lg, shadow-card-2     # Light shadows

/* Colors */
bg-white, bg-gray-50         # Light backgrounds
text-gray-900, text-gray-600 # Text colors
border-gray-200              # Border colors

/* Spacing */
p-8, p-6, p-4                # Padding
gap-6, gap-4, gap-3          # Flexbox gaps
mb-8, mb-6, mb-4             # Margins

/* Interactive */
hover:bg-gray-50             # Hover states
transition-all, duration-300 # Smooth transitions
cursor-pointer               # Clickable elements
```

### Custom Rank Colors

```jsx
// Sử dụng inline style với rank.color
style={{ backgroundColor: rank.color }}
style={{ borderColor: `${rank.color}60` }} // 60% opacity
style={{ color: rank.color }}
```

---

## 🧪 TESTING CHECKLIST

### Admin Panel

```
□ Navigate to /admin/rank
□ Xem danh sách ranks (3 ranks mặc định)
□ Test search functionality
□ Test sort columns
□ Test pagination
□ Select individual ranks
□ Select all ranks
□ Test bulk delete
□ Test export CSV
□ Edit a rank (navigation to update page)
□ Delete a rank
```

### Client Page

```
□ Navigate to /rank-benefits (guest)
□ Xem 3 ranks cards
□ Đọc benefits
□ Click "Đăng nhập ngay"
□ Login user
□ Navigate to /rank-benefits (logged in)
□ Xem user current rank card
□ Xem progress bar
□ Current rank được highlight
```

### Header Integration

```
□ Login as user
□ Xem RankBadge ở header
□ Badge hiển thị đúng icon, tên, discount %
□ Progress bar hiển thị (nếu có next rank)
□ Click badge navigate đến /rank-benefits
□ Responsive trên mobile
```

### Order Flow

```
□ User có rank Đồng
□ Add products to cart
□ Checkout
□ Kiểm tra discount 5% được apply
□ Complete order
□ Kiểm tra totalSpending đã update
□ Nếu đạt rank mới, kiểm tra rank đã update
```

---

## 🐛 COMMON ISSUES

### RankBadge không hiển thị

```jsx
// Kiểm tra:
1. user.isLoggedIn === true
2. user.isAdmin === false
3. userRankData !== null
4. API /api/rank/user/:userId đang hoạt động
```

### Ranks không load

```jsx
// Kiểm tra:
1. API /api/rank/all đang hoạt động
2. Backend đã init ranks chưa
3. Console log response
4. Network tab xem status code
```

### Progress bar không chính xác

```jsx
// Kiểm tra:
1. progressToNextRank.hasNextRank === true
2. progress value trong khoảng 0-100
3. nextRank data tồn tại
```

---

## 📦 DEPENDENCIES

Các package đã sử dụng (nên đã có sẵn):

```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "react-redux": "^8.x",
  "@reduxjs/toolkit": "^1.x",
  "axios": "^1.x",
  "yup": "^1.x",
  "lucide-react": "^0.x" // cho icons
}
```

---

## 🚀 NEXT STEPS

### 1. Tạo Add/Update Forms (Optional)

```
src/app/pages/Admin/AdminRank/usecases/
├── AddRank.jsx       # Form tạo rank mới
└── UpdateRank.jsx    # Form cập nhật rank
```

### 2. Thêm Animations

```jsx
// Framer Motion cho smooth transitions
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>;
```

### 3. Toast Notifications

```jsx
// React Toastify cho feedback
import { toast } from "react-toastify";

toast.success("Rank updated successfully!");
toast.error("Failed to delete rank");
```

---

## 📚 CODE EXAMPLES

### Fetch User Rank trong Component

```jsx
import { getUserRank } from "../../api/services/RankService";
import { useSelector } from "react-redux";

const MyComponent = () => {
  const user = useSelector((state) => state.user);
  const [rankData, setRankData] = useState(null);

  useEffect(() => {
    const fetchRank = async () => {
      if (user?.id) {
        const token = localStorage.getItem("access_token");
        const response = await getUserRank(user.id, token);
        if (response.status === "OK") {
          setRankData(response.data);
        }
      }
    };
    fetchRank();
  }, [user?.id]);

  return (
    <div>
      {rankData && <p>Your rank: {rankData.currentRank.rankDisplayName}</p>}
    </div>
  );
};
```

### Format Currency Helper

```jsx
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Usage
<p>{formatCurrency(5000000)}</p>; // 5.000.000 ₫
```

---

**Tài liệu chi tiết Backend:** `Proj1_BE/RANK_SYSTEM_GUIDE.md`
