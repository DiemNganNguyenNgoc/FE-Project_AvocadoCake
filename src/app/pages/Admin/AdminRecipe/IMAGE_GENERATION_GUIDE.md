# 🎨 Image Generation Feature - Frontend Integration

## 📋 Overview

Tính năng tạo ảnh minh họa tự động từ mô tả công thức bánh sử dụng **Pollinations AI** (free, unlimited).

## 🚀 Features

- ✅ **Auto Translation**: Vietnamese → English (Google Translate API)
- ✅ **Professional Photography**: Enhanced food photography prompts
- ✅ **Free & Unlimited**: Pollinations AI - không cần API key
- ✅ **High Quality**: 1024x1024 pixels, JPEG format
- ✅ **Download**: Tải ảnh về máy
- ✅ **Real-time Preview**: Xem ảnh ngay sau khi tạo

## 📁 File Structure

```
AdminRecipe/
├── partials/
│   └── GenerateImage.jsx          # Component tạo ảnh
├── services/
│   └── RecipeService.js           # API service (updated)
└── usecases/
    └── SmartGenerate.jsx          # Integrated image generation
```

## 🔧 Components

### 1. GenerateImage Component

**Location:** `AdminRecipe/partials/GenerateImage.jsx`

**Props:**

- `recipe`: Object chứa recipe info (name, description, ingredients)
- `onImageGenerated`: Callback khi tạo ảnh thành công

**Features:**

- Generate image button
- Loading state với progress messages
- Image preview
- Download button
- Open in new tab link
- Error handling
- Provider info display

**Usage:**

```jsx
import GenerateImage from "../partials/GenerateImage";

<GenerateImage
  recipe={currentRecipe.recipe}
  onImageGenerated={(imageData) => {
    console.log("Image URL:", imageData.image_url);
    console.log("Provider:", imageData.provider);
  }}
/>;
```

### 2. API Service Method

**Location:** `AdminRecipe/services/RecipeService.js`

**Method:** `generateImage(data)`

**Request:**

```javascript
await recipeAPIService.generateImage({
  recipe_title: "Bánh Dâu Tây",
  recipe_description: "Bánh kem dâu tây màu hồng pastel...",
});
```

**Response:**

```javascript
{
  success: true,
  image_data: "base64_encoded_string",
  image_url: "https://image.pollinations.ai/prompt/...",
  provider: "pollinations_ai",
  format: "jpeg",
  size_bytes: 72552,
  prompt_used: "Professional food photography: ...",
  original_prompt: "Bánh kem dâu tây...",
  message: "Image generated successfully..."
}
```

## 🎯 Integration with SmartGenerate

**File:** `AdminRecipe/usecases/SmartGenerate.jsx`

```jsx
// 1. Import component
import GenerateImage from "../partials/GenerateImage";

// 2. Add state
const [generatedImage, setGeneratedImage] = useState(null);

// 3. Add callback
const handleImageGenerated = (imageData) => {
  setGeneratedImage(imageData);
};

// 4. Render component after RecipeDisplay
<RecipeDisplay recipe={currentRecipe} />
<GenerateImage
  recipe={currentRecipe.recipe}
  onImageGenerated={handleImageGenerated}
/>
```

## 🌐 API Backend

**Endpoint:** `POST /api/v1/smart/generate-image`

**Request Body (3 modes):**

**Mode 1A: Full recipe_data**

```json
{
  "recipe_data": {
    "title": "Bánh Dâu Tây",
    "description": "Bánh kem dâu tây...",
    "ingredients": [...]
  }
}
```

**Mode 1B: Title + Description** ⭐ (Recommended)

```json
{
  "recipe_title": "Bánh Dâu Tây",
  "recipe_description": "Bánh kem dâu tây màu hồng pastel..."
}
```

**Mode 2: Manual prompt**

```json
{
  "image_prompt": "A beautiful strawberry cake, professional food photography"
}
```

## 🎨 UI/UX Flow

```
1. User generates recipe
   ↓
2. RecipeDisplay shows recipe details
   ↓
3. GenerateImage component appears below
   ↓
4. User clicks "Tạo Ảnh" button
   ↓
5. Loading state: "AI đang vẽ ảnh..."
   ├── 🌐 Dịch Vietnamese → English
   ├── 🎨 Tạo professional food photography
   └── ✨ Chờ một chút...
   ↓
6. Image preview displays
   ↓
7. User can:
   ├── Download image
   ├── Open in new tab
   └── View image info
```

## 🎭 States

1. **No Recipe**: Empty state với instruction
2. **Loading**: Loader với progress messages
3. **Success**: Image preview + actions
4. **Error**: Error message với retry option

## 🔍 Example Screenshots

### Before Image Generation

```
┌─────────────────────────────────────┐
│  🎨 Tạo Ảnh Minh Họa      [Tạo Ảnh] │
├─────────────────────────────────────┤
│  🎨 AI tự động tạo ảnh minh họa     │
│  chuyên nghiệp từ mô tả công thức   │
│  (Free, Unlimited - Pollinations AI)│
├─────────────────────────────────────┤
│                                      │
│         🖼️  Chưa có công thức       │
│                                      │
│  Tạo công thức trước để có thể      │
│  tạo ảnh minh họa                   │
│                                      │
└─────────────────────────────────────┘
```

### During Generation

```
┌─────────────────────────────────────┐
│  🎨 Tạo Ảnh Minh Họa   [⏳ Đang...] │
├─────────────────────────────────────┤
│                                      │
│              ⏳                       │
│                                      │
│        AI đang vẽ ảnh...            │
│                                      │
│  🌐 Dịch Vietnamese → English       │
│  🎨 Tạo professional food photo     │
│  ✨ Chờ một chút...                 │
│                                      │
└─────────────────────────────────────┘
```

### After Generation

```
┌─────────────────────────────────────┐
│  🎨 Tạo Ảnh Minh Họa      [Tạo Ảnh] │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │     [BEAUTIFUL CAKE IMAGE]    │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                      │
│  [📥 Tải xuống] [🔗 Mở tab mới]    │
│                                      │
│  Provider: Pollinations AI (Free)   │
│  Size: 1024x1024 pixels             │
│  Quality: Professional photography  │
└─────────────────────────────────────┘
```

## 🐛 Error Handling

- ❌ No recipe → Show empty state
- ❌ API error → Show error message
- ❌ Network timeout → Retry suggestion
- ❌ Image load error → Fallback placeholder

## 📝 Notes

- **No API Key Required**: Pollinations AI is completely free
- **Unlimited**: No quota limits
- **Auto Translation**: Vietnamese prompts auto-translated to English
- **Professional Quality**: Enhanced prompts for food photography
- **Fast**: Usually generates in 5-10 seconds

## 🚀 Testing

1. Start backend: `uvicorn app.main:app --reload`
2. Start frontend: `npm start`
3. Navigate to Admin → Recipe → Smart Generate
4. Generate a recipe
5. Click "Tạo Ảnh" button
6. Wait for image to generate
7. Download or view in new tab

## 🎉 Success Criteria

- ✅ Button appears after recipe generation
- ✅ Loading state shows progress
- ✅ Image displays correctly
- ✅ Download works
- ✅ No errors in console
- ✅ Vietnamese prompts translate correctly

---

**Last Updated:** November 16, 2025
**Status:** ✅ Production Ready
