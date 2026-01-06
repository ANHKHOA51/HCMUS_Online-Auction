import React, { useState } from 'react';
// Đã xóa import './QAHistory.css';
import { FaQuestionCircle, FaStore, FaChevronDown } from 'react-icons/fa';

const QAHistory = ({ questions = [], onAnswer, isAnswering = false, currentUserId = null, sellerId = null }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [answerText, setAnswerText] = useState({});

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleAnswerSubmit = async (questionId) => {
    const answer = answerText[questionId];
    if (!answer || answer.trim() === '') return;

    const result = await onAnswer(questionId, answer);
    if (result?.ok) {
      setAnswerText({ ...answerText, [questionId]: '' });
      setExpandedId(null);
    }
  };

  const isUserSeller = currentUserId === sellerId;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-[20px] pb-[10px] border-b-[2px] border-dashed border-[var(--ph-secondary,#90b4ce)]">
        <h3 className="text-[20px] font-bold text-[var(--ph-headline,#094067)] m-0 flex items-center gap-[10px] before:content-[''] before:block before:w-[8px] before:h-[24px] before:bg-[var(--ph-tertiary,#ef4565)] before:rounded-[4px]">💬 Hỏi đáp & Thảo luận</h3>
        <span className="bg-[var(--ph-secondary,#90b4ce)] text-white px-[10px] py-[4px] rounded-[12px] text-[0.8rem] font-bold">{questions.length} câu hỏi</span>
      </div>
      
      {questions && questions.length > 0 ? (
        <div className="flex flex-col gap-0">
          {questions.map((item) => {
            const isExpanded = expandedId === item.id;
            const canAnswerThis = isUserSeller && !item.answer; // Seller chưa trả lời
            
            return (
              <div 
                key={item.id} 
                className={`bg-white border-[2px] border-solid rounded-[12px] mb-[16px] overflow-hidden transition-all duration-300 ease-out ${
                  isExpanded 
                    ? 'shadow-[6px_6px_0px_rgba(9,64,103,0.2)] -translate-x-[2px] -translate-y-[2px] border-[var(--ph-headline,#094067)]' 
                    : 'border-[var(--ph-stroke,#094067)] shadow-[2px_2px_0px_rgba(9,64,103,0.1)]'
                }`}
              >
                {/* --- PHẦN CÂU HỎI (Luôn hiện) --- */}
                <div 
                  className="p-[16px] flex items-start gap-[15px] cursor-pointer bg-white relative z-[2]" 
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="text-[var(--ph-secondary,#90b4ce)] text-[1.5rem] mt-[2px]">
                    <FaQuestionCircle />
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-[0.8rem] text-[var(--ph-paragraph,#5f6c7b)] mb-[4px] flex items-center gap-[6px]">
                        <span className="font-bold text-[var(--ph-headline,#094067)]">{item.asker_name || 'Người mua ẩn danh'}</span>
                        <span>•</span>
                        <span>
                             {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : 'Vừa xong'}
                        </span>
                    </div>
                    <h4 className="m-0 text-[1rem] font-semibold text-[#333] leading-[1.4]">{item.question}</h4>
                  </div>

                  <span className={`text-[var(--ph-paragraph,#5f6c7b)] transition-transform duration-300 text-[0.9rem] mt-[5px] ${isExpanded ? 'rotate-180 text-[var(--ph-button,#3da9fc)]' : ''}`}>
                    <FaChevronDown />
                  </span>
                </div>

                {/* --- PHẦN TRẢ LỜI (Xổ xuống) --- */}
                {isExpanded && (
                  <div className="border-t-[2px] border-solid border-[var(--ph-stroke,#094067)] animate-[slideDown_0.3s_ease-out_forwards]">
                    {item.answer ? (
                      <div className="bg-[#eef6fc] p-[20px] relative">
                        <div className="inline-flex items-center gap-[6px] bg-[var(--ph-button,#3da9fc)] text-white px-[12px] py-[4px] rounded-[20px] text-[0.75rem] font-bold mb-[10px] shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                            <FaStore className="text-[0.9rem]" /> Phản hồi từ {item.answerer_name || 'người bán'}
                        </div>
                        
                        <div className="pl-[10px] border-l-[3px] border-solid border-[var(--ph-secondary,#90b4ce)]">
                            <p className="text-[var(--ph-headline,#094067)] text-[0.95rem] leading-[1.5] mb-[8px]">{item.answer}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Chỉ hiển thị "chưa trả lời" nếu không phải seller */}
                        {!isUserSeller && (
                          <div className="bg-[#fff5f5] p-[20px] text-[var(--ph-paragraph,#5f6c7b)] text-center italic">
                            <p>⏳ Người bán chưa trả lời câu hỏi này.</p>
                          </div>
                        )}

                        {/* Form trả lời chỉ hiển thị nếu user là seller và chưa trả lời */}
                        {canAnswerThis && (
                          <div className="bg-[#f5f5f5] p-[15px] border-t-[1px] border-solid border-[var(--ph-stroke,#094067)] flex flex-col gap-[10px]">
                            <textarea
                              placeholder="Nhập câu trả lời của bạn..."
                              value={answerText[item.id] || ''}
                              onChange={(e) => setAnswerText({ ...answerText, [item.id]: e.target.value })}
                              className="w-full p-[10px] border-[2px] border-solid border-[var(--ph-stroke,#094067)] rounded-[8px] font-inherit font-semibold text-[var(--ph-heading,#094067)] bg-[var(--ph-bg,#fffffe)] text-[14px] min-h-[80px] resize-y transition-colors duration-300 ease-out focus:outline-none focus:border-[var(--ph-secondary,#90b4ce)] focus:bg-white"
                            />
                            <button
                              onClick={() => handleAnswerSubmit(item.id)}
                              disabled={isAnswering || !answerText[item.id]?.trim()}
                              className="self-start px-[16px] py-[8px] bg-[var(--ph-secondary,#90b4ce)] text-white border-none rounded-[8px] font-semibold cursor-pointer transition-all duration-300 ease-out hover:enabled:bg-[var(--ph-accent-1,#3da9fc)] hover:enabled:-translate-y-[2px] hover:enabled:shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isAnswering ? 'Đang gửi...' : 'Trả lời'}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-[40px] bg-[#f9f9f9] rounded-[12px] border-[2px] border-dashed border-[var(--ph-secondary,#90b4ce)] text-[var(--ph-paragraph,#5f6c7b)]">
          <p>Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!</p>
        </div>
      )}
      
      {/* Keyframes definition for slideDown animation if not present in global CSS */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default QAHistory;
