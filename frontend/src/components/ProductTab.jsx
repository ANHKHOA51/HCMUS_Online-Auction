import React, { useState } from 'react';
import './ProductTab.css';
import QAHistory from './QAHistory';
import QuestionForm from './QuestionForm';
import BidHistory from './BidHistory';

const ProductTabs = ({ 
  product, 
  faqs, 
  questions = [],
  isAnswering = false,
  onAnswer = () => {},
  onAskQuestion = () => {},
  isAskingQuestion = false,
  currentUserId = null,
  sellerId = null
}) => {
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
          Hỏi đáp ({questions.length})
        </button>
         <button 
          className={`tab-btn ${activeTab === 'his' ? 'active' : ''}`}
          onClick={() => setActiveTab('his')}
        >
          Lịch sự đặt giá
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
             <QuestionForm 
               productId={product.id}
               onQuestionAdded={onAskQuestion}
               isLoading={isAskingQuestion}
               sellerId={sellerId}
             />
             <QAHistory 
               questions={questions}
               onAnswer={onAnswer}
               isAnswering={isAnswering}
               currentUserId={currentUserId}
               sellerId={sellerId}
             />
          </div>
        )}

        {activeTab === 'his' && (
          <div className="his-content">
            <BidHistory productId={product.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
