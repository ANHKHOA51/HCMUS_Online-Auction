# 🚀 Quick Start Guide

## 📋 Prerequisites

- Node.js (v16+)
- PostgreSQL hoặc Supabase account
- Git

## ⚡ 5 Bước Setup

### Step 1: Clone Repository (nếu chưa có)

```bash
git clone <repo_url>
cd HCMUS_Online-Auction
```

### Step 2: Setup Database

```bash
# Copy toàn bộ nội dung backend/database.sql
# Chạy trên PostgreSQL hoặc Supabase SQL Editor

# Nếu dùng PostgreSQL local:
psql -U postgres -d auction_db -f backend/database.sql
```

### Step 3: Setup Backend

```bash
cd backend

# Copy .env.example và điền thông tin
cp .env.example .env
# Edit .env với connection string của bạn

# Cài dependencies
npm install

# Chạy server
npm run dev
# Hoặc: npm start

# Kiểm tra: Server chạy trên http://localhost:3000
```

### Step 4: Setup Frontend

```bash
cd ../frontend

# Cài dependencies
npm install

# Chạy dev server
npm run dev

# Truy cập: http://localhost:5174/
```

### Step 5: Test

- Truy cập: **http://localhost:5174/product/1**
- Hoặc danh sách: **http://localhost:5174/** (sau khi tạo home page)

## 🎯 Các Endpoints Chính

```
📦 Products
GET    /api/products              # Danh sách sản phẩm
GET    /api/products/:id          # Chi tiết sản phẩm
GET    /api/products/:id/bids     # Lịch sử bid

📁 Categories
GET    /api/products/categories/all   # Danh sách categories
```

## 🔍 Verify

### ✅ Backend Connected

```
Terminal sẽ hiển thị:
✅ DB Connected: ...
🚀 Server running on port 3000
```

### ✅ Frontend Connected

```
Trình duyệt: http://localhost:5174/product/1
Sẽ load dữ liệu từ API backend
```

## ❌ Troubleshooting

| Error                            | Solution                                                |
| -------------------------------- | ------------------------------------------------------- |
| "connect ECONNREFUSED"           | PostgreSQL chưa chạy → `brew services start postgresql` |
| "password authentication failed" | Sai password → check `.env` PG_URL                      |
| "relation does not exist"        | Schema chưa tạo → chạy lại `database.sql`               |
| CORS error                       | Backend chưa enable CORS → check `index.js`             |
| "Cannot GET /product/1"          | Frontend routes chưa setup → check `App.jsx`            |

## 📝 Next Steps

- [ ] Tạo Home page (danh sách sản phẩm)
- [ ] Implement Authentication (Login/Register)
- [ ] Tạo API endpoints: Place bid, Buy now
- [ ] Add search & filter
- [ ] Responsive design optimization
- [ ] Deploy to production

---

**Cần giúp?** Kiểm tra `backend/SETUP_DB.md` để thêm chi tiết
