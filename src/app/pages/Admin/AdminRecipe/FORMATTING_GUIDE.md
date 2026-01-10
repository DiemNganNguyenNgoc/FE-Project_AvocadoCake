# 🎨 Recipe Display Formatting Guide

## Tổng Quan

Đã cải tiến cách hiển thị nội dung từ API trong các partials của AdminRecipe để hiển thị đẹp mắt hơn với các định dạng markdown được render đúng cách.

## 📦 Files Đã Cập Nhật

### 1. **utils/formatText.js** (NEW)

File utility chứa các hàm xử lý formatting text:

#### Functions:

- `formatMarkdownText(text)` - Convert markdown bold (**text**) sang JSX với styling
- `parseStepText(text)` - Tách tiêu đề bước và nội dung
- `parseDecorationTips(text)` - Parse gợi ý trang trí thành sections
- `parseNotes(text)` - Parse notes với bullets và highlights
- `smartFormatText(text, type)` - Auto format dựa trên type

### 2. **SmartRecipeDisplay.jsx** (UPDATED)

Đã cải tiến các sections:

#### ✨ Cách Làm (Instructions)

- **Tự động tách**: Bước X: Title và nội dung
- **Highlight TIPS**: Background vàng với icon cảnh báo
- **Bold formatting**: Tất cả text trong \*\* \*\* được in đậm
- **Responsive**: Gradient background, shadow effects
- **Step numbering**: Badge tròn với gradient

```jsx
// Ví dụ hiển thị:
┌─────────────────────────────────────────────┐
│ [1] Bước 1: Làm Bánh Chocolate             │
│                                             │
│ Làm nóng lò ở 175°C (350°F)...            │
│                                             │
│ ⚠️ TIPS: Đừng trộn bột quá kỹ, sẽ làm    │
│    bánh bị dai.                            │
└─────────────────────────────────────────────┘
```

#### 🎨 Gợi Ý Trang Trí (Decoration Tips)

- **Section-based**: Mỗi bước trang trí là một section riêng
- **Purple theme**: Background gradient purple/pink
- **Bullet points**: Format đẹp với icon
- **Auto parse**: Tự động tách các bước từ text

```jsx
// Ví dụ hiển thị:
┌─────────────────────────────────────────────┐
│ ✨ Gợi Ý Trang Trí                         │
│                                             │
│ ┌─ Bước 1: Chuẩn bị nguyên liệu          │
│ │  • Kẹo bạc hà cây: 3-4 cây             │
│ │  • Chocolate bào                        │
│ └─                                          │
│                                             │
│ ┌─ Bước 2: Tạo hiệu ứng chảy              │
│ │  Cho ganache vào túi bắt kem...        │
│ └─                                          │
└─────────────────────────────────────────────┘
```

#### ⚠️ Lưu Ý Quan Trọng (Notes)

- **Yellow/Orange theme**: Gradient background
- **Icon-based**: Star icon cho mỗi note
- **Smart parsing**: Tách heading, bullet, text
- **Highlight**: Màu và border nổi bật

```jsx
// Ví dụ hiển thị:
┌─────────────────────────────────────────────┐
│ ⚠️ Lưu Ý Quan Trọng                        │
│                                             │
│ ╔═══════════════════════════════════════╗  │
│ ║ Nhiệt độ nguyên liệu:                 ║  │
│ ╚═══════════════════════════════════════╝  │
│                                             │
│ ⭐ Đảm bảo tất cả nguyên liệu đều ở       │
│    nhiệt độ phòng                          │
│                                             │
│ ⭐ Không trộn quá kỹ: Đối với phần bánh   │
│    trộn đến khi vừa hòa quyện              │
└─────────────────────────────────────────────┘
```

### 3. **RecipeDisplay.jsx** (UPDATED)

Tương tự SmartRecipeDisplay, đã update:

- Instructions với title và TIPS parsing
- Support dark mode
- Markdown formatting

## 🎯 Cách Hoạt Động

### Markdown Bold (**text**)

```javascript
// Input từ API:
"**Bước 1: Làm Bánh Chocolate**\nLàm nóng lò..."

// Output JSX:
<strong className="font-bold text-gray-900">
  Bước 1: Làm Bánh Chocolate
</strong>
<span>Làm nóng lò...</span>
```

### TIPS Detection

```javascript
// Input:
"Làm bánh...\n**TIPS:** Đừng trộn quá kỹ"

// Output:
<div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
  <AlertCircle />
  <strong>TIPS:</strong> Đừng trộn quá kỹ
</div>
```

### Step Parsing

```javascript
// Input:
"**Bước 1: Title**\nContent here\n**TIPS:** Something"

// Parse:
{
  title: "Bước 1: Title",
  content: "Content here\n**TIPS:** Something"
}
```

## 🎨 Design System

### Colors

- **Instructions**: White background, green accents
- **Decoration Tips**: Purple/Pink gradient
- **Notes**: Yellow/Orange gradient
- **TIPS**: Yellow highlight box

### Typography

- **Titles**: text-lg/xl, font-bold
- **Content**: text-base, leading-relaxed
- **TIPS**: text-sm, yellow-900

### Spacing

- Sections: space-y-4/6
- Cards: p-4/5, rounded-lg/xl
- Borders: border-2, shadow-sm

## 📱 Responsive Design

- Grid columns: 1 → 2 (md)
- Font sizes: Scale down on mobile
- Spacing: Adjust padding on small screens

## ✅ Testing

Để test formatting, check:

1. ✅ Bold text (**...**) hiển thị đậm
2. ✅ Bước có title riêng
3. ✅ TIPS có background vàng + icon
4. ✅ Decoration tips có sections
5. ✅ Notes có bullets với icons
6. ✅ Line breaks được preserve
7. ✅ Dark mode hoạt động (RecipeDisplay)

## 🔧 Cách Sử Dụng

### Import utilities:

```javascript
import {
  formatMarkdownText,
  parseStepText,
  parseDecorationTips,
  parseNotes,
} from "../utils/formatText";
```

### Format text:

```javascript
// Simple markdown
{
  formatMarkdownText(text);
}

// Parse step
const { title, content } = parseStepText(step);

// Parse decoration
{
  parseDecorationTips(text).map((section, idx) => (
    <div key={idx}>
      <h5>{section.title}</h5>
      <p>{section.content}</p>
    </div>
  ));
}

// Parse notes
{
  parseNotes(text).map((note, idx) => <div key={idx}>{note.content}</div>);
}
```

## 🚀 Next Steps

Nếu cần thêm formatting:

1. Add functions vào `formatText.js`
2. Import vào component
3. Apply trong JSX rendering
4. Test với API data

## 📝 Examples

### API Response Example:

```json
{
  "instructions": [
    "**Bước 1: Làm Bánh**\nChuẩn bị...\n**TIPS:** Đừng trộn quá kỹ",
    "**Bước 2: Làm Kem**\nĐánh bơ...\n**TIPS:** Bơ phải mềm"
  ],
  "decoration_tips": "**Bước 1: Chuẩn bị**\n- Item 1\n- Item 2",
  "notes": "⚠️ **Lưu ý quan trọng:**\n- Point 1\n- Point 2"
}
```

### Rendered Output:

Sẽ hiển thị với:

- ✅ Bold formatting
- ✅ Section separation
- ✅ Icons và colors
- ✅ Proper spacing
- ✅ Responsive layout

---

**Updated**: Dec 30, 2025
**Author**: GitHub Copilot
**Status**: ✅ Production Ready
