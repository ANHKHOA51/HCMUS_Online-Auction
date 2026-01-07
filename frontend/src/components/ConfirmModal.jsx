import React from 'react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = "Xác nhận", cancelLabel = "Hủy bỏ", isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-[rgba(9,64,103,0.6)] animate-fadeIn backdrop-blur-sm">
      <div className="bg-[#fffffe] w-full max-w-[400px] border-[3px] border-solid border-[#094067] rounded-[16px] shadow-[8px_8px_0px_rgba(9,64,103,0.2)] overflow-hidden animate-popIn">
        
        {/* Header */}
        <div className="bg-[#d8eefe] p-[20px] border-b-[2px] border-solid border-[#094067]">
          <h3 className="m-0 text-[20px] font-extrabold text-[#094067]">
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-[24px]">
          <p className="m-0 text-[16px] text-[#5f6c7b] leading-relaxed font-medium whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-[12px] p-[20px] bg-[#f8f9fa] border-t-[2px] border-solid border-[#094067]">
          <button
            onClick={onCancel}
            className="flex-1 py-[12px] px-[16px] bg-white text-[#094067] border-[2px] border-solid border-[#094067] rounded-[8px] font-bold text-[14px] cursor-pointer shadow-[2px_2px_0px_rgba(9,64,103,0.1)] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(9,64,103,0.1)] active:translate-y-0 active:shadow-none transition-all"
          >
            {cancelLabel}
          </button>
          
          <button
            onClick={onConfirm}
            className={`flex-1 py-[12px] px-[16px] text-white border-[2px] border-solid border-[#094067] rounded-[8px] font-bold text-[14px] cursor-pointer shadow-[2px_2px_0px_rgba(9,64,103,0.1)] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_rgba(9,64,103,0.1)] active:translate-y-0 active:shadow-none transition-all ${
              isDanger ? 'bg-[#ef4565]' : 'bg-[#3da9fc]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
