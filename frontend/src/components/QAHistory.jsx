import React, { useState } from 'react';
import './QAHistory.css';

const QAHistory = ({ faqs = [] }) => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="qa-history">
      <h4 className="section-title">📝 Câu hỏi và Trả lời</h4>
      
      {faqs && faqs.length > 0 ? (
        <div className="qa-list">
          {faqs.map((item, index) => (
            <div key={index} className="qa-item">
              <div
                className="qa-header"
                onClick={() => setExpandedId(expandedId === index ? null : index)}
              >
                <div className="qa-question">
                  <span className="qa-user">{item.user_name || 'Người mua'}</span>
                  <span className="qa-text">{item.question}</span>
                </div>
                <span className={`qa-toggle ${expandedId === index ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>

              {expandedId === index && (
                <div className="qa-content">
                  {item.answer ? (
                    <div className="qa-answer">
                      <span className="answer-label">Trả lời từ:</span>
                      <p className="answer-user">👤 {item.seller_name || 'Người bán'}</p>
                      <p className="answer-text">{item.answer}</p>
                      <small className="answer-time">
                        {item.answered_at ? new Date(item.answered_at).toLocaleDateString('vi-VN') : ''}
                      </small>
                    </div>
                  ) : (
                    <div className="qa-no-answer">
                      <p>Chưa có trả lời</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="qa-empty">
          <p>Chưa có câu hỏi nào</p>
        </div>
      )}
    </div>
  );
};

export default QAHistory;
