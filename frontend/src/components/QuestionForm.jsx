import React, { useState } from 'react';
// Đã xóa import './QuestionForm.css';
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
      <div className="bg-white border-[2px] border-solid border-[var(--ph-stroke,#094067)] rounded-[12px] p-[20px] mb-[30px] max-[768px]:p-[15px]">
        <div className="bg-[linear-gradient(135deg,#fef3c7,#fde68a)] border-[2px] border-solid border-[#f59e0b] rounded-[8px] p-[15px] text-center text-[#92400e] font-semibold">
          <p className="m-0"> Vui lòng đăng nhập để đặt câu hỏi</p>
        </div>
      </div>
    );
  }

  if (isUserSeller) {
    return (
      <div className="bg-white border-[2px] border-solid border-[var(--ph-stroke,#094067)] rounded-[12px] p-[20px] mb-[30px] max-[768px]:p-[15px]">
        <div className="bg-[linear-gradient(135deg,#dbeafe,#bfdbfe)] border-[2px] border-solid border-[#3b82f6] rounded-[8px] p-[15px] text-center text-[#1e40af] font-semibold">
          <p className="m-0"> Bạn là người bán sản phẩm này, không thể đặt câu hỏi</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-[2px] border-solid border-[var(--ph-stroke,#094067)] rounded-[12px] p-[20px] mb-[30px] max-[768px]:p-[15px]">
      <div className="mb-[20px] pb-[15px] border-b-[2px] border-solid border-[var(--ph-secondary,#90b4ce)]">
        <h4 className="m-[0_0_8px_0] text-[18px] text-[var(--ph-heading,#094067)] font-bold"> Đặt câu hỏi</h4>
        <p className="m-0 text-[14px] text-[var(--ph-paragraph,#5f6c7b)] italic">Hỏi người bán về sản phẩm này</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[15px]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Câu hỏi của bạn ở đây..."
          className="w-full p-[12px] border-[2px] border-solid border-[var(--ph-stroke,#094067)] rounded-[8px] font-inherit font-extrabold text-[14px] leading-[1.5] resize-y transition-all duration-300 ease-out text-[var(--ph-heading,#094067)] bg-[var(--ph-bg,#fffffe)] focus:outline-none focus:border-[var(--ph-secondary,#90b4ce)] focus:bg-[#fafafa] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1)] disabled:bg-[#f5f5f5] disabled:cursor-not-allowed"
          disabled={isLoading}
          rows="4"
        />

        {error && <div className="bg-[#fee2e2] text-[#991b1b] p-[12px] rounded-[8px] border-l-[4px] border-solid border-[#dc2626] text-[14px] animate-[slideIn_0.3s_ease]">{error}</div>}
        {success && <div className="bg-[#dcfce7] text-[#166534] p-[12px] rounded-[8px] border-l-[4px] border-solid border-[#22c55e] text-[14px] animate-[slideIn_0.3s_ease]">{success}</div>}

        <div className="flex gap-[10px] justify-end max-[768px]:flex-col">
          <button
            type="submit"
            className="p-[10px_20px] border-none rounded-[8px] font-semibold text-[14px] cursor-pointer transition-all duration-300 ease-out bg-[var(--ph-secondary,#90b4ce)] text-white hover:enabled:bg-[var(--ph-accent-1,#3da9fc)] hover:enabled:-translate-y-[2px] hover:enabled:shadow-[0_4px_12px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed max-[768px]:w-full"
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi câu hỏi'}
          </button>
          
          <button
            type="button"
            className="p-[10px_20px] border-none rounded-[8px] font-semibold text-[14px] cursor-pointer transition-all duration-300 ease-out bg-[#e5e7eb] text-[var(--ph-heading,#094067)] hover:enabled:bg-[#d1d5db] disabled:opacity-50 disabled:cursor-not-allowed max-[768px]:w-full"
            onClick={() => setContent('')}
            disabled={!content.trim()}
          >
            Xóa
          </button>
        </div>
      </form>
      
      {/* Keyframes definition for slideIn animation if not present in global CSS */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default QuestionForm;
