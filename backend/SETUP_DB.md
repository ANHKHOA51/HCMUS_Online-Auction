# 📊 Database Setup Guide

## 1️⃣ Tạo Database và Schema

### Option A: Supabase (Recommended)

```bash
# 1. Truy cập Supabase dashboard: https://app.supabase.com
# 2. Mở SQL Editor
# 3. Copy toàn bộ nội dung file: backend/database.sql
# 4. Paste vào SQL Editor
# 5. Click "Run"
```

### Option B: PostgreSQL Local

```bash
# 1. Kết nối đến PostgreSQL
psql -U postgres

# 2. Tạo database
CREATE DATABASE auction_db;

# 3. Kết nối tới database
\c auction_db

# 4. Copy toàn bộ nội dung file: backend/database.sql
# 5. Paste vào terminal và chạy

# Hoặc chạy trực tiếp từ file
psql -U postgres -d auction_db -f backend/database.sql
```

## 2️⃣ Cấu hình Environment Variables

### Backend (.env)

```env
# Database Connection
PG_URL=postgresql://user:password@localhost:5432/auction_db
# Hoặc với Supabase:
# PG_URL=postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres

PORT=3000
NODE_ENV=development
```

### Frontend (.env hoặc vite.config.js)

```javascript
// hoặc tạo file .env.local
VITE_API_URL=http://localhost:3000/api
```

## 3️⃣ Chạy Application

### Terminal 1: Backend

```bash
cd backend
npm install
npm start  # hoặc npm run dev nếu có nodemon
```

Output sẽ hiển thị:

```
✅ DB Connected: 2024-11-15...
🚀 Server running on port 3000
```

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev
```

Output sẽ hiển thị:

```
VITE v7.1.12 ready in 128 ms
➜ Local: http://localhost:5174/
```

## 4️⃣ Test API

### Option A: Browser

```
http://localhost:3000/api/products
http://localhost:3000/api/products/1
```

### Option B: Terminal (cURL)

```bash
# Lấy danh sách sản phẩm
curl http://localhost:3000/api/products

# Lấy chi tiết sản phẩm
curl http://localhost:3000/api/products/1

# Lấy categories
curl http://localhost:3000/api/products/categories/all

# Lấy bids
curl http://localhost:3000/api/products/1/bids
```

### Option C: Postman

- Import URL: `http://localhost:3000/api/products`
- Method: GET
- Send

## 5️⃣ Verify Data

### Kiểm tra Database (SQL)

```sql
-- Kiểm tra users
SELECT id, username, full_name, role FROM users;

-- Kiểm tra products
SELECT id, name, current_price, status FROM products;

-- Kiểm tra Q&A
SELECT * FROM questions_answers;

-- Kiểm tra bids
SELECT * FROM bids ORDER BY bid_time DESC;
```

## 6️⃣ Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

**Nguyên nhân:** PostgreSQL service chưa chạy

```bash
# macOS with Homebrew
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Mở Services → PostgreSQL → Start
```

### Error: "FATAL: password authentication failed"

**Nguyên nhân:** Mật khẩu PostgreSQL sai

```bash
# Kiểm tra user/password trong .env
# Reset password:
sudo -u postgres psql
\password postgres
```

### Error: "relation "users" does not exist"

**Nguyên nhân:** Schema chưa được tạo

- Chạy lại file database.sql
- Kiểm tra database đã được chọn: `\c auction_db`

### Frontend không kết nối Backend

**Kiểm tra:**

1. Backend đang chạy? Kiểm tra port 3000
2. URL API đúng? `http://localhost:3000`
3. CORS được enable? (Cần add vào backend)

```javascript
// backend/index.js
import cors from "cors";
app.use(cors());
```

## 7️⃣ Sample Data

Database đã có sẵn data mẫu:

- **5 Users** (sellers & bidders)
- **5 Categories**
- **8 Products** (với ảnh từ picsum.photos)
- **12 Bids** (lịch sử đặt giá)
- **8 Q&As** (câu hỏi & trả lời)
- **5 Ratings** (đánh giá)
- **4 Notifications** (thông báo)

## 8️⃣ Endpoints Available

```
GET  /api/products                          # Danh sách sản phẩm
GET  /api/products?category_id=1            # Filter by category
GET  /api/products?sort=ending              # Sort by ending time
GET  /api/products?search=iPhone            # Search by name
GET  /api/products/:id                      # Chi tiết sản phẩm
GET  /api/products/:id/bids                 # Lịch sử bid
GET  /api/products/categories/all           # Danh sách categories
```

## 9️⃣ Next Steps

1. ✅ Database setup
2. ✅ API routes tạo
3. ⏭️ Authentication (Login/Register)
4. ⏭️ Place bid endpoint
5. ⏭️ Buy now endpoint
6. ⏭️ User endpoints
7. ⏭️ Q&A endpoints

---

**Hỏi:** "Tôi không thấy ảnh ở chi tiết sản phẩm?"
**Đáp:** Frontend đang fetch từ database. Dữ liệu ảnh được lưu trong mảng `images` của products table.

**Hỏi:** "Làm sao để thêm sản phẩm mới?"
**Đáp:** Cần tạo API endpoint POST /api/products (chưa có, sẽ add tiếp)
