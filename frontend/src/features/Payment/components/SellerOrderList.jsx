import React, { useState } from 'react';
import useSellerOrders from '../hooks/useSellerOrders';
import PaymentVerification from './PaymentVerification';
import { Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function SellerOrderList() {
    const { orders, loading, error, confirmOrder, rejectOrder } = useSellerOrders();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3 h-3" /> Paid
                    </span>
                );
            case 'rejected':
                return (
                    <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="w-3 h-3" /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 py-10">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>Error: {error}</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-500 mt-1">Manage and verify payments from your buyers.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                        <p className="text-gray-500">You haven't sold any items yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Buyer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Placeholder image if not handling parsing yet */}
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                                    {order.product_images ? (
                                                        <img src={JSON.parse(order.product_images)[0]} alt="" className='w-full h-full object-cover' />
                                                    ) : (
                                                        <div className='w-full h-full bg-gray-200' />
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[200px]" title={order.product_name}>{order.product_name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{order.buyer_name}</p>
                                            <p className="text-xs text-gray-500">{order.buyer_email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">${Number(order.amount).toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {order.status !== 'pending' ? (
                                                    <button
                                                        disabled
                                                        className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-100 rounded-md cursor-not-allowed"
                                                    >
                                                        Closed
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Verify Payment
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedOrder && (
                <PaymentVerification
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onConfirm={confirmOrder}
                    onReject={rejectOrder}
                />
            )}
        </div>
    );
}
