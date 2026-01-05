# 🚀 Hướng dẫn Deploy với Nginx + Ngrok

## Vấn đề đã gặp

- **Lỗi**: `ERR_BLOCKED_BY_CLIENT` khi truy cập qua ngrok
- **Nguyên nhân**: Frontend gọi API tới `http://localhost:3001` thay vì dùng URL của ngrok
- **Giải pháp**: Sử dụng relative URLs và proxy qua NGINX

## 📋 Các bước triển khai

### 1. Rebuild Frontend với .env mới

```bash
cd C:\Users\Lenovo\STUDY\FE-Project_AvocadoCake
npm run build
```

### 2. Cài đặt NGINX (nếu chưa có)

- Download: https://nginx.org/en/download.html
- Giải nén vào `C:\nginx` hoặc thư mục tùy chọn

### 3. Copy file cấu hình NGINX

Copy file `C:\Users\Lenovo\STUDY\nginx.conf` vào thư mục NGINX:

```bash
copy C:\Users\Lenovo\STUDY\nginx.conf C:\nginx\conf\nginx.conf
```

### 4. Khởi động các Backend Services

Mở 4 terminal riêng biệt:

**Terminal 1 - Main Backend (Port 3001):**

```bash
cd C:\Users\Lenovo\STUDY\Proj1_BE
npm start
```

**Terminal 2 - Recipe API (Port 8000):**

```bash
cd C:\Users\Lenovo\STUDY\RCM_RECIPE_3
# Khởi động recipe service của bạn
```

**Terminal 3 - Price API (Port 8001):**

```bash
cd C:\Users\Lenovo\STUDY\RCM_PRICE
# Khởi động price service của bạn
```

**Terminal 4 - Image Search API (Port 8003):**

```bash
cd C:\Users\Lenovo\STUDY\SEARCH_IMG_2
# Khởi động image search service của bạn
```

### 5. Khởi động NGINX

```bash
cd C:\nginx
start nginx
# Hoặc
nginx.exe
```

### 6. Kiểm tra NGINX

```bash
# Reload config nếu thay đổi
nginx -s reload

# Stop NGINX
nginx -s stop
```

### 7. Khởi động Ngrok

```bash
ngrok http 80
```

## ✅ Kiểm tra

### Test Local (http://localhost:80)

1. Mở trình duyệt: `http://localhost`
2. Kiểm tra Network tab - API calls phải gọi tới `/api/...` thay vì `http://localhost:3001/api/...`

### Test Ngrok URL

1. Sử dụng URL ngrok (ví dụ: `https://d5687648c01b.ngrok-free.app`)
2. Các API calls sẽ tự động đi qua NGINX proxy

## 🔧 Cấu trúc URL Mapping

| Frontend gọi          | NGINX proxy tới           | Backend service |
| --------------------- | ------------------------- | --------------- |
| `/api/*`              | `localhost:3001/api/*`    | Main Backend    |
| `/recipe-api/*`       | `localhost:8000/api/v1/*` | Recipe AI       |
| `/price-api/*`        | `localhost:8001/*`        | Price AI        |
| `/image-search-api/*` | `localhost:8003/*`        | Image Search    |

## ⚠️ Lưu ý quan trọng

1. **Luôn rebuild frontend** sau khi thay đổi `.env`:

   ```bash
   npm run build
   ```

2. **Không commit file .env** với production URLs vào Git

3. **CORS không còn là vấn đề** vì tất cả requests đi qua cùng domain

4. **Kiểm tra các port** đã chạy đúng chưa:
   ```bash
   netstat -ano | findstr :3001
   netstat -ano | findstr :8000
   netstat -ano | findstr :8001
   netstat -ano | findstr :8003
   netstat -ano | findstr :80
   ```

## 🐛 Troubleshooting

### Lỗi "nginx: [emerg] bind() to 0.0.0.0:80 failed"

- Port 80 đã được sử dụng bởi service khác
- Giải pháp:

  ```bash
  # Tìm process đang dùng port 80
  netstat -ano | findstr :80

  # Hoặc đổi port trong nginx.conf
  listen 8080;
  # Rồi chạy: ngrok http 8080
  ```

### API vẫn gọi về localhost

- Chưa rebuild frontend: `npm run build`
- Xóa cache browser (Ctrl + Shift + Del)
- Kiểm tra lại file `.env`

### NGINX không start

- Kiểm tra syntax: `nginx -t`
- Xem log: `C:\nginx\logs\error.log`
- Đảm bảo paths trong config đúng (dùng `/` không phải `\`)

## 📱 Giải pháp thay thế: Docker

Nếu muốn đơn giản hơn, có thể dùng Docker Compose:

```yaml
version: "3.8"
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./build:/usr/share/nginx/html

  backend:
    # ... backend config
```

## 🎯 Kết quả mong đợi

✅ Truy cập `https://your-ngrok-url.ngrok-free.app` → Hoạt động bình thường  
✅ Không còn lỗi `ERR_BLOCKED_BY_CLIENT`  
✅ Tất cả API calls đi qua NGINX proxy  
✅ CORS được xử lý tự động
