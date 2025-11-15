# Trang Chi Tiết Sản Phẩm - Hệ Thống Đấu Giá Trực Tuyến

## Giới thiệu

Trang chi tiết sản phẩm cung cấp đầy đủ thông tin về một sản phẩm đấu giá, bao gồm:

- ✅ **Nội dung đầy đủ của sản phẩm** - Mô tả chi tiết
- ✅ **Ảnh đại diện (size lớn)** - Hiển thị chính với zoom
- ✅ **Các ảnh phụ (ít nhất 3 ảnh)** - Gallery thumbnail
- ✅ **Tên sản phẩm** - Tiêu đề rõ ràng
- ✅ **Giá hiện tại** - Giá đặt cao nhất
- ✅ **Giá mua ngay (nếu có)** - Giá BIN
- ✅ **Thông tin người bán & điểm đánh giá** - Card thông tin chi tiết
- ✅ **Thông tin người đặt giá cao nhất & điểm đánh giá** - Nếu có người tham gia
- ✅ **Thời điểm đăng** - Ngày/giờ bắt đầu
- ✅ **Thời điểm kết thúc** - Ngày/giờ kết thúc
- ✅ **Định dạng thời gian tương đối** - Hiển thị "3 ngày nữa", "10 phút nữa" khi còn < 3 ngày
- ✅ **Mô tả chi tiết sản phẩm** - Section riêng
- ✅ **Lịch sử Q&A** - Câu hỏi và trả lời từ người mua & người bán
- ✅ **5 sản phẩm cùng chuyên mục** - Danh sách liên quan

## Cấu trúc Files

```
frontend/src/
├── pages/
│   └── ProductDetail.jsx          # Trang chi tiết chính
│   └── ProductDetail.css          # Styles cho trang
├── components/
│   ├── ProductGallery.jsx         # Gallery ảnh
│   ├── ProductGallery.css
│   ├── UserInfo.jsx               # Thông tin người dùng
│   ├── UserInfo.css
│   ├── QAHistory.jsx              # Lịch sử Q&A
│   ├── QAHistory.css
│   ├── RelatedProducts.jsx        # Sản phẩm liên quan
│   ├── RelatedProducts.css
│   ├── ProductCard.jsx            # Card sản phẩm (để click vào)
│   └── ProductCard.css
├── utils/
│   └── timeUtil.js                # Utility xử lý thời gian
└── App.jsx                         # Route setup
```

## Cách sử dụng

### 1. Cấu hình Routes (App.jsx)

```jsx
import ProductDetail from "./pages/ProductDetail";

<Routes>
  <Route path="/product/:id" element={<ProductDetail />} />
</Routes>;
```

### 2. Điều hướng từ Product Card

```jsx
import ProductCard from "./components/ProductCard";

// Component sẽ tự động điều hướng khi click
<ProductCard product={productData} />;
```

### 3. Tích hợp API thực tế

Thay thế dữ liệu mock trong `fetchProductDetails()`:

```javascript
const fetchProductDetails = async () => {
  const response = await fetch(`/api/products/${id}`);
  const product = await response.json();

  // Lấy thông tin seller
  const sellerRes = await fetch(`/api/users/${product.seller_id}`);
  const seller = await sellerRes.json();

  // Tương tự cho bidder cao nhất, Q&A, sản phẩm liên quan...
};
```

## Các Tính Năng Chính

### 1. Gallery Ảnh

- Hiển thị ảnh chính lớn
- Thumbnail để chọn ảnh
- Hover zoom effect

### 2. Thông Tin Giá

- Giá hiện tại (giá đặt cao nhất)
- Giá mua ngay (nếu có)
- Giá khởi điểm
- Form đặt giá (nếu chưa kết thúc)

### 3. Thời Gian Đấu Giá

- Thời điểm đăng
- Thời điểm kết thúc
- Hiển thị tương đối nếu < 3 ngày

### 4. Thông Tin Người Dùng

- Tên người bán/bidder cao nhất
- Đánh giá (%)
- Điểm dương/âm
- Email, phone

### 5. Lịch Sử Q&A

- Accordion style
- Câu hỏi từ buyers
- Trả lời từ seller
- Thời gian trả lời

### 6. Sản Phẩm Liên Quan

- 5 sản phẩm cùng category
- Click để navigate

## Styling

- Sử dụng CSS Modules/CSS thường
- Responsive design (mobile, tablet, desktop)
- Bootstrap utilities có thể dùng kèm
- Color scheme: xanh (#007bff), đỏ (#ff4444), xanh (#27ae60)

## Tính năng Interactivity

### Đặt Giá

```javascript
const handlePlaceBid = async () => {
  // Validate input
  // Call API
  // Update state
};
```

### Mua Ngay

```javascript
const handleBuyNow = async () => {
  // Process instant buy
};
```

### Đặc biệt khi kết thúc

- Hiển thị "Đã kết thúc"
- Hiển thị người thắng
- Ẩn form đặt giá

## Tích hợp API

### Endpoints cần thiết:

```
GET  /api/products/:id              # Lấy thông tin sản phẩm
GET  /api/users/:id                 # Lấy thông tin người dùng
GET  /api/bids/product/:id          # Lấy lịch sử bid
GET  /api/faqs/product/:id          # Lấy Q&A
GET  /api/products/category/:id     # Lấy sản phẩm cùng category
POST /api/bids                      # Đặt giá mới
POST /api/orders                    # Mua ngay
```

## Cải tiến trong tương lai

- [ ] Thêm animation transitions
- [ ] Real-time bid updates (WebSocket)
- [ ] Watch/Wishlist functionality
- [ ] Share sản phẩm trên social
- [ ] Similar products recommendation
- [ ] Customer reviews & ratings
- [ ] Detailed seller policy
- [ ] Bid history chart

## Notes

- Dữ liệu hiện tại là mock data, cần thay thế bằng API thực
- Responsive design đã được tối ưu
- Component có thể tái sử dụng trong các trang khác
- Xử lý error chưa hoàn chỉnh, cần thêm error boundary
