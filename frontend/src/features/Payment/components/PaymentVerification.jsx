import React, { useState } from 'react';
import { X, Check, XCircle } from 'lucide-react';
import BuyerRating from './BuyerRating';

export default function PaymentVerification({ order, onClose, onConfirm, onReject }) {
    const [rejecting, setRejecting] = useState(false);
    const [rejectNote, setRejectNote] = useState('');
    const [showRating, setShowRating] = useState(false);

    const [shippingCode, setShippingCode] = useState('');

    const handleConfirmClick = async () => {
        if (!shippingCode.trim()) {
            alert("Vui lòng nhập mã vận đơn để người mua theo dõi.");
            return;
        }
        // Optimistic UI or wait for API
        const success = await onConfirm(order.id, shippingCode);
        if (success) {
            setShowRating(true);
        }
    };

    const handleRejectSubmit = async (e) => {
        e.preventDefault();
        await onReject(order.id, rejectNote);
        onClose();
    };

    const handleRatingSuccess = () => {
        setShowRating(false);
        onClose();
    };

    if (showRating) {
        return (
            <BuyerRating
                order={order}
                onClose={() => { setShowRating(false); onClose(); }}
                onSuccess={handleRatingSuccess}
            />
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg mx-4 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">Verify Payment</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</label>
                        <p className="font-medium text-gray-900">{order.product_name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Buyer</label>
                            <p className="text-sm text-gray-900">{order.buyer_name}</p>
                            <p className="text-xs text-gray-500">{order.buyer_email}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</label>
                            <p className="text-lg font-bold text-blue-600">${Number(order.amount).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                        <label className="text-xs font-semibold text-yellow-800 uppercase tracking-wider mb-1 block">Payment Info (From Buyer)</label>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{order.payment_info || "No details provided."}</p>
                    </div>

                    {/* Shipping Code Input */}
                    {!rejecting && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mã vận đơn / Thông tin giao hàng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                placeholder="Nhập mã vận đơn (VD: GHN-123456)"
                                value={shippingCode}
                                onChange={e => setShippingCode(e.target.value)}
                            />
                        </div>
                    )}

                    {rejecting && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
                                rows="3"
                                placeholder="E.g., Payment not received, Incorrect amount..."
                                value={rejectNote}
                                onChange={e => setRejectNote(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    {!rejecting ? (
                        <>
                            <button
                                onClick={() => setRejecting(true)}
                                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 !rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
                            >
                                Reject Payment
                            </button>
                            <button
                                onClick={handleConfirmClick}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 !rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                            >
                                <Check className="w-4 h-4" />
                                Confirm Payment
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setRejecting(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                disabled={!rejectNote.trim()}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 !rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <XCircle className="w-4 h-4" />
                                Confirm Rejection
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
