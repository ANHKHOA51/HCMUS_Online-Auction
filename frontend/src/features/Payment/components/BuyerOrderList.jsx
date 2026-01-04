import React from 'react';
import useBuyerOrders from '../hooks/useBuyerOrders';
import { Eye, CheckCircle, XCircle, Clock, Truck } from 'lucide-react';
import { formatPrice } from '../../../utils/formatCurrency';

export default function BuyerOrderList() {
    const { orders, loading, error } = useBuyerOrders();

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
            case 'pending':
                return (
                    <span className="flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            default:
                return <span className="text-gray-500 text-xs">{status}</span>;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 py-10">
            <p>Error: {error}</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
                <p className="text-gray-500 mt-1">Theo dõi các sản phẩm bạn đã đấu giá thành công.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Chưa có đơn hàng</h3>
                        <p className="text-gray-500">Bạn chưa thắng đấu giá sản phẩm nào.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Seller</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shipping Info</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                                                    {(() => {
                                                        const getImage = (imgData) => {
                                                            if (!imgData) return null;
                                                            if (Array.isArray(imgData)) return imgData[0];
                                                            try {
                                                                const parsed = JSON.parse(imgData);
                                                                return Array.isArray(parsed) ? parsed[0] : parsed;
                                                            } catch (e) {
                                                                return imgData;
                                                            }
                                                        };
                                                        const imgSrc = getImage(order.product_images);

                                                        return imgSrc ? (
                                                            <img src={imgSrc} alt="" className='w-full h-full object-cover' />
                                                        ) : (
                                                            <div className='w-full h-full bg-gray-200' />
                                                        );
                                                    })()}
                                                </div>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[200px]" title={order.product_name}>{order.product_name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{order.seller_name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900">{formatPrice(Number(order.amount))} ₫</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.shipping_info ? (
                                                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                                                    <Truck className="w-4 h-4" />
                                                    <span className="font-medium text-sm">{order.shipping_info}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">Chưa có thông tin</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
