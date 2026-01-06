import React from 'react';
import ProductCard from './ProductCard';
// Đã xóa import './ProductsGrid.css';

const ProductsGrid = ({ title, icon, products, loading }) => {
  
  // Class chung cho Section container (được dùng ở cả 3 trường hợp return)
  // Bao gồm style cơ bản và các media query responsive
  const sectionClass = "bg-[#fffffe] border-[3px] border-solid border-[#094067] rounded-[16px] shadow-[8px_8px_0px_rgba(9,64,103,0.2)] p-[32px] mb-[60px] relative max-[1024px]:p-[24px] max-[1024px]:shadow-[6px_6px_0px_rgba(9,64,103,0.2)] max-[768px]:px-[16px] max-[768px]:py-[20px] max-[768px]:border-[2px] max-[768px]:shadow-[4px_4px_0px_rgba(9,64,103,0.2)] max-[480px]:rounded-[12px] max-[480px]:mb-[40px]";

  // Class cho tiêu đề H2
  const titleClass = "text-[28px] font-extrabold text-[#094067] mb-[30px] mt-0 mx-0 flex items-center gap-[15px] pl-[15px] border-l-[8px] border-solid border-[#ef4565] leading-[1.2] max-[1024px]:text-[24px] max-[1024px]:mb-[24px] max-[1024px]:border-l-[6px] max-[768px]:text-[20px] max-[768px]:pl-[10px] max-[480px]:text-[18px] max-[480px]:flex-wrap";

  if (loading) {
    return (
      <section className={sectionClass}>
        {title && <h2 className={titleClass}>{icon} {title}</h2>}
        <div className="text-center text-[#5f6c7b] py-[60px] px-[20px] text-[18px] font-semibold bg-[#f8f9fa] rounded-[12px] border-[2px] border-dashed border-[#90b4ce]">
          Đang tải...
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className={sectionClass}>
        {title && <h2 className={titleClass}>{icon} {title}</h2>}
        <div className="text-center text-[#5f6c7b] py-[60px] px-[20px] text-[16px] italic bg-[#fff5f5] rounded-[12px] border-[2px] border-dashed border-[#ef4565]">
          Chưa có sản phẩm
        </div>
      </section>
    );
  }

  return (
    <section className={sectionClass}>
      {title && <h2 className={titleClass}>{icon} {title}</h2>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[24px] max-[1024px]:gap-[20px] max-[768px]:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] max-[768px]:gap-[16px] max-[480px]:grid-cols-2 max-[480px]:gap-[12px]">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductsGrid;
