import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';

export default function BuyerRating({ order, onClose, onSuccess }) {
    // This is a simplified rating, assuming we might call an API to update user rating
    // Since UserModel rating implementation wasn't detailed in the plan, 
    // we'll just show the UI and trigger onSuccess.

    // In a real implementation: call updateRating API here.

    const handleRate = async (isPositive) => {
        // TODO: Call API to rate user
        console.log(`Rated buyer ${order.buyer_id} ${isPositive ? 'Positive' : 'Negative'}`);

        // Mock success
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Rate Buyer</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-gray-600 mb-6 text-center">
                    How was your experience with <span className="font-semibold">{order.buyer_name}</span>?
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => handleRate(true)}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors"
                    >
                        <div className="p-3 bg-gray-100 rounded-full group-hover:bg-green-100 text-green-600">
                            <ThumbsUp className="w-8 h-8" />
                        </div>
                        <span className="font-medium">Positive</span>
                    </button>

                    <button
                        onClick={() => handleRate(false)}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <div className="p-3 bg-gray-100 rounded-full group-hover:bg-red-100 text-red-600">
                            <ThumbsDown className="w-8 h-8" />
                        </div>
                        <span className="font-medium">Negative</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
