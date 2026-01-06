import { useState, useEffect } from 'react';
// Đã xóa import './ProductGallery.css';

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
    <div className="w-full mx-auto flex flex-col bg-[var(--pg-card-bg,#ffffff)] border-[3px] border-solid border-[var(--pg-stroke,#1f1235)] rounded-[16px] overflow-hidden shadow-[6px_6px_0px_rgba(31,18,53,0.15)] max-[480px]:border-[2px] max-[480px]:shadow-[4px_4px_0px_rgba(31,18,53,0.1)]">
      {/* KHUNG ẢNH CHÍNH */}
      <div className="w-full aspect-[4/3] bg-[#f4f6f8] flex items-center justify-center overflow-hidden border-b-[3px] border-solid border-[var(--pg-stroke,#1f1235)] relative group max-[480px]:border-b-[2px]">
        <img 
          src={mainImage} 
          alt="Sản phẩm chính" 
          className="w-full h-full object-contain transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08]" 
        />
      </div>
      
      {/* KHUNG THUMBNAIL */}
      {safeImages.length > 1 && (
        <div className="flex gap-[12px] p-[16px] bg-[var(--pg-bg,#fffffe)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {safeImages.map((image, index) => {
            const isActive = mainImage === image;
            return (
              <div
                key={index}
                className={`shrink-0 w-[64px] h-[64px] border-[2px] border-solid rounded-[10px] cursor-pointer overflow-hidden transition-all duration-[200ms] ease-[ease] bg-white max-[480px]:w-[56px] max-[480px]:h-[56px] max-[480px]:rounded-[8px] ${
                  isActive 
                    ? 'opacity-[1] border-[var(--pg-highlight,#3da9fc)] shadow-[0_0_0_2px_var(--pg-highlight,#3da9fc)_inset] scale-[1.05]' 
                    : 'opacity-[0.7] border-[var(--pg-stroke,#1f1235)] hover:-translate-y-[3px] hover:opacity-[1] hover:shadow-[2px_2px_0px_var(--pg-stroke,#1f1235)]'
                }`}
                onClick={() => setMainImage(image)}
                title={`Xem ảnh ${index + 1}`}
              >
                <img 
                  src={image} 
                  alt={`Thumb ${index + 1}`} 
                  className="w-full h-full object-cover block"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
