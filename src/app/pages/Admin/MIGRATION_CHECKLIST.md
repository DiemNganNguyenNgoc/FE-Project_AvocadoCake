# 🔄 Migration Checklist - Apply UI Updates to Other Admin Pages

Use this checklist to apply the new design system to other admin pages consistently.

## 📋 Pre-Migration Checklist

- [ ] Backup current code (create git branch)
- [ ] Review the [QUICK_START.md](./QUICK_START.md) guide
- [ ] Understand the [design system guide](../../../../.claude/agents/design-system-guide.md)
- [ ] Have [tailwind.config.js](../../../../tailwind.config.js) accessible

## 🎯 Pages to Migrate

### High Priority

- [ ] AdminCategory
- [ ] AdminProduct
- [ ] AdminOrder
- [ ] AdminUser

### Medium Priority

- [ ] AdminQuiz
- [ ] AdminDiscount
- [ ] AdminStatus
- [ ] AdminSetting

### Low Priority

- [ ] AdminLanguage
- [ ] AdminDemo

## 🔧 Migration Steps for Each Page

### Step 1: Import New Components

```jsx
// Add these imports
import { StatCard, ChartCard } from "@/components/AdminLayout";
import { ShowcaseSection, PeriodPicker } from "@/components/AdminComponents";
import { cn } from "@/utils/cn";
import { formatCurrency, compactFormat } from "@/utils/formatNumber";
```

**Checklist:**

- [ ] Import StatCard if using statistics
- [ ] Import ChartCard if using charts
- [ ] Import ShowcaseSection for section wrappers
- [ ] Import PeriodPicker if time filtering needed
- [ ] Import utility functions as needed

### Step 2: Update Page Header

#### Before:

```jsx
<div className="mb-6">
  <h1 className="text-2xl font-bold text-gray-900">Page Title</h1>
  <p className="text-gray-600">Description</p>
</div>
```

#### After:

```jsx
<div>
  <h1 className="text-heading-4 font-bold text-dark dark:text-white">
    Page Title
  </h1>
  <p className="mt-2 text-body-sm text-dark-6 dark:text-dark-6">Description</p>
</div>
```

**Checklist:**

- [ ] Use `text-heading-4` for main title
- [ ] Use `text-body-sm` for description
- [ ] Add dark mode classes
- [ ] Remove margin bottom (use space-y-6 on parent)

### Step 3: Update Stats Cards

#### Before:

```jsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div className="bg-white rounded-lg p-6 shadow">
    <h3 className="text-gray-600">Total Users</h3>
    <p className="text-2xl font-bold">1,234</p>
  </div>
</div>
```

#### After:

```jsx
<div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
  <StatCard
    title="Tổng người dùng"
    value="1,234"
    icon={<Users className="h-6 w-6 text-white" />}
    color="bg-primary"
    hideProgress
  />
</div>
```

**Checklist:**

- [ ] Replace custom stat cards with StatCard component
- [ ] Use mobile-first grid: `sm:grid-cols-2 xl:grid-cols-4`
- [ ] Add appropriate icons from lucide-react
- [ ] Use design token colors (bg-green, bg-blue, etc.)
- [ ] Include progress bars where relevant

### Step 4: Update Tables

#### Before:

```jsx
<div className="bg-white rounded-lg shadow overflow-hidden">
  <table className="w-full">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-gray-900">Name</th>
      </tr>
    </thead>
  </table>
</div>
```

#### After:

```jsx
<ShowcaseSection title="Table Title">
  <table className="w-full">
    <thead>
      <tr className="border-b border-stroke dark:border-dark-3">
        <th className="px-4 py-3 text-left text-sm font-semibold text-dark dark:text-white">
          Name
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-stroke dark:divide-dark-3">
      {/* rows */}
    </tbody>
  </table>
</ShowcaseSection>
```

**Checklist:**

- [ ] Wrap table in ShowcaseSection
- [ ] Use `border-stroke dark:border-dark-3` for borders
- [ ] Use `text-dark dark:text-white` for text
- [ ] Add hover states: `hover:bg-gray-1 dark:hover:bg-dark-2`
- [ ] Update header styling

### Step 5: Update Buttons

#### Before:

```jsx
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  Click Me
</button>
```

#### After:

```jsx
<button className="rounded-md bg-primary px-4 py-2 text-white transition-colors hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-primary">
  Click Me
</button>
```

**Checklist:**

- [ ] Use `bg-primary` instead of `bg-blue-500`
- [ ] Use `rounded-md` (6px) for buttons
- [ ] Add `transition-colors` for smooth hover
- [ ] Add focus states for accessibility
- [ ] Use semantic colors (bg-green for success, bg-red for delete)

### Step 6: Update Status Badges

#### Before:

```jsx
<span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
  Active
</span>
```

#### After:

```jsx
<span
  className={cn(
    "inline-flex rounded-full px-3 py-1 text-xs font-medium",
    status === "active" && "bg-green-light-7 text-green-dark",
    status === "inactive" && "bg-red-light-6 text-red-dark"
  )}
>
  Active
</span>
```

**Checklist:**

- [ ] Use `rounded-full` for badges
- [ ] Use design token colors
- [ ] Use `cn()` utility for conditional classes
- [ ] Map status to semantic colors

### Step 7: Update Forms

#### Before:

```jsx
<input
  type="text"
  className="border border-gray-300 rounded px-3 py-2 w-full"
/>
```

#### After:

```jsx
<input
  type="text"
  className="w-full rounded-md border border-stroke bg-white px-4 py-2 text-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-gray-dark dark:text-white"
/>
```

**Checklist:**

- [ ] Use `border-stroke dark:border-dark-3`
- [ ] Add focus states with ring
- [ ] Add dark mode support
- [ ] Use consistent padding (px-4 py-2)

### Step 8: Update Charts

#### Before:

```jsx
<div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-xl font-semibold mb-4">Chart Title</h3>
  <Chart />
</div>
```

#### After:

```jsx
<ChartCard
  title="Chart Title"
  headerAction={<PeriodPicker value={period} onChange={setPeriod} />}
>
  <Chart />
</ChartCard>
```

**Checklist:**

- [ ] Use ChartCard wrapper
- [ ] Add PeriodPicker if time-based
- [ ] Update chart colors to match design system
- [ ] Add loading skeleton

### Step 9: Update Modal/Dialogs

#### Before:

```jsx
<div className="fixed inset-0 bg-black bg-opacity-50">
  <div className="bg-white rounded-lg p-6 max-w-md mx-auto mt-20">
    <h2 className="text-xl font-bold mb-4">Modal Title</h2>
    {/* content */}
  </div>
</div>
```

#### After:

```jsx
<div className="fixed inset-0 bg-dark/50 dark:bg-dark/70">
  <div className="mx-auto mt-20 max-w-md rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
    <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
      Modal Title
    </h2>
    {/* content */}
  </div>
</div>
```

**Checklist:**

- [ ] Use `bg-dark/50` for overlay
- [ ] Use `rounded-[10px]` for modal
- [ ] Add dark mode support
- [ ] Update typography

### Step 10: Add Loading States

```jsx
{
  loading ? (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      <div className="animate-pulse">
        <div className="mb-4 h-6 w-1/3 rounded bg-gray-2 dark:bg-dark-3"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded bg-gray-2 dark:bg-dark-3"
            ></div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <YourComponent />
  );
}
```

**Checklist:**

- [ ] Add loading skeleton for async data
- [ ] Use `animate-pulse`
- [ ] Match skeleton structure to actual component
- [ ] Add dark mode to skeleton

### Step 11: Add Empty States

```jsx
{
  items.length === 0 ? (
    <div className="py-8 text-center text-dark-6 dark:text-dark-6">
      <div className="mb-2">Không có dữ liệu</div>
      <button className="text-primary hover:text-blue-dark">Thêm mới</button>
    </div>
  ) : (
    <ItemList items={items} />
  );
}
```

**Checklist:**

- [ ] Add meaningful empty state messages
- [ ] Provide action to add data
- [ ] Use consistent styling
- [ ] Add dark mode support

## ✅ Post-Migration Checklist

### Testing

- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Test dark mode toggle
- [ ] Test all interactive elements (buttons, dropdowns, etc.)
- [ ] Test keyboard navigation
- [ ] Test loading states
- [ ] Test empty states
- [ ] Test error states
- [ ] Verify all data displays correctly

### Code Quality

- [ ] Remove unused imports
- [ ] Remove console.logs
- [ ] Add JSDoc comments for complex functions
- [ ] Ensure consistent naming
- [ ] Check for accessibility issues
- [ ] Run linter
- [ ] Format code

### Documentation

- [ ] Update component README if exists
- [ ] Document any breaking changes
- [ ] Add usage examples
- [ ] Update screenshots if applicable

### Review

- [ ] Self-review changes
- [ ] Check design consistency with AdminDashboard
- [ ] Verify no business logic changes
- [ ] Test with real API data
- [ ] Performance check (no unnecessary re-renders)

## 🎨 Design Token Reference

### Colors

```jsx
// Backgrounds
bg-white dark:bg-gray-dark
bg-gray-1 dark:bg-dark-2
bg-green, bg-blue, bg-red, bg-primary, bg-orange-light

// Text
text-dark dark:text-white
text-dark-4 dark:text-dark-6
text-dark-6

// Borders
border-stroke dark:border-dark-3

// Shadows
shadow-1 dark:shadow-card
shadow-card-2
```

### Typography

```jsx
text-heading-4 font-bold      // Page titles (35px)
text-body-2xlg font-medium    // Section titles (22px)
text-body-sm                  // Regular text (14px)
text-body-xs                  // Small text (12px)
```

### Spacing

```jsx
gap-4 sm:gap-6 2xl:gap-7.5
p-4 sm:p-6 xl:p-7.5
space-y-6
```

### Border Radius

```jsx
rounded-[10px]    // Cards, containers
rounded-md        // Buttons, inputs
rounded-full      // Badges, avatars
```

## 🚨 Common Pitfalls

1. ❌ **Don't use arbitrary values**

   ```jsx
   // BAD
   className = "bg-[#3b82f6]";

   // GOOD
   className = "bg-blue";
   ```

2. ❌ **Don't forget dark mode**

   ```jsx
   // BAD
   className = "bg-white text-gray-900";

   // GOOD
   className = "bg-white text-dark dark:bg-gray-dark dark:text-white";
   ```

3. ❌ **Don't use old spacing**

   ```jsx
   // BAD
   className="mb-6"

   // GOOD - Use space-y on parent
   <div className="space-y-6">
     <Component1 />
     <Component2 />
   </div>
   ```

4. ❌ **Don't mix old and new patterns**

   ```jsx
   // BAD - Mixing custom card with StatCard
   <div className="bg-white p-6">...</div>
   <StatCard {...} />

   // GOOD - Consistent components
   <StatCard {...} />
   <StatCard {...} />
   ```

## 📊 Progress Tracker

| Page           | Started | Completed | Tested | Reviewed |
| -------------- | ------- | --------- | ------ | -------- |
| AdminDashboard | ✅      | ✅        | ✅     | ✅       |
| AdminCategory  | ⬜      | ⬜        | ⬜     | ⬜       |
| AdminProduct   | ⬜      | ⬜        | ⬜     | ⬜       |
| AdminOrder     | ⬜      | ⬜        | ⬜     | ⬜       |
| AdminUser      | ⬜      | ⬜        | ⬜     | ⬜       |
| AdminQuiz      | ⬜      | ⬜        | ⬜     | ⬜       |
| AdminDiscount  | ⬜      | ⬜        | ⬜     | ⬜       |
| AdminStatus    | ⬜      | ⬜        | ⬜     | ⬜       |
| AdminSetting   | ⬜      | ⬜        | ⬜     | ⬜       |
| AdminLanguage  | ⬜      | ⬜        | ⬜     | ⬜       |

## 🎯 Success Criteria

A page is successfully migrated when:

- ✅ Uses design tokens exclusively (no arbitrary values)
- ✅ Dark mode works perfectly
- ✅ Responsive on all screen sizes
- ✅ Matches AdminDashboard design style
- ✅ No business logic changed
- ✅ All functionality works
- ✅ Loading/empty states implemented
- ✅ Accessibility maintained
- ✅ Code is clean and documented

---

**Last Updated:** 2025-10-15  
**Status:** Ready for use  
**Next Update:** After first page migration
