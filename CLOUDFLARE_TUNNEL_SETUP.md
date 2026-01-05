# 🚀 Cloudflare Tunnel Setup Guide

## Bước 1: Cài đặt Cloudflared

### Windows (PowerShell với quyền Admin):

```powershell
# Download cloudflared
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "C:\cloudflared.exe"

# Hoặc dùng winget
winget install --id Cloudflare.cloudflared
```

### Verify cài đặt:

```bash
cloudflared --version
```

---

## Bước 2: Login vào Cloudflare

```bash
cloudflared tunnel login
```

Browser sẽ mở, chọn domain của bạn → Authorize

File cert sẽ được lưu tại:

- Windows: `C:\Users\YourName\.cloudflared\cert.pem`

---

## Bước 3: Tạo Tunnel

```bash
# Tạo tunnel với tên tùy chọn
cloudflared tunnel create avocado-app

# Output sẽ cho bạn Tunnel ID và UUID
# Ví dụ: Tunnel ID: abc123def-456-789-xyz
```

Lưu lại **Tunnel ID** này!

---

## Bước 4: Tạo file config

Tạo file `config.yml` tại `C:\Users\Lenovo\.cloudflared\config.yml`:

```yaml
tunnel: abc123def-456-789-xyz # Thay bằng Tunnel ID của bạn
credentials-file: C:\Users\Lenovo\.cloudflared\abc123def-456-789-xyz.json

ingress:
  # Subdomain cho frontend
  - hostname: yourdomain.com
    service: http://localhost:80

  # Subdomain cho backend API (optional)
  - hostname: api.yourdomain.com
    service: http://localhost:3001

  # Subdomain cho Recipe API (optional)
  - hostname: recipe.yourdomain.com
    service: http://localhost:8000

  # Subdomain cho Price API (optional)
  - hostname: price.yourdomain.com
    service: http://localhost:8001

  # Subdomain cho Image Search (optional)
  - hostname: image.yourdomain.com
    service: http://localhost:8003

  # Rule bắt buộc - catch all
  - service: http_status:404
```

**Lưu ý:** Thay `yourdomain.com` bằng domain thật của bạn!

---

## Bước 5: Cấu hình DNS

```bash
# Tạo DNS record trỏ domain về tunnel
cloudflared tunnel route dns avocado-app yourdomain.com

# Nếu dùng subdomain:
cloudflared tunnel route dns avocado-app api.yourdomain.com
cloudflared tunnel route dns avocado-app recipe.yourdomain.com
cloudflared tunnel route dns avocado-app price.yourdomain.com
cloudflared tunnel route dns avocado-app image.yourdomain.com
```

Hoặc thêm thủ công trong Cloudflare Dashboard:

- DNS → Add Record
- Type: `CNAME`
- Name: `@` (hoặc subdomain)
- Target: `<tunnel-id>.cfargotunnel.com`
- Proxy status: ✅ Proxied

---

## Bước 6: Chạy Tunnel

### Chạy trực tiếp:

```bash
cloudflared tunnel run avocado-app
```

### Chạy background (Windows Service):

```bash
cloudflared service install
```

---

## 🎯 Cấu hình cho setup hiện tại (Nginx)

Vì bạn đang dùng Nginx ở port 80, setup đơn giản nhất:

### Config đơn giản (chỉ cần 1 domain):

```yaml
tunnel: abc123def-456-789-xyz
credentials-file: C:\Users\Lenovo\.cloudflared\abc123def-456-789-xyz.json

ingress:
  - hostname: yourdomain.com
    service: http://localhost:80
  - service: http_status:404
```

Như vậy:

- `https://yourdomain.com` → Nginx port 80
- Nginx sẽ route `/api/` → Backend (3001)
- Nginx sẽ route `/recipe-api/` → Recipe (8000)
- Nginx sẽ route `/price-api/` → Price (8001)
- Nginx sẽ route `/image-search-api/` → Image Search (8003)

---

## 🔧 Test & Debug

### Test local trước:

```bash
# Test tunnel config
cloudflared tunnel ingress validate

# Test với specific URL
cloudflared tunnel ingress rule https://yourdomain.com
```

### Xem logs:

```bash
cloudflared tunnel run avocado-app --loglevel debug
```

### List tunnels:

```bash
cloudflared tunnel list
```

---

## 📱 Cập nhật Frontend

Sau khi setup xong, **KHÔNG CẦN** thay đổi gì trong code frontend!

Vì:

- Frontend build đang dùng relative URLs (`/api`)
- Nginx đã config route đúng
- Cloudflare Tunnel chỉ là layer proxy bên ngoài

Chỉ cần:

1. Chạy Cloudflare Tunnel
2. Truy cập `https://yourdomain.com`
3. Everything works! ✨

---

## 🚀 Workflow hoàn chỉnh

### 1. Khởi động services (một lần):

```bash
# Terminal 1 - Backend
cd C:\Users\Lenovo\STUDY\Proj1_BE
npm start

# Terminal 2 - Recipe API (nếu cần)
cd C:\Users\Lenovo\STUDY\RCM_RECIPE_3
# Start recipe service

# Terminal 3 - Price API (nếu cần)
cd C:\Users\Lenovo\STUDY\RCM_PRICE
# Start price service

# Terminal 4 - Image Search (nếu cần)
cd C:\Users\Lenovo\STUDY\SEARCH_IMG_2
# Start image service

# Terminal 5 - Nginx
cd C:\Users\Lenovo\Desktop\nginx-1.28.0
.\nginx.exe

# Terminal 6 - Cloudflare Tunnel
cloudflared tunnel run avocado-app
```

### 2. Truy cập:

```
https://yourdomain.com → Your app! 🎉
```

---

## 🆚 So sánh Ngrok vs Cloudflare Tunnel

| Tính năng       | Ngrok Free        | Ngrok Paid   | Cloudflare Tunnel |
| --------------- | ----------------- | ------------ | ----------------- |
| Giá             | Free              | $8-99+/tháng | **Free** ✅       |
| Custom Domain   | ❌                | ✅           | **✅**            |
| URL thay đổi    | ✅ (mỗi lần chạy) | ❌           | **❌**            |
| SSL/TLS         | ✅                | ✅           | **✅**            |
| Bandwidth       | Limited           | Unlimited    | **Unlimited** ✅  |
| Số Tunnel       | 1                 | Unlimited    | **Unlimited** ✅  |
| DDoS Protection | ❌                | Limited      | **✅**            |

---

## 💡 Tips & Tricks

### 1. Auto-start Tunnel khi Windows boot:

```bash
cloudflared service install
```

### 2. Monitor tunnel status:

```bash
cloudflared tunnel info avocado-app
```

### 3. Update tunnel config:

- Sửa `config.yml`
- Restart tunnel

### 4. Multiple tunnels cho dev/staging/prod:

```bash
cloudflared tunnel create avocado-dev
cloudflared tunnel create avocado-staging
cloudflared tunnel create avocado-prod
```

### 5. Backup tunnel credentials:

Copy file `~/.cloudflared/*.json` ra nơi an toàn!

---

## 🐛 Troubleshooting

### Tunnel không kết nối:

```bash
# Check credentials file tồn tại chưa
dir C:\Users\Lenovo\.cloudflared\

# Test config
cloudflared tunnel ingress validate

# Check firewall
# Cloudflare cần outbound port 443 và 7844
```

### DNS không resolve:

- Đợi thêm vài phút để DNS propagate
- Clear DNS cache:
  ```bash
  ipconfig /flushdns
  ```
- Test DNS:
  ```bash
  nslookup yourdomain.com
  ```

### 502 Bad Gateway:

- Check service local có chạy không (Nginx port 80)
- Check nginx config đúng chưa
- Xem tunnel logs

---

## 📚 Resources

- Cloudflare Tunnel Docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- Dashboard: https://dash.cloudflare.com
- Community: https://community.cloudflare.com

---

## 🎉 Kết luận

Với Cloudflare Tunnel:

- ✅ **Free forever** với custom domain
- ✅ **Không cần public IP**
- ✅ **Secure by default** (TLS 1.3)
- ✅ **Global CDN** - fast everywhere
- ✅ **Professional setup** như các công ty lớn

Perfect cho demo, development, và production! 🚀
