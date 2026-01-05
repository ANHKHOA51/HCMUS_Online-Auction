import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function CancelOrderModal({ order, onClose, onConfirm }) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) return;
        setIsSubmitting(true);
        await onConfirm(order.id, reason);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Hủy đơn hàng
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-gray-600 text-sm">
                        Bạn có chắc chắn muốn hủy đơn hàng <strong>{order.product_name}</strong> không? Hành động này không thể hoàn tác.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lý do hủy đơn <span className="text-red-500">*</span></label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 text-sm"
                            rows="3"
                            placeholder="Nhập lý do hủy..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                        >
                            Quay lại
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !reason.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 !rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isSubmitting ? 'Đang hủy...' : 'Xác nhận Hủy'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
