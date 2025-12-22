# Payment Page Components

Trang thanh toán đã được tách thành các component nhỏ để dễ quản lý và bảo trì.

## Cấu trúc thư mục

```
PaymentPage/
├── PaymentPage.jsx (Component chính)
├── PaymentPage.css
└── components/
    ├── CoinsSection.jsx        # Component đổi xu
    ├── VoucherSection.jsx      # Component voucher
    ├── PaymentMethodSelector.jsx # Component chọn phương thức thanh toán
    └── PaymentSummary.jsx      # Component tổng hợp chi phí
```

## Các Component

### 1. CoinsSection.jsx

**Mục đích**: Xử lý tính năng đổi xu thành tiền

**Props**:

- `user` - Thông tin user
- `showCoinsSection` - Hiển thị/ẩn section
- `setShowCoinsSection` - Toggle hiển thị
- `isLoadingCoins` - Trạng thái loading
- `coinsToUse` - Số xu muốn sử dụng
- `handleCoinsChange` - Handler thay đổi input
- `coinsApplied` - Số xu đã áp dụng
- `originalTotalPrice` - Tổng tiền gốc
- `handleApplyCoins` - Apply xu
- `handleCancelCoins` - Hủy áp dụng xu

**Chức năng**:

- Hiển thị số xu hiện có
- Input số xu muốn sử dụng
- Tính toán tiết kiệm
- Áp dụng/Hủy xu

---

### 2. VoucherSection.jsx

**Mục đích**: Quản lý voucher giảm giá

**Props**:

- `voucherCode` - Mã voucher nhập vào
- `setVoucherCode` - Set mã voucher
- `handleApplyVoucherCode` - Apply voucher bằng code
- `selectedVouchers` - Danh sách voucher đã chọn
- `handleRemoveVoucher` - Xóa voucher
- `setIsVoucherModalOpen` - Mở modal chọn voucher
- `voucherDiscount` - Tổng giảm giá từ voucher

**Chức năng**:

- Input mã voucher
- Chọn từ danh sách voucher
- Hiển thị voucher đã chọn
- Tính tổng giảm giá

---

### 3. PaymentMethodSelector.jsx

**Mục đích**: Chọn phương thức thanh toán

**Props**:

- `paymentType` - Loại thanh toán ('paypal', 'qr', 'sepay')
- `handlePaymentTypeChange` - Thay đổi loại thanh toán
- `sepayPaymentMethod` - Phương thức Sepay
- `setSepayPaymentMethod` - Set phương thức Sepay
- `paymentInfo` - Thông tin thanh toán
- `handleInputChange` - Handler input change

**Chức năng**:

- Radio buttons: PayPal, QR, Sepay
- Dropdown chọn phương thức Sepay (BANK_TRANSFER, CARD, NAPAS)
- Form input cho QR payment (wallet, số tài khoản)

---

### 4. PaymentSummary.jsx

**Mục đích**: Tổng hợp chi tiết thanh toán

**Props**:

- `originalTotalPrice` - Tổng tiền gốc
- `rankDiscount` - Giảm giá hạng
- `rankDiscountPercent` - % giảm giá hạng
- `coinsApplied` - Số xu đã dùng
- `voucherDiscount` - Giảm từ voucher
- `finalTotalPrice` - Tổng cuối cùng

**Chức năng**:

- Hiển thị breakdown giá
- Tính tổng tiết kiệm
- Hiển thị final price

---

## Ưu điểm của việc tách component

1. **Dễ bảo trì**: Mỗi component có trách nhiệm riêng
2. **Tái sử dụng**: Component có thể dùng ở trang khác
3. **Dễ test**: Test từng component độc lập
4. **Code sạch hơn**: PaymentPage.jsx ngắn gọn, dễ đọc
5. **Tách biệt logic**: UI và business logic tách rõ ràng

## Cách sử dụng

Import các component trong PaymentPage.jsx:

```jsx
import CoinsSection from "./components/CoinsSection";
import VoucherSection from "./components/VoucherSection";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import PaymentSummary from "./components/PaymentSummary";
```

Sử dụng trong render:

```jsx
<CoinsSection {...props} />
<VoucherSection {...props} />
<PaymentMethodSelector {...props} />
<PaymentSummary {...props} />
```

## Ghi chú

- Tất cả state management vẫn ở PaymentPage.jsx (parent)
- Components chỉ nhận props và render UI
- Business logic (API calls, calculations) vẫn ở parent
