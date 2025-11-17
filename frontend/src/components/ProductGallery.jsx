import React, { useState } from 'react';
import './ProductGallery.css';

const ProductGallery = ({ images = [] }) => {
  const [mainImage, setMainImage] = useState(images[0] || '/default-product.png');

  return (
    <div className="product-gallery">
      <div className="main-image-container">
        <img src={mainImage} alt="Ảnh chính" className="main-image" />
      </div>
      
      {images.length > 1 && (
        <div className="thumbnail-container">
          {images.map((image, index) => (
            <div
              key={index}
              className={`thumbnail ${mainImage === image ? 'active' : ''}`}
              onClick={() => setMainImage(image)}
            >
              <img src={image} alt={`Ảnh ${index + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
