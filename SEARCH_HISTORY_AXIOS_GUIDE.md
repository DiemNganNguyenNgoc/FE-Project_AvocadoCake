# 🔄 SearchHistoryService - Axios Style Integration

## ✅ Đã cập nhật thành công!

SearchHistoryService và SearchBoxComponent đã được chuyển đổi để sử dụng axios trực tiếp theo style của bạn.

## 📋 API Functions (Export Style)

### Backend Endpoints:

- `POST /api/search-history/save` - Lưu lịch sử
- `GET /api/search-history/get-history` - Lấy lịch sử cá nhân
- `GET /api/search-history/suggestions` - Gợi ý tìm kiếm
- `GET /api/search-history/popular` - Từ khóa phổ biến
- `DELETE /api/search-history/delete/:id` - Xóa lịch sử cụ thể
- `DELETE /api/search-history/clear` - Xóa tất cả

### Frontend Functions:

```javascript
import {
  saveSearchHistory,
  getSearchHistory,
  getSearchSuggestions,
  getPopularSearches,
  deleteSearchHistory,
  clearAllSearchHistory,
  searchWithHistory,
} from "./services/SearchHistoryService";
```

## 🎯 Cách sử dụng

### 1. Lưu lịch sử tìm kiếm

```javascript
try {
  const result = await saveSearchHistory("bánh ngọt", access_token);
  console.log("Saved:", result);
} catch (error) {
  console.error("Save failed:", error.message);
}
```

### 2. Lấy lịch sử cá nhân

```javascript
try {
  const result = await getSearchHistory(access_token, 10);
  console.log("History:", result.data);
} catch (error) {
  console.error("Get history failed:", error.message);
}
```

### 3. Lấy gợi ý tìm kiếm

```javascript
try {
  const result = await getSearchSuggestions("bánh", access_token, 5);
  console.log("Suggestions:", result.data);
} catch (error) {
  console.error("Get suggestions failed:", error.message);
}
```

### 4. Từ khóa phổ biến (không cần token)

```javascript
try {
  const result = await getPopularSearches(10);
  console.log("Popular:", result.data);
} catch (error) {
  console.error("Get popular failed:", error.message);
}
```

### 5. Wrapper function - tự động save

```javascript
try {
  const result = await searchWithHistory("bánh ngọt", access_token);
  if (result.success) {
    console.log("Search and saved successfully");
  }
} catch (error) {
  console.warn("Warning:", error.message);
}
```

## 🔧 SearchBoxComponent Updates

Component đã được cập nhật để:

### ✅ Hoạt động với token authentication:

```javascript
const getAccessToken = () => {
  return localStorage.getItem("access_token"); // Thay đổi key name nếu cần
};
```

### ✅ Graceful handling khi không có token:

- Vẫn cho phép search bình thường
- Không hiển thị suggestions nếu chưa login
- Không save history nếu chưa login
- Không ảnh hưởng UX

### ✅ Error handling tốt hơn:

- Sử dụng proper Error objects
- Console warnings thay vì break app
- Fallback gracefully cho mọi tình huống

## 🚀 Token Management

### Lấy token từ localStorage:

```javascript
const access_token = localStorage.getItem("access_token");
```

### Hoặc từ Redux/Context (tuỳ cách bạn quản lý):

```javascript
// Trong component
const { access_token } = useSelector((state) => state.auth);
// hoặc
const { access_token } = useContext(AuthContext);
```

### Update getAccessToken function nếu cần:

```javascript
// Trong SearchBoxComponent.jsx, thay đổi function này
const getAccessToken = () => {
  return localStorage.getItem("your-token-key"); // Thay key name
  // hoặc return context/redux token
};
```

## 📱 Usage Example

```jsx
// Trong page/component của bạn
import SearchBoxComponent from "./components/SearchBoxComponent/SearchBoxComponent";

const MyPage = () => {
  const handleSearch = (query) => {
    console.log("Searching for:", query);
    // Navigate to search results hoặc filter data
    // navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      <SearchBoxComponent onSearch={handleSearch} />
      {/* Component sẽ tự động handle search history */}
    </div>
  );
};
```

## 🧪 Test Instructions

### 1. Test với user đã login:

```javascript
// Set token
localStorage.setItem("access_token", "your-jwt-token");

// Search sẽ:
// ✅ Save history
// ✅ Show suggestions
// ✅ Normal search functionality
```

### 2. Test với user chưa login:

```javascript
// Remove token
localStorage.removeItem("access_token");

// Search sẽ:
// ✅ Normal search functionality
// ❌ No history save (không lỗi)
// ❌ No suggestions (không lỗi)
```

### 3. Test API endpoints riêng:

```javascript
import { saveSearchHistory } from "./services/SearchHistoryService";

// Test save
const testSave = async () => {
  try {
    const result = await saveSearchHistory("test query", "Bearer your-token");
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error.message);
  }
};
```

## 📝 Notes

- ✅ All functions sử dụng axios trực tiếp như style của bạn
- ✅ Error handling theo pattern có sẵn
- ✅ Headers format đúng: `token: Bearer ${access_token}`
- ✅ Environment variable: `REACT_APP_API_URL_BACKEND`
- ✅ Export functions thay vì class instance
- ✅ Graceful degradation khi không có token

Bây giờ SearchHistoryService hoạt động 100% theo style axios của bạn! 🎉
