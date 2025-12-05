import { useState, useEffect } from 'react';
import './ProductGallery.css';

const ProductGallery = ({ images = [] }) => {
  // Đảm bảo luôn có ít nhất 1 ảnh (placeholder) nếu mảng rỗng
  const safeImages = images.length > 0 ? images : ['/default-placeholder.png']; 
  
  const [mainImage, setMainImage] = useState(safeImages[0]);

  // Cập nhật mainImage khi props images thay đổi (quan trọng khi load data từ API)
  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]);

  return (
    <div className="product-gallery">
      <div className="main-image-container">
        <img 
          src={mainImage} 
          alt="Sản phẩm chính" 
          className="main-image" 
        />
      </div>
      
      {safeImages.length > 1 && (
        <div className="thumbnail-container">
          {safeImages.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${mainImage === image ? 'active' : ''}`}
              onClick={() => setMainImage(image)}
              title={`Xem ảnh ${index + 1}`}
            >
              <img src={image} alt={`Thumb ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
