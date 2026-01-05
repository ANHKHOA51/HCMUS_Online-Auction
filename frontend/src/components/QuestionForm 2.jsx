import React, { useState } from 'react';
import './QuestionForm.css';
import { useAuth } from '../contexts/AuthContext';

const QuestionForm = ({ productId, onQuestionAdded, isLoading = false, sellerId = null }) => {
  const { cur_user } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isUserSeller = cur_user?.id === sellerId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cur_user) {
      setError('Vui lòng đăng nhập để đặt câu hỏi');
      return;
    }

    if (!content.trim()) {
      setError('Vui lòng nhập câu hỏi');
      return;
    }

    try {
      setError('');
      const result = await onQuestionAdded(content);
      
      if (result?.ok) {
        setSuccess('Câu hỏi đã được gửi thành công!');
        setContent('');
        
        // Clear messages after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        setError(result?.message || 'Lỗi khi gửi câu hỏi');
      }
    } catch (err) {
      setError('Lỗi: ' + (err.message || 'Không thể gửi câu hỏi'));
    }
  };

  if (!cur_user) {
    return (
      <div className="question-form-container">
        <div className="login-required-box">
          <p> Vui lòng đăng nhập để đặt câu hỏi</p>
        </div>
      </div>
    );
  }

  if (isUserSeller) {
    return (
      <div className="question-form-container">
        <div className="seller-notice-box">
          <p> Bạn là người bán sản phẩm này, không thể đặt câu hỏi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="question-form-container">
      <div className="question-form-header">
        <h4> Đặt câu hỏi</h4>
        <p className="form-description">Hỏi người bán về sản phẩm này</p>
      </div>

      <form onSubmit={handleSubmit} className="question-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Câu hỏi của bạn ở đây..."
          className="question-textarea"
          disabled={isLoading}
          rows="4"
        />

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}

        <div className="form-actions">
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi câu hỏi'}
          </button>
          
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setContent('')}
            disabled={!content.trim()}
          >
            Xóa
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
