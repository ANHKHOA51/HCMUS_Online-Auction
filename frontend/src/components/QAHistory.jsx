import React, { useState } from 'react';
import './QAHistory.css';
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
    <div className="qa-history-container">
      <div className="qa-header-main">
        <h3 className="section-title">💬 Hỏi đáp & Thảo luận</h3>
        <span className="qa-count">{questions.length} câu hỏi</span>
      </div>
      
      {questions && questions.length > 0 ? (
        <div className="qa-list">
          {questions.map((item) => {
            const isExpanded = expandedId === item.id;
            const canAnswerThis = isUserSeller && !item.answer; // Seller chưa trả lời
            
            return (
              <div key={item.id} className={`qa-item ${isExpanded ? 'active' : ''}`}>
                {/* --- PHẦN CÂU HỎI (Luôn hiện) --- */}
                <div 
                  className="qa-question-header" 
                  onClick={() => toggleExpand(item.id)}
                >
                  <div className="qa-icon-wrapper">
                    <FaQuestionCircle />
                  </div>
                  
                  <div className="qa-main-content">
                    <div className="qa-meta">
                        <span className="qa-user">{item.asker_name || 'Người mua ẩn danh'}</span>
                        <span className="qa-dot">•</span>
                        <span className="qa-date">
                             {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : 'Vừa xong'}
                        </span>
                    </div>
                    <h4 className="qa-text">{item.question}</h4>
                  </div>

                  <span className={`qa-toggle-btn ${isExpanded ? 'rotate' : ''}`}>
                    <FaChevronDown />
                  </span>
                </div>

                {/* --- PHẦN TRẢ LỜI (Xổ xuống) --- */}
                {isExpanded && (
                  <div className="qa-answer-container">
                    {item.answer ? (
                      <div className="qa-answer-box">
                        <div className="answer-badge">
                            <FaStore className="store-icon" /> Phản hồi từ {item.answerer_name || 'người bán'}
                        </div>
                        
                        <div className="answer-content">
                            <p className="answer-text">{item.answer}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Chỉ hiển thị "chưa trả lời" nếu không phải seller */}
                        {!isUserSeller && (
                          <div className="qa-no-answer">
                            <p>⏳ Người bán chưa trả lời câu hỏi này.</p>
                          </div>
                        )}

                        {/* Form trả lời chỉ hiển thị nếu user là seller và chưa trả lời */}
                        {canAnswerThis && (
                          <div className="qa-answer-form">
                            <textarea
                              placeholder="Nhập câu trả lời của bạn..."
                              value={answerText[item.id] || ''}
                              onChange={(e) => setAnswerText({ ...answerText, [item.id]: e.target.value })}
                              className="answer-textarea"
                            />
                            <button
                              onClick={() => handleAnswerSubmit(item.id)}
                              disabled={isAnswering || !answerText[item.id]?.trim()}
                              className="answer-submit-btn"
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
        <div className="qa-empty">
          <p>Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!</p>
        </div>
      )}
    </div>
  );
};

export default QAHistory;
