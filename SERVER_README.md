# Frontend Server - Cách Chạy

## 📋 Yêu cầu
- Python 3.6+ (đã cài đặt)
- Backend API chạy trên http://localhost:8080

## 🚀 Cách Chạy

### **Windows**

#### Cách 1: Double-click file `.bat`
```
FE/run-frontend.bat
```

#### Cách 2: Command Prompt
```cmd
cd FE
python server.py --port 3000
```

#### Cách 3: PowerShell
```powershell
cd FE
python server.py --port 3000
```

---

### **Linux / Mac**

#### Cách 1: Shell script
```bash
cd FE
chmod +x run-frontend.sh
./run-frontend.sh 3000
```

#### Cách 2: Python command
```bash
cd FE
python3 server.py --port 3000
```

---

### **Python (Mọi hệ điều hành)**

```bash
cd FE
python server.py --host localhost --port 3000
```

**Tùy chọn:**
- `--host`: IP hoặc hostname (default: localhost)
- `--port`: Port số (default: 3000)

---

## 🌐 Truy cập

Sau khi server chạy, mở browser và truy cập:

- **Trang chủ**: http://localhost:3000/html/index.html
- **Đăng nhập**: http://localhost:3000/html/login.html
- **Admin**: http://localhost:3000/html/admin-books.html

---

## 🔌 Kết nối Backend

Server hỗ trợ **CORS** để giao tiếp với backend:

```
Backend API: http://localhost:8080
Frontend:    http://localhost:3000
```

Đảm bảo backend đang chạy trước khi test:

```bash
cd BE
mvnw.cmd spring-boot:run
```

---

## 🛑 Dừng Server

Nhấn **Ctrl + C** trong terminal

---

## 📝 Ghi chú

- Server tự động phục vụ tài nguyên tĩnh (HTML, CSS, JS, images)
- Request đến `/html/` được phục vụ từ thư mục `html/`
- Request đến `/css/` được phục vụ từ thư mục `css/`
- Request đến `/js/` được phục vụ từ thư mục `js/`
- Request đến `/assets/` được phục vụ từ thư mục `assets/`
- Root path `/` chuyển hướng đến `/html/index.html`

---

## ⚠️ Troubleshooting

### Python không được tìm thấy
```
❌ Python is not installed or not in PATH
```

**Giải pháp:**
- Cài đặt Python từ https://www.python.org/downloads/
- Chọn "Add Python to PATH" trong quá trình cài đặt
- Khởi động lại terminal/CMD

### Port đã được sử dụng
```
Address already in use
```

**Giải pháp:**
- Thay đổi port: `python server.py --port 3001`
- Hoặc dừng ứng dụng khác đang dùng port đó

### Không thể kết nối backend
```
Failed to fetch http://localhost:8080/...
```

**Giải pháp:**
- Kiểm tra backend đã chạy
- Kiểm tra backend đang lắng nghe port 8080
- Kiểm tra CORS config trong backend

---

## 🎯 Quy trình Testing

1. **Khởi động Backend** (Terminal 1)
   ```bash
   cd BE
   mvnw.cmd spring-boot:run
   ```

2. **Khởi động Frontend** (Terminal 2)
   ```bash
   cd FE
   python server.py --port 3000
   ```

3. **Mở Browser**
   ```
   http://localhost:3000/html/login.html
   ```

4. **Đăng nhập**
   - Username: `admin`
   - Password: `admin`

5. **Test CRUD**
   - Truy cập admin panel
   - Tạo/sửa/xóa sách
