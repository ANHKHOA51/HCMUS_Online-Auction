import React from 'react';
import ProductCard from '../components/ProductCard';

const DemoPage = () => {
  const mockProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max - Quốc tế, Fullbox',
      starting_price: 20000000,
      current_price: 25000000,
      buy_now_price: 28000000,
      images: [
        'https://picsum.photos/400/400?random=1',
        'https://picsum.photos/400/400?random=2',
        'https://picsum.photos/400/400?random=3',
        'https://picsum.photos/400/400?random=4',
      ],
      end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra - Chính hãng',
      starting_price: 22000000,
      current_price: 24000000,
      buy_now_price: 26000000,
      images: [
        'https://picsum.photos/400/400?random=5',
        'https://picsum.photos/400/400?random=6',
        'https://picsum.photos/400/400?random=7',
      ],
      end_time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: 3,
      name: 'MacBook Pro 14" M3 Max - Hàng mới',
      starting_price: 35000000,
      current_price: 38000000,
      buy_now_price: 40000000,
      images: [
        'https://picsum.photos/400/400?random=8',
        'https://picsum.photos/400/400?random=9',
        'https://picsum.photos/400/400?random=10',
      ],
      end_time: new Date(Date.now() + 10 * 60 * 1000), // 10 phút
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>🛍️ Demo Sản Phẩm</h1>
      <p>Nhấp vào bất kỳ sản phẩm nào để xem trang chi tiết</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {mockProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default DemoPage;
