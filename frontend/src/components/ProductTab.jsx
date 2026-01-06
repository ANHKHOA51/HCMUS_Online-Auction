import React, { useState, useRef } from 'react';
// Đã xóa import './ProductTab.css';
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

  // Class chung cho Button Tab
  const tabBtnBase = "flex-[0_1_auto] p-[12px_20px] bg-transparent border-none border-b-[3px] border-solid text-[15px] font-semibold cursor-pointer transition-all duration-[300ms] ease-out whitespace-nowrap";
  const tabBtnInactive = "border-transparent text-[var(--pg-paragraph,#5f6c7b)] hover:text-[var(--pg-headline,#094067)] hover:bg-[#f9f9f9]";
  const tabBtnActive = "text-[var(--pg-headline,#094067)] border-b-[var(--pg-highlight,#3da9fc)] bg-white";

  return (
    // .product-tabs + .card-box styles (kết hợp style từ file css và style card-box từ context trước)
    <div className="mt-[30px] bg-[var(--pg-main,#fffffe)] ml-auto w-full border-[3px] border-solid border-[var(--pg-stroke,#094067)] rounded-[16px] shadow-[6px_6px_0px_rgba(9,64,103,0.15)] overflow-hidden">
      
      {/* Tab Header */}
      <div className="flex border-b-[2px] border-solid border-[#eee] mb-[20px]">
        <button
          className={`${tabBtnBase} ${activeTab === 'description' ? tabBtnActive : tabBtnInactive}`}
          onClick={() => setActiveTab('description')}
        >
          Mô tả sản phẩm
        </button>
        <button
          className={`${tabBtnBase} ${activeTab === 'qa' ? tabBtnActive : tabBtnInactive}`}
          onClick={() => setActiveTab('qa')}
        >
          Hỏi đáp ({questions.length})
        </button>
        <button
          className={`${tabBtnBase} ${activeTab === 'his' ? tabBtnActive : tabBtnInactive}`}
          onClick={() => setActiveTab('his')}
        >
          Lịch sử đặt giá
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-[10px] min-h-[200px]">
        {activeTab === 'description' && (
          <div className="description-content">
            {/* .section-title (giữ style từ context trước: font size 20px, margin bottom 15px) */}
            <h4 className="text-[20px] font-bold mb-[15px] text-[var(--pg-headline,#094067)] flex items-center gap-[10px] before:content-[''] before:block before:w-[8px] before:h-[24px] before:bg-[var(--pg-tertiary,#ef4565)] before:rounded-[4px]">
              Chi tiết sản phẩm
            </h4>
            
            {/* Nội dung HTML description */}
            <div 
              className="text-[var(--pg-paragraph,#5f6c7b)] leading-[1.6]"
              dangerouslySetInnerHTML={{ __html: product.description }} 
            />

            {/* Append Description Section */}
            {currentUserId && sellerId && String(currentUserId) === String(sellerId) && (
              <div className="mt-[32px] border-t-[1px] border-solid border-[#e5e7eb] pt-[16px]">
                {!isAppending ? (
                  <button
                    className="bg-[#2563eb] text-white px-[16px] py-[8px] rounded-[4px] text-[14px] font-medium hover:bg-[#1d4ed8] transition-colors"
                    onClick={() => setIsAppending(true)}
                  >
                    + Thêm mô tả
                  </button>
                ) : (
                  <div className="mt-[16px]">
                    <h5 className="font-semibold mb-[8px] text-[14px] text-[#374151]">Thêm thông tin bổ sung:</h5>
                    <div className="bg-white border-[1px] border-solid border-[#e5e7eb] rounded-[6px] overflow-hidden">
                      <Editor ref={editorRef} />
                    </div>
                    <div className="flex gap-[8px] mt-[12px] justify-end">
                      <button
                        className="px-[12px] py-[6px] text-[14px] text-[#4b5563] border-[1px] border-solid border-[#e5e7eb] rounded-[4px] hover:bg-[#f9fafb]"
                        onClick={() => setIsAppending(false)}
                        disabled={loadingAppend}
                      >
                        Hủy
                      </button>
                      <button
                        className="px-[12px] py-[6px] text-[14px] bg-[#16a34a] text-white rounded-[4px] hover:bg-[#15803d] disabled:opacity-[0.5]"
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
