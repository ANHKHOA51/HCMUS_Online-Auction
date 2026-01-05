import React, { useState, useRef } from 'react';
import './ProductTab.css';
import QAHistory from './QAHistory';
import QuestionForm from './QuestionForm';
import BidHistory from './BidHistory';
import Editor from './Editor';
import productService from '../services/product';

const ProductTabs = ({
  product,
  faqs,
  questions = [],
  isAnswering = false,
  onAnswer = () => { },
  onAskQuestion = () => { },
  isAskingQuestion = false,
  currentUserId = null,
  sellerId = null
}) => {
  const [activeTab, setActiveTab] = useState('description');
  const [isAppending, setIsAppending] = useState(false);
  const [loadingAppend, setLoadingAppend] = useState(false);
  const editorRef = useRef(null);

  const handleSaveDescription = async () => {
    if (!editorRef.current) return;

    const newContent = editorRef.current.root.innerHTML;
    // Basic check for empty content (Quill often returns <p><br></p>)
    if (!newContent || newContent === '<p><br></p>') return;

    setLoadingAppend(true);
    try {
      await productService.appendDescription(product.id, newContent);
      window.location.reload();
    } catch (error) {
      console.error("Failed to append description", error);
      alert("Failed to update description");
    } finally {
      setLoadingAppend(false);
      setIsAppending(false);
    }
  };

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
          Lịch sử đặt giá
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'description' && (
          <div className="description-content">
            <h4 className="section-title">Chi tiết sản phẩm</h4>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />

            {/* Append Description Section */}
            {currentUserId && sellerId && String(currentUserId) === String(sellerId) && (
              <div className="mt-8 border-t pt-4">
                {!isAppending ? (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
                    onClick={() => setIsAppending(true)}
                  >
                    + Thêm mô tả
                  </button>
                ) : (
                  <div className="append-editor mt-4">
                    <h5 className="font-semibold mb-2 text-sm text-gray-700">Thêm thông tin bổ sung:</h5>
                    <div className="bg-white border rounded-md overflow-hidden">
                      <Editor ref={editorRef} />
                    </div>
                    <div className="flex gap-2 mt-3 justify-end">
                      <button
                        className="px-3 py-1.5 text-sm text-gray-600 border rounded hover:bg-gray-50"
                        onClick={() => setIsAppending(false)}
                        disabled={loadingAppend}
                      >
                        Hủy
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        onClick={handleSaveDescription}
                        disabled={loadingAppend}
                      >
                        {loadingAppend ? 'Đang lưu...' : 'Lưu bổ sung'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
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
            <BidHistory
              productId={product.id}
              isSeller={currentUserId && sellerId && String(currentUserId) === String(sellerId)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
