# 🎯 AdminStratergy - AI Strategy Assistant

## 📋 Tổng Quan

**AdminStratergy** là trang admin để quản lý và tạo các chương trình khuyến mãi thông minh dựa trên AI recommendations từ RCM_PRICE backend.

### Tính năng chính:

- ✅ UI chatbot-style thân thiện
- ✅ AI recommendations từ Thompson Sampling + Gemini API
- ✅ Hiển thị promotions theo sự kiện
- ✅ Product cards với discount suggestions
- ✅ Integration với AdminDiscount để thêm promotion
- ✅ Tuân thủ Design System (AvocadoCake + Gestalt Principles)

---

## 🎨 Design System

### Gestalt Principles Applied

1. **Proximity** (Gần nhau)

   - Products trong cùng promotion được nhóm lại
   - Chat messages được group theo user/ai
   - Metadata cards được đặt gần nhau

2. **Similarity** (Tương đồng)

   - Tất cả promotion cards có style giống nhau
   - Product cards trong promotion có format nhất quán
   - Chat bubbles có màu sắc phân biệt user/ai

3. **Common Region** (Vùng chung)

   - Chat interface trong 1 card riêng
   - Promotion cards có border và background tách biệt
   - Metadata sections có background khác nhau

4. **Figure/Ground** (Nền - Hình)

   - White cards trên gray background
   - Colored headers trên white cards
   - Important CTAs nổi bật với gradient

5. **Continuity** (Liên tục)
   - Flow từ chat → AI thinking → results → promotion cards
   - Visual timeline từ start date → end date
   - Progressive disclosure của product details

### Color Palette

```css
/* Primary - AvocadoCake */
--avocado-green: #b1e321
--avocado-brown: #3a060e

/* AI Strategy Colors */
--ai-blue: #3B82F6 (Blue-600)
--ai-purple: #9333EA (Purple-600)
--ai-green: #10B981 (Green-500)
--ai-emerald: #059669 (Emerald-600)
```

### Typography

- **Headings**: 2xl-4xl, font-bold, Poppins
- **Body**: base-lg, font-medium, Poppins
- **Labels**: xs-sm, font-semibold, Poppins

### Border Radius

- Cards: `rounded-3xl` (24px)
- Buttons: `rounded-2xl` (16px)
- Small elements: `rounded-xl` (12px)

---

## 🔌 API Integration

### Environment Variables

```env
# .env
REACT_APP_PRICE_API_URL=https://rcm-price.onrender.com
# hoặc local:
# REACT_APP_PRICE_API_URL=http://localhost:8001
```

### Service: StratergyService.js

#### 1. **analyzeProducts()**

Phân tích hiệu suất sản phẩm - Xác định sản phẩm nào bán chạy/chậm

```javascript
const analysis = await StratergyService.analyzeProducts(30);
// analysis_period_days: 7-90 ngày

// Response: Array of products với:
// - status: BEST_SELLER, SLOW_MOVING, NORMAL
// - recommended_discount: Mức giảm giá đề xuất
// - reason: Lý do AI đề xuất
```

#### 2. **discoverCombos()**

Phát hiện combo sản phẩm tiềm năng - Market Basket Analysis

```javascript
const combos = await StratergyService.discoverCombos(0.05, 0.3);
// min_support: 0.01-0.5
// min_confidence: 0.1-0.9

// Response: Array of combos với:
// - product_1 + product_2
// - frequency_together: Số lần mua cùng nhau
// - confidence: Độ tin cậy
// - recommended_bundle_discount: Giảm giá combo
```

#### 3. **getUpcomingEvents()**

Lấy danh sách sự kiện sắp tới

```javascript
const events = await StratergyService.getUpcomingEvents(60);
// days_ahead: 7-365 ngày

// Response: Array of events với:
// - event_type: Tết, Halloween, Giáng Sinh...
// - event_date: Ngày diễn ra
// - days_until_event: Còn bao nhiêu ngày
// - recommended_discount_range: Mức giảm giá phù hợp
// - target_categories: Danh mục sản phẩm phù hợp
```

#### 4. **getEventPromotions()** ⭐ Main API

Tạo AI recommendations cho event promotions

```javascript
const response = await StratergyService.getEventPromotions(60);
// days_ahead: 7-365 ngày
// eventType: null (all events) hoặc specific event name

// Response: Array of complete promotions
```

#### 5. **generateSmartPromotion()**

Tạo khuyến mãi thông minh không phụ thuộc sự kiện

```javascript
const promo = await StratergyService.generateSmartPromotion("balanced");
// focus: 'revenue' | 'clearance' | 'balanced'

// Response: Single promotion với chiến lược được chọn
```

#### 6. **getEventPromotionsHealth()**

Health check cho event promotions service

```javascript
const health = await StratergyService.getEventPromotionsHealth();
// Returns: service status, version, features list
```

#### 7. **getHealthStatus()**

General health check

```javascript
const health = await StratergyService.getHealthStatus();
// Returns: overall API status
```

### API Endpoints Used

#### POST `/api/event-promotions/generate-event-promotion`

**Request:**

```json
{
  "days_ahead": 60
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "promotions": [
      {
        "event_name": "Halloween (31/10)",
        "event_date": "2025-10-31",
        "event_type": "Lễ hội quốc tế",
        "description": "...",
        "start_date": "2025-10-28",
        "end_date": "2025-10-31",
        "duration_days": 3,
        "products": [
          {
            "product_id": "xxx",
            "product_name": "Bánh hoa xuân",
            "current_price": 50000,
            "discount_percent": 25,
            "discounted_price": 37500,
            "expected_revenue": 1500000,
            "confidence": 0.65,
            "ai_optimization_method": "Gemini AI",
            "reasoning": "..."
          }
        ]
      }
    ],
    "metadata": {
      "total_events_detected": 9,
      "total_products_analyzed": 32,
      "suitable_products_count": 16,
      "generated_at": "2025-10-30T10:00:00",
      "days_ahead": 60,
      "analysis_period_days": 365
    }
  }
}
```

---

## 📂 Cấu Trúc Thư Mục

```
AdminStratergy/
├── AdminStratergy.jsx          # Main component
├── index.js                    # Export
├── partials/
│   ├── Breadcrumb.jsx         # Navigation breadcrumb
│   ├── ChatMessage.jsx        # Chat message component
│   └── PromotionCard.jsx      # Promotion card display
└── services/
    └── StratergyService.js    # API service layer
```

---

## 🧩 Components

### 1. AdminStratergy.jsx

**Main component** - Quản lý state và layout

```jsx
const AdminStratergy = () => {
  const [messages, setMessages] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [daysAhead, setDaysAhead] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch AI recommendations
  const handleGenerateRecommendations = async () => {
    // ...
  };

  // Navigate to AddDiscount với pre-filled data
  const handleAddPromotion = (promotion) => {
    sessionStorage.setItem("ai_promotion_draft", JSON.stringify(promotionData));
    navigate("/admin/discount", { state: { fromAI: true, promotionData } });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-1">...</div>

      {/* Promotion Cards */}
      <div className="lg:col-span-2">...</div>
    </div>
  );
};
```

### 2. ChatMessage.jsx

**Message types:**

- `user`: User input (blue bubble, right-aligned)
- `ai-thinking`: Loading state (3 dots animation)
- `ai-summary`: AI response with metadata (green gradient)
- `error`: Error message (red alert)

```jsx
<ChatMessage
  type="ai-summary"
  content={{
    summary: "Tìm thấy 9 chương trình khuyến mãi",
    metadata: { totalEvents: 9, suitableProducts: 16 },
  }}
/>
```

### 3. PromotionCard.jsx

**Props:**

```typescript
interface PromotionCardProps {
  promotion: {
    eventName: string;
    eventDate: string;
    eventType: string;
    description: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    products: Product[];
  };
  onAddPromotion: (promotion) => void;
}
```

**Features:**

- Event header với gradient background
- Promotion period timeline
- Product list với pricing details
- AI reasoning display
- CTA button để add promotion

### 4. StratergyService.js

**Methods:**

```javascript
class StratergyService {
  // Get AI promotions
  async getEventPromotions(daysAhead = 60) {}

  // Health check
  async getHealthStatus() {}

  // Format API response
  formatPromotionResponse(data) {}
}
```

---

## 🚀 Usage Flow

### User Journey:

1. **Mở trang AI Strategy**

   - Xem welcome message từ AI
   - Thấy input field cho days_ahead

2. **Nhập số ngày và generate**

   - Nhập 7-365 ngày
   - Click "Tạo khuyến nghị"
   - Thấy AI thinking animation

3. **Xem kết quả**

   - AI summary với metadata
   - Danh sách promotion cards
   - Mỗi card show:
     - Event info (tên, loại, ngày)
     - Promotion period
     - Products với discounts
     - AI reasoning

4. **Thêm promotion**
   - Click "Thêm khuyến mãi này" trên card
   - Navigate đến AdminDiscount
   - Form pre-filled với AI data
   - User chỉ cần review và submit

---

## 🎯 Integration với AdminDiscount

### Data Flow:

```javascript
// AdminStratergy → sessionStorage
const discountData = {
  eventName: promotion.eventName,
  eventType: promotion.eventType,
  startDate: promotion.startDate,
  endDate: promotion.endDate,
  products: promotion.products,
  description: promotion.description,
};

sessionStorage.setItem("ai_promotion_draft", JSON.stringify(discountData));

// Navigate
navigate("/admin/discount", {
  state: { fromAI: true, promotionData: discountData },
});
```

### AdminDiscount cần update:

```javascript
// AdminDiscount/AddDiscount.jsx
useEffect(() => {
  const aiDraft = sessionStorage.getItem("ai_promotion_draft");
  if (aiDraft) {
    const data = JSON.parse(aiDraft);

    // Pre-fill form
    setFormData({
      discountName: data.eventName,
      discountStartDate: data.startDate,
      discountEndDate: data.endDate,
      discountProduct: data.products.map((p) => p.id),
      // User needs to add:
      discountCode: "",
      discountValue: data.products[0]?.discountPercent || "",
      discountImage: null,
    });

    // Clear after use
    sessionStorage.removeItem("ai_promotion_draft");
  }
}, []);
```

---

## 🎨 UI/UX Highlights

### 1. Chatbot Interface

- Clean, minimal design
- Clear separation user/ai messages
- Smooth animations (fadeIn, bounce)
- Auto-scroll to latest message

### 2. Promotion Cards

- Gradient headers cho visual hierarchy
- Timeline visualization cho dates
- Grid layout cho pricing info
- Collapsible reasoning sections

### 3. Loading States

- AI thinking animation (3 dots)
- Disabled buttons during load
- Shimmer effects (optional)

### 4. Responsive Design

```css
/* Mobile first */
grid-cols-1           /* Stack vertically */

/* Desktop */
lg:grid-cols-3        /* Chat (1 col) + Promotions (2 cols) */
```

### 5. Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states

---

## 🔧 Customization

### Change AI API URL:

```javascript
// services/StratergyService.js
const PRICE_API_URL =
  process.env.REACT_APP_PRICE_API_URL || "https://rcm-price.onrender.com";
```

### Adjust Days Range:

```javascript
// AdminStratergy.jsx
<input
  type="number"
  min="7" // Minimum
  max="365" // Maximum
  value={daysAhead}
/>
```

### Customize Card Colors:

```jsx
// partials/PromotionCard.jsx
<div className="bg-gradient-to-r from-blue-500 to-purple-600">
  {/* Change gradient colors here */}
</div>
```

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Solution:**

```javascript
// Backend cần enable CORS
app.add_middleware(
  CORSMiddleware,
  (allow_origins = ["http://localhost:3000", "https://your-frontend.com"]),
  (allow_credentials = True),
  (allow_methods = ["*"]),
  (allow_headers = ["*"])
);
```

### Issue: Empty Promotions

**Reasons:**

- No events in date range
- No suitable products (rating < 3.5 or sold = 0)
- API error

**Debug:**

```javascript
// Check API response
const rawResponse = await StratergyService.getEventPromotions(60);
console.log("Raw API Response:", rawResponse);
```

### Issue: Slow Loading

**Solutions:**

- Reduce `days_ahead` (60 → 30)
- Add loading skeleton
- Implement pagination for promotions

---

## 📊 Performance

### Optimization Tips:

1. **Lazy Loading**

```javascript
const PromotionCard = lazy(() => import("./partials/PromotionCard"));
```

2. **Memoization**

```javascript
const formattedPromotion = useMemo(
  () => formatPromotion(promotion),
  [promotion]
);
```

3. **Virtual Scrolling**

```javascript
// For large promotion lists (>50 items)
import { FixedSizeList } from "react-window";
```

---

## 🧪 Testing

### Manual Test Cases:

1. **Happy Path**

   - Input 60 days
   - Click generate
   - See AI summary
   - See promotion cards
   - Click "Thêm khuyến mãi"
   - Navigate to discount page

2. **Edge Cases**

   - Input < 7 days → Error message
   - Input > 365 days → Error message
   - No events found → Empty state
   - API error → Error message

3. **Responsive**
   - Mobile: Stack layout
   - Tablet: 2-column
   - Desktop: 3-column

---

## 📝 Future Enhancements

### Phase 2:

- [ ] Save favorite promotions
- [ ] Export promotions to CSV/Excel
- [ ] Schedule promotions
- [ ] A/B testing suggestions
- [ ] Historical performance analytics

### Phase 3:

- [ ] Real-time collaboration
- [ ] AI chat with follow-up questions
- [ ] Custom event creation
- [ ] Integration with calendar systems

---

## 📞 Support

**Developed by:** AvocadoCake Team  
**Backend API:** RCM_PRICE  
**Design System:** AvocadoCake Design Guide  
**Icons:** Lucide React

---

## 📜 License

Proprietary - AvocadoCake Internal Use Only
