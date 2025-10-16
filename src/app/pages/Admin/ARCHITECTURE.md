# 📐 Admin UI Architecture

## 🏗️ Component Hierarchy

```
AdminDashboard (Page)
│
├── Page Header
│   ├── Title (text-heading-4)
│   └── Description (text-body-sm)
│
├── Weekly Stats Section
│   └── Grid (3 columns)
│       ├── StatCard (New Orders)
│       ├── StatCard (New Customers)
│       └── StatCard (New Products)
│
├── Overview Stats Section
│   └── Grid (4 columns)
│       ├── StatCard (Total Users)
│       ├── StatCard (Total Orders)
│       ├── StatCard (Products Sold)
│       └── StatCard (Total Revenue)
│
├── Revenue Chart Section
│   └── OverallRevenue (ChartCard)
│       ├── Header (title + PeriodPicker)
│       ├── Chart (ApexCharts Area)
│       └── Summary Stats (Revenue + Products)
│
├── Recent Orders Section
│   └── RecentOrders (ShowcaseSection)
│       ├── Header (title + Filter + Actions)
│       └── Table
│           ├── Table Header
│           └── Table Body (with status badges)
│
└── Products Sections
    ├── TopProducts (ShowcaseSection)
    │   ├── Header
    │   └── Product Cards (horizontal scroll)
    │
    ├── TopProductsChart (Custom)
    │   ├── Horizontal Bar Chart
    │   ├── Trend Sparklines
    │   └── Performance Insights
    │
    └── AdvancedTopProductsChart (Custom)
```

## 🎨 Design Token Flow

```
tailwind.config.js
        ↓
Design Tokens (colors, typography, spacing)
        ↓
        ├─→ AdminLayout Components
        │   ├── StatCard
        │   ├── ChartCard
        │   ├── AdminHeader
        │   └── AdminSidebar
        │
        └─→ AdminComponents
            ├── ShowcaseSection
            ├── PeriodPicker
            └── Other Shared Components
```

## 🔄 Data Flow

```
API (Backend)
    ↓
DashboardService
    ↓
AdminDashboard (useState/useEffect)
    ↓
    ├─→ statsData ──→ StatCard[]
    ├─→ overviewStats ──→ StatCard[]
    ├─→ revenueData ──→ OverallRevenue ──→ Chart
    ├─→ ordersData ──→ RecentOrders ──→ Table
    └─→ productsData ──→ TopProducts ──→ Cards
```

## 📦 Component Dependencies

```
AdminDashboard.jsx
    │
    ├── Imports from lucide-react
    │   ├── Package
    │   ├── ShoppingCart
    │   ├── TrendingUp
    │   └── Users
    │
    ├── Imports from AdminLayout
    │   └── StatCard
    │
    └── Imports from partials
        ├── OverallRevenue
        ├── RecentOrders
        ├── TopProducts
        ├── TopProductsChart
        └── AdvancedTopProductsChart

OverallRevenue.jsx
    │
    ├── react-apexcharts
    ├── DashboardService
    ├── PeriodPicker (AdminComponents)
    └── formatNumber (utils)

RecentOrders.jsx
    │
    ├── lucide-react (Filter, Eye)
    ├── DashboardService
    └── cn (utils)

TopProducts.jsx
    │
    ├── lucide-react (Heart)
    └── DashboardService
```

## 🎯 Component Responsibility

### Page Level

**`AdminDashboard.jsx`**

- Fetch data from API
- Manage state
- Orchestrate child components
- Define grid layouts

### Layout Components

**`StatCard.jsx`**

- Display single statistic
- Show trend (up/down)
- Progress bar
- Icon display

**`ChartCard.jsx`**

- Wrap chart content
- Provide header section
- Support header actions
- Consistent padding/spacing

**`ShowcaseSection.jsx`**

- Wrap sections with title
- Provide border and header
- Support header actions
- Consistent styling

### Feature Components

**`OverallRevenue.jsx`**

- Fetch revenue data
- Render chart
- Period selection
- Summary display

**`RecentOrders.jsx`**

- Fetch orders data
- Render table
- Filter by status
- Status badges

**`TopProducts.jsx`**

- Fetch product data
- Render product cards
- Handle images
- Display sales info

### Utility Components

**`PeriodPicker.jsx`**

- Time period selection
- Custom dropdown styling
- Icon integration

## 🔧 Utility Functions

```
utils/
    │
    ├── cn.js
    │   └── cn(...classes) → string
    │       - Merges class names
    │       - Handles conditionals
    │       - Filters falsy values
    │
    └── formatNumber.js
        ├── compactFormat(num) → string
        │   - 1234 → "1.2K"
        │   - 1500000 → "1.5M"
        │
        ├── standardFormat(num) → string
        │   - 1234567 → "1,234,567"
        │
        └── formatCurrency(num) → string
            - 100000 → "100.000 ₫"
```

## 🎨 Style Composition

```
Component Style Layers:

1. Base Styles
   - rounded-[10px]
   - bg-white dark:bg-gray-dark
   - shadow-1 dark:shadow-card

2. Layout Styles
   - p-4 sm:p-6 xl:p-7.5
   - grid gap-4 sm:gap-6
   - flex items-center justify-between

3. Typography Styles
   - text-heading-4 font-bold
   - text-body-2xlg font-medium
   - text-dark dark:text-white

4. Interactive Styles
   - hover:shadow-card-2
   - transition-all
   - focus:ring-2 focus:ring-primary

5. Responsive Styles
   - sm:grid-cols-2
   - xl:grid-cols-4
   - 2xl:gap-7.5
```

## 📱 Responsive Breakpoints

```
Mobile First Approach:

Default (Mobile)     0px - 639px
    ↓
sm: (Small)        640px - 767px
    ↓
md: (Medium)       768px - 1023px
    ↓
lg: (Large)       1024px - 1279px
    ↓
xl: (Extra Large) 1280px - 1535px
    ↓
2xl: (2X Large)   1536px+

Grid Evolution:
Mobile:    1 column
sm:        2 columns (stats)
md:        2 columns
xl:        3-4 columns
2xl:       4+ columns
```

## 🎭 State Management

```
AdminDashboard State:

dashboardData {
  // Weekly Stats
  newOrders: number
  newCustomers: number
  newProducts: number
  newOrdersPrev: number
  newCustomersPrev: number
  newProductsPrev: number
  newOrdersChangePct: number
  newCustomersChangePct: number
  newProductsChangePct: number
  newOrdersProgress: number
  newCustomersProgress: number
  newProductsProgress: number

  // Overview Stats
  totalUsers: number
  totalOrders: number
  totalProductsSold: number
  totalRevenue: number
  totalCoinsUsed: number
}

OverallRevenue State:
- selectedPeriod: "monthly" | "weekly" | "daily"
- monthlyRevenue: number[]
- monthlyItems: number[]

RecentOrders State:
- selectedFilter: "All" | "Delivered" | "Processing" | etc.
- orders: Order[]
- loading: boolean

TopProducts State:
- products: Product[]
- loading: boolean
```

## 🔐 TypeScript Interface (Future)

```typescript
// For future TypeScript migration

interface DashboardStats {
  newOrders: number;
  newCustomers: number;
  newProducts: number;
  newOrdersPrev: number;
  newCustomersPrev: number;
  newProductsPrev: number;
  newOrdersChangePct: number;
  newCustomersChangePct: number;
  newProductsChangePct: number;
  newOrdersProgress: number;
  newCustomersProgress: number;
  newProductsProgress: number;
  totalUsers: number;
  totalOrders: number;
  totalProductsSold: number;
  totalRevenue: number;
  totalCoinsUsed: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  color?: string;
  progress?: number;
  subtitle?: string;
  hideProgress?: boolean;
}

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

interface ShowcaseSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

interface PeriodPickerProps {
  value: string;
  onChange: (value: string) => void;
  options?: { label: string; value: string }[];
}
```

## 📊 Performance Optimization

```
Optimization Techniques Used:

1. useMemo for computed data
   - Chart series calculations
   - Filtered lists
   - Aggregated stats

2. Conditional rendering
   - Loading states
   - Empty states
   - Error boundaries

3. Lazy loading
   - Images with loading="lazy"
   - Dynamic imports (potential)

4. Efficient re-renders
   - Proper key usage
   - Memoized callbacks
   - Optimized dependencies

5. Code splitting (future)
   - Route-based splitting
   - Component lazy loading
```

## 🧪 Testing Strategy (Recommended)

```
Unit Tests:
- ✅ Utility functions (cn, formatNumber)
- ✅ StatCard component
- ✅ PeriodPicker component
- ✅ ShowcaseSection component

Integration Tests:
- ✅ AdminDashboard data flow
- ✅ Chart rendering
- ✅ Table filtering
- ✅ Period selection

E2E Tests:
- ✅ Full dashboard load
- ✅ User interactions
- ✅ Dark mode toggle
- ✅ Responsive behavior

Visual Regression:
- ✅ Screenshot comparisons
- ✅ Cross-browser testing
- ✅ Dark mode consistency
```

## 🎯 File Structure Best Practices

```
Good Structure:
Admin/
├── AdminDashboard/          ✅ Feature folder
│   ├── AdminDashboard.jsx   ✅ Main component
│   ├── partials/            ✅ Sub-components
│   ├── services/            ✅ API services
│   ├── models/              ✅ Data models
│   └── *.md                 ✅ Documentation

components/
├── AdminLayout/             ✅ Layout components
│   ├── StatCard.jsx
│   └── index.js            ✅ Barrel export
└── AdminComponents/         ✅ Shared components
    ├── ShowcaseSection.jsx
    └── index.js            ✅ Barrel export

utils/                       ✅ Utility functions
├── cn.js
└── formatNumber.js
```

---

**Documentation Version:** 1.0.0  
**Last Updated:** 2025-10-15  
**Maintained by:** Development Team
