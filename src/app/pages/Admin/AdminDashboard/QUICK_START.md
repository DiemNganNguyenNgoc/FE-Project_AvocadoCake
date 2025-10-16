# Admin UI Components - Quick Start Guide

## 🚀 Getting Started

### Import Components

```jsx
// Layout components
import { AdminLayout, StatCard, ChartCard } from "@/components/AdminLayout";

// Utility components
import { ShowcaseSection, PeriodPicker } from "@/components/AdminComponents";

// Utility functions
import { cn } from "@/utils/cn";
import { formatCurrency, compactFormat } from "@/utils/formatNumber";
```

## 📦 Component Examples

### 1. StatCard

```jsx
import { TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/AdminLayout";

<StatCard
  title="Tổng người dùng"
  value="1,234"
  change={12.5} // Percentage change (positive = green, negative = red)
  icon={<Users className="h-6 w-6 text-white" />}
  color="bg-primary" // bg-green, bg-blue, bg-red, bg-orange-light
  progress={75} // Optional: 0-100
  subtitle="So với tuần trước" // Optional
/>;
```

**Props:**

- `title` (string) - Card title
- `value` (string|number) - Main value to display
- `change` (number) - Percentage change (optional)
- `icon` (ReactNode) - Icon element
- `color` (string) - Background color class for icon
- `progress` (number) - Progress bar value 0-100 (optional)
- `subtitle` (string) - Additional text below value (optional)
- `hideProgress` (boolean) - Hide progress bar and change indicator

### 2. ChartCard

```jsx
import { ChartCard } from "@/components/AdminLayout";
import { PeriodPicker } from "@/components/AdminComponents";

<ChartCard
  title="Doanh thu theo tháng"
  headerAction={
    <PeriodPicker
      value={period}
      onChange={setPeriod}
      options={[
        { label: "Hàng ngày", value: "daily" },
        { label: "Hàng tuần", value: "weekly" },
        { label: "Hàng tháng", value: "monthly" },
      ]}
    />
  }
>
  {/* Your chart component */}
  <Chart data={chartData} />
</ChartCard>;
```

**Props:**

- `title` (string) - Card title
- `children` (ReactNode) - Card content
- `className` (string) - Additional classes for content area
- `headerAction` (ReactNode) - Optional action in header (e.g., PeriodPicker)

### 3. ShowcaseSection

```jsx
import { ShowcaseSection } from "@/components/AdminComponents";

<ShowcaseSection
  title="Sản phẩm bán chạy"
  headerAction={<button>View All</button>}
>
  {/* Your content */}
  <div className="grid grid-cols-3 gap-4">
    {products.map((product) => (
      <ProductCard key={product.id} {...product} />
    ))}
  </div>
</ShowcaseSection>;
```

**Props:**

- `title` (string) - Section title
- `children` (ReactNode) - Section content
- `className` (string) - Additional classes for content area
- `headerAction` (ReactNode) - Optional action in header

### 4. PeriodPicker

```jsx
import { useState } from "react";
import { PeriodPicker } from "@/components/AdminComponents";

const [period, setPeriod] = useState("monthly");

<PeriodPicker
  value={period}
  onChange={setPeriod}
  options={[
    { label: "Hàng tháng", value: "monthly" },
    { label: "Hàng tuần", value: "weekly" },
    { label: "Hàng ngày", value: "daily" },
  ]}
/>;
```

**Props:**

- `value` (string) - Current selected value
- `onChange` (function) - Callback when value changes
- `options` (array) - Array of `{ label, value }` objects (optional, has default)

## 🎨 Design Patterns

### Grid Layouts

```jsx
// Mobile-first responsive grid
<div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4 2xl:gap-7.5">
  {items.map((item) => (
    <Card key={item.id} {...item} />
  ))}
</div>
```

**Common Grid Patterns:**

- **2 columns:** `grid-cols-1 md:grid-cols-2`
- **3 columns:** `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- **4 columns:** `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`
- **Auto-fit:** `grid-cols-[repeat(auto-fit,minmax(250px,1fr))]`

### Spacing Scale

```jsx
// Consistent spacing
gap - 4; // 1rem (16px)
gap - 6; // 1.5rem (24px)
gap - 7.5; // 1.875rem (30px)

// Padding
p - 4; // All sides: 1rem
p - 6; // All sides: 1.5rem
px - 7.5; // Horizontal: 1.875rem
py - 4; // Vertical: 1rem

// Margin
space - y - 6; // Vertical spacing between children
```

### Color Classes

```jsx
// Backgrounds
bg-white dark:bg-gray-dark
bg-green    // Success
bg-blue     // Info
bg-red      // Error
bg-primary  // Brand color
bg-orange-light  // Warning

// Text
text-dark dark:text-white          // Primary text
text-dark-4 dark:text-dark-6       // Secondary text
text-dark-6                        // Muted text

// Borders
border-stroke dark:border-dark-3
```

### Typography

```jsx
// Headings
text-heading-4 font-bold           // Page title (35px)
text-heading-6 font-bold           // Card title (24px)
text-body-2xlg font-medium         // Section title (22px)

// Body text
text-body-sm                       // Regular text (14px)
text-body-xs                       // Small text (12px)

// Weights
font-bold      // 700
font-semibold  // 600
font-medium    // 500
```

### Shadows & Borders

```jsx
// Shadows
shadow-1           // Light shadow
shadow-card        // Card shadow
shadow-card-2      // Elevated card

// Border radius
rounded-[10px]     // Standard
rounded-lg         // Alternative
rounded-full       // Circular
```

## 🔧 Utility Functions

### cn() - Class Name Merger

```jsx
import { cn } from "@/utils/cn";

<div className={cn(
  "base-class",
  isActive && "active-class",
  error && "error-class",
  className  // Props className
)}>
```

### Number Formatting

```jsx
import {
  compactFormat,
  standardFormat,
  formatCurrency,
} from "@/utils/formatNumber";

compactFormat(1234); // "1.2K"
compactFormat(1500000); // "1.5M"

standardFormat(1234567); // "1,234,567"

formatCurrency(100000); // "100.000 ₫"
```

## 📊 Dashboard Layout Template

```jsx
const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-heading-4 font-bold text-dark dark:text-white">
          Page Title
        </h1>
        <p className="mt-2 text-body-sm text-dark-6">
          Description of this page
        </p>
      </div>

      {/* Stats Grid - 4 columns */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <StatCard {...stat1} />
        <StatCard {...stat2} />
        <StatCard {...stat3} />
        <StatCard {...stat4} />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 sm:gap-6 2xl:gap-7.5">
        <ChartCard title="Chart 1">
          <MyChart />
        </ChartCard>
      </div>

      {/* Data Table Section */}
      <ShowcaseSection title="Recent Items">
        <DataTable data={items} />
      </ShowcaseSection>
    </div>
  );
};
```

## 🎯 Common Patterns

### Loading State

```jsx
{
  loading ? (
    <div className="rounded-[10px] bg-white p-6 shadow-1">
      <div className="animate-pulse">
        <div className="mb-4 h-6 w-1/3 rounded bg-gray-2"></div>
        <div className="h-32 rounded bg-gray-2"></div>
      </div>
    </div>
  ) : (
    <YourComponent data={data} />
  );
}
```

### Empty State

```jsx
{
  items.length === 0 ? (
    <div className="py-8 text-center text-dark-6">Không có dữ liệu</div>
  ) : (
    items.map((item) => <ItemCard key={item.id} {...item} />)
  );
}
```

### Status Badges

```jsx
<span
  className={cn(
    "inline-flex rounded-full px-3 py-1 text-xs font-medium",
    status === "success" && "bg-green-light-7 text-green-dark",
    status === "warning" && "bg-yellow-light-4 text-yellow-dark",
    status === "error" && "bg-red-light-6 text-red-dark"
  )}
>
  {statusLabel}
</span>
```

### Hover Effects

```jsx
<div
  className="
  rounded-[10px]
  bg-white
  p-4
  shadow-1
  transition-all
  hover:shadow-card-2
  dark:bg-gray-dark
"
>
  Content
</div>
```

## 📱 Responsive Design

### Mobile-First Approach

```jsx
// Start with mobile, scale up
<div className="
  p-4           // Mobile: 16px padding
  sm:p-6        // Small+: 24px padding
  xl:p-7.5      // XL+: 30px padding
">
```

### Breakpoints Reference

```jsx
sm:    640px   // Small devices
md:    768px   // Medium devices
lg:    1024px  // Large devices
xl:    1280px  // Extra large
2xl:   1536px  // 2X Extra large
```

### Hide/Show on Different Screens

```jsx
<div className="
  hidden        // Hidden on mobile
  md:block      // Show on medium+
">
  Desktop only content
</div>

<div className="
  block         // Show on mobile
  md:hidden     // Hide on medium+
">
  Mobile only content
</div>
```

## ⚡ Performance Tips

1. **Memoize expensive calculations:**

```jsx
const chartData = useMemo(() => processData(rawData), [rawData]);
```

2. **Lazy load heavy components:**

```jsx
const HeavyChart = lazy(() => import("./HeavyChart"));

<Suspense fallback={<LoadingSkeleton />}>
  <HeavyChart />
</Suspense>;
```

3. **Optimize images:**

```jsx
<img
  src={imageUrl}
  alt={alt}
  loading="lazy"
  onError={(e) => (e.target.src = fallbackImage)}
/>
```

## 🎓 Best Practices

1. ✅ Always use design tokens (bg-green vs bg-green-500)
2. ✅ Add dark mode support (dark:bg-gray-dark)
3. ✅ Mobile-first responsive design
4. ✅ Semantic HTML elements
5. ✅ Meaningful component names
6. ✅ Document complex logic
7. ✅ Handle loading and error states
8. ✅ Use TypeScript for large projects

---

**Need Help?** Check the [full documentation](./DASHBOARD_UI_IMPROVEMENTS.md)
