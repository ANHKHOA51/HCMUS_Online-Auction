# Frontend Optimization Summary - Tối ưu Frontend

## ✅ Cấu Trúc Tối Ưu Mới

### Pages (Trang chính)
- `HomePage.jsx` - Trang chủ với Top Products
- `SearchResultsPage.jsx` - Trang kết quả tìm kiếm (loại bỏ Sidebar)
- `ProductDetail.jsx` - Chi tiết sản phẩm
- `LoginPage.jsx` - Đăng nhập
- `RegisterPage.jsx` - Đăng ký
- `OtpPage.jsx` - Xác thực OTP

### Components (Thành phần giao diện)
- `Header.jsx` (Header.css) - Header chứa tất cả filters + search
- `ProductCard.jsx` - Thẻ sản phẩm
- `ProductsGrid.jsx` - Lưới sản phẩm
- `ProductGallery.jsx` - Gallery ảnh sản phẩm
- `UserInfo.jsx` - Thông tin người bán
- `QAHistory.jsx` - Lịch sử Q&A
- `RelatedProducts.jsx` - Sản phẩm liên quan
- `TopProductsSection.jsx` - Section hiển thị Top Products
- `LoginForm.jsx` - Form đăng nhập
- `RegisterForm.jsx` - Form đăng ký
- `OtpInput.jsx` - Input OTP

### Hooks (Tái sử dụng logic)
- `useProduct.js` - Hook cho products và filters
  - `useProducts()` - Lấy danh sách sản phẩm + categories
  - `useFilters(products)` - State filters: search, category, sort
  - `useProductDetail(productId)` - Chi tiết sản phẩm
- `useTopProducts.js` - Hooks cho top products
  - `useTopProductsEndingSoon()` - Sắp kết thúc
  - `useTopProductsByBids()` - Có nhiều lượt đấu
  - `useTopProductsByPrice()` - Giá cao nhất
- `useSearchResults.js` - Pagination cho search
- `useBidding.js` - Logic đấu giá
- `auth/` - Login, Register, OTP hooks

### Services
- `apiService.js` - Tất cả API calls
- `authentication.js` - Auth service
- `fakeFetch.js` - Mock data (nếu cần)

### Utils
- `formatCurrency.js` - Format tiền VN
- `formatDate.js` - Format ngày
- `timeUtil.js` - Tính thời gian còn lại
- `calcTimeLeft.js` - Tính time left
- `auth.js` - Auth utilities

## 🔄 Flow Liên Kết (Navigation)

### HomePage → SearchResultsPage
```
1. User click "🔍 Tìm kiếm sản phẩm" button
2. navigate('/search') 
3. SearchResultsPage hiển thị tất cả sản phẩm
```

### Header Search → SearchResultsPage
```
1. User type tên sản phẩm ở Header
2. User click "🔍 Tìm" button
3. navigate(`/search?q=...`)
4. SearchResultsPage read URL params và apply filter
```

### Header Category → SearchResultsPage
```
1. User select category ở Header
2. handleCategorySelect() → navigate(`/search?category=...`)
3. SearchResultsPage read URL params và filter
```

### ProductCard → ProductDetail
```
1. User click ProductCard
2. ProductCard component → navigate(`/product/${product.id}`)
3. ProductDetail page hiển thị chi tiết
```

## 🎨 UI Improvements

### Header (Header.jsx + Header.css)
- ✅ Modern gradient background (#667eea to #764ba2)
- ✅ Responsive grid layout
- ✅ Search bar with better styling
- ✅ Category dropdown with multi-column layout
- ✅ Sort dropdown with emoji icons
- ✅ Login link
- ✅ Sticky positioning
- ✅ Mobile responsive

### Pagination (SearchResultsPage.css)
- ✅ Better button styling with gradients
- ✅ Improved hover effects
- ✅ Active page highlight
- ✅ Responsive pagination buttons
- ✅ Smooth transitions

## 🗑️ Files Removed (Xóa file cũ)
- ❌ `HomePage_old.jsx` - Old home page
- ❌ `Header_old.jsx` - Old header
- ❌ `TopProduct.jsx` - Replaced by TopProductsSection
- ❌ `ItemCard.jsx` - Replaced by ProductCard

## ⚙️ State Management Flow

```
Header.jsx (useFilters)
├── searchQuery (state)
├── selectedCategory (state)
├── sortBy (state)
└── handleSearchSubmit → navigate(/search?q=...)

SearchResultsPage.jsx
├── Read URL params with useSearchParams
├── Initialize filters from URL
├── Pass products to useFilters
├── Get filteredProducts
├── Use useSearchResults for pagination
└── Display ProductsGrid with pagination
```

## 🚀 How to Use

### 1. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Test Navigation
- Go to http://localhost:5174/
- Click "🔍 Tìm kiếm sản phẩm" → /search
- Type in search bar → /search?q=...
- Select category → /search?category=...
- Click product card → /product/:id

### 3. Test Filters
- All filters in Header work everywhere
- URL is synchronized with filters
- Pagination shows 12 products per page
- Sort options: Mới nhất, Sắp kết thúc, Giá thấp/cao

## 📊 Data Flow

```
API Service (backend: 3000/api)
    ↓
useProducts() [hook]
    ├── products[]
    ├── categories[]
    └── loading, error
    ↓
useFilters(products) [hook]
    ├── searchQuery, setSearchQuery
    ├── selectedCategory, setSelectedCategory
    ├── sortBy, setSortBy
    └── filteredProducts (computed)
    ↓
useSearchResults(filteredProducts) [hook]
    └── paginatedProducts
    ↓
ProductsGrid + ProductCard [components]
```

## ✨ Features

✅ Search products by name
✅ Filter by category
✅ Sort by newest, ending soon, price low-high
✅ Pagination with 12 items per page
✅ Responsive design
✅ Product detail page
✅ Related products
✅ Bidding history
✅ Top products sections

## 🐛 Known Issues / TODO

- Sidebar component still exists but not used (can be removed if not needed)
- CSS warning in RelatedProducts.css (line-clamp)
- Need to verify API responses match expected format
- Mock data currently used, need real API

## 📝 Notes

- All filters are managed in Header via useFilters hook
- SearchResultsPage reads URL params for persistent state
- URL is updated when filters change (searchParams)
- No Sidebar on search results page
- All navigation uses React Router navigate()
