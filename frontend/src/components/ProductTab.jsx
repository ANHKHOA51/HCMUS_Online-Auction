import React, { useState } from 'react';
import './ProductTab.css';
import QAHistory from './QAHistory';

const ProductTabs = ({ product, faqs }) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="product-tabs card-box">
      {/* Tab Header */}
      <div className="tabs-header">
        <button 
          className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Mô tả sản phẩm
        </button>
        <button 
          className={`tab-btn ${activeTab === 'qa' ? 'active' : ''}`}
          onClick={() => setActiveTab('qa')}
        >
          Hỏi đáp & Lịch sử ({faqs ? faqs.length : 0})
        </button>
         <button 
          className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
          onClick={() => setActiveTab('shipping')}
        >
          Chính sách vận chuyển
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'description' && (
          <div className="description-content">
            <h4 className="section-title">Chi tiết sản phẩm</h4>
            <p>{product.description}</p>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="qa-content">
             <QAHistory faqs={faqs} />
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="shipping-content">
            <h4 className="section-title">Thông tin vận chuyển</h4>
            <p>Sản phẩm được đóng gói kỹ lưỡng. Phí vận chuyển sẽ được tính toán dựa trên địa chỉ của người nhận.</p>
            {/* Bạn có thể thêm logic hiển thị phí ship thật ở đây */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
