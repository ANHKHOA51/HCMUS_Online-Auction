import React, { useState } from 'react';
import useSellerOrders from '../hooks/useSellerOrders';
import PaymentVerification from './PaymentVerification';
import CancelOrderModal from './CancelOrderModal';
import { BiTruck, BiCheckCircle, BiXCircle, BiTime, BiShoppingBag } from 'react-icons/bi';
import { formatPriceVN } from '../../../utils/formatCurrency';
import { cancelOrder } from '../../../services/order';

const ITEMS_PER_PAGE = 5;

export default function SellerOrderList() {
    const { orders, loading, fetchOrders } = useSellerOrders();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancellingOrder, setCancellingOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleConfirmCancel = async (orderId, reason) => {
        const res = await cancelOrder(orderId, reason);
        if (res.ok) {
            fetchOrders();
        } else {
            alert(res.message);
        }
    };

    const getImageUrl = (images) => {
        if (Array.isArray(images) && images.length > 0) return images[0];
        if (typeof images === 'string') {
            try { return JSON.parse(images)[0]; } catch(e) { return images; }
        }
        return 'https://via.placeholder.com/100';
    };

    const statusBadge = (status) => {
        switch(status) {
            case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-bold text-xs uppercase">Chờ xác nhận</span>;
            case 'paid': return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-bold text-xs uppercase">Đã thanh toán</span>;
            case 'shipped': return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded font-bold text-xs uppercase">Đã gửi hàng</span>;
            case 'completed': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-bold text-xs uppercase">Hoàn tất</span>;
            case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-bold text-xs uppercase">Đã hủy</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-bold text-xs uppercase">{status}</span>;
        }
    };

    // --- CẤU HÌNH CỘT THEO HAPPY HUES STYLE ---
    const columns = [
        {
            header: 'Sản phẩm',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border-2 border-[var(--color-dark)] overflow-hidden flex-shrink-0 bg-white shadow-[2px_2px_0px_var(--color-dark)]">
                        <img 
                            src={getImageUrl(item.product_images)} 
                            alt={item.product_name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="text-[var(--color-dark)] font-bold truncate max-w-[200px]" title={item.product_name}>
                            {item.product_name}
                        </div>
                        <div className="text-xs text-[var(--color-paragraph)] font-medium">
                            Người mua: {item.buyer_name}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Giá',
            render: (item) => (
                <div className="text-[var(--color-dark)] font-bold">
                    {formatPriceVN(Number(item.amount))}
                </div>
            )
        },
        {
            header: 'Trạng thái',
            render: (item) => statusBadge(item.status)
        },
        {
            header: 'Thời gian',
            render: (order) => (
                <div className="flex items-center gap-1 text-[var(--color-paragraph)] font-medium">
                    <BiTime className="text-blue-600" />
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            header: 'Thao tác',
            render: (item) => (
                <div className="flex gap-2">
                    {item.status === 'paid' && (
                        <button
                            onClick={() => setSelectedOrder(item)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#3da9fc] text-white rounded-[6px] text-xs font-bold border-2 border-[#094067] shadow-[2px_2px_0px_#094067] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#094067] transition-all"
                        >
                            <BiTruck /> Gửi hàng
                        </button>
                    )}
                    {item.status === 'shipped' && (
                        <button
                            onClick={() => setSelectedOrder(item)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#a1c181] text-white rounded-[6px] text-xs font-bold border-2 border-[#2d5016] shadow-[2px_2px_0px_#2d5016] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#2d5016] transition-all"
                        >
                            <BiCheckCircle /> Xác nhận
                        </button>
                    )}
                    {item.status === 'pending' && (
                        <button
                            onClick={() => setCancellingOrder(item)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#ff6b9d] text-white rounded-[6px] text-xs font-bold border-2 border-[#c44569] shadow-[2px_2px_0px_#c44569] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#c44569] transition-all"
                        >
                            <BiXCircle /> Hủy
                        </button>
                    )}
                </div>
            )
        }
    ];

    const paginatedOrders = orders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="bg-[var(--color-background)] rounded-xl border-2 border-[var(--color-dark)] shadow-[4px_4px_0px_var(--color-dark)] overflow-hidden">
            <div className="p-4 border-b-2 border-[var(--color-dark)] bg-[#e0f2fe]">
                <h3 className="text-lg font-black text-[var(--color-dark)] flex items-center gap-2 uppercase tracking-wide">
                    <BiShoppingBag className="text-2xl" /> 
                    Quản lý Orders
                </h3>
            </div>
            
            <div className="p-4">
                {loading ? (
                    <div className="text-center py-8 font-bold text-[var(--color-paragraph)]">Đang tải...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-[var(--color-paragraph)]">
                        <BiShoppingBag className="text-4xl mx-auto mb-2 opacity-30" />
                        <p className="font-bold">Chưa có orders nào</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 border-b-2 border-[var(--color-dark)]">
                                    <tr>
                                        {columns.map((col, index) => (
                                            <th key={index} className="px-4 py-3 text-xs font-black text-[var(--color-dark)] uppercase tracking-wide">
                                                {col.header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedOrders.map((item, rowIndex) => (
                                        <tr key={item.id || rowIndex} className="border-b-2 border-[var(--color-dark)] last:border-b-0 hover:bg-blue-50 transition-colors bg-[var(--color-white)]">
                                            {columns.map((col, colIndex) => (
                                                <td key={colIndex} className="px-4 py-3">
                                                    {col.render(item)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {Math.ceil(orders.length / ITEMS_PER_PAGE) > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t-2 border-[var(--color-dark)]">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className="px-3 py-1 bg-[var(--color-button)] text-[var(--color-button-text)] border-2 border-[var(--color-dark)] rounded font-bold text-xs disabled:opacity-50"
                                >
                                    ← Trước
                                </button>
                                <span className="font-bold text-[var(--color-dark)]">
                                    Trang {currentPage} / {Math.ceil(orders.length / ITEMS_PER_PAGE)}
                                </span>
                                <button
                                    disabled={currentPage === Math.ceil(orders.length / ITEMS_PER_PAGE)}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="px-3 py-1 bg-[var(--color-button)] text-[var(--color-button-text)] border-2 border-[var(--color-dark)] rounded font-bold text-xs disabled:opacity-50"
                                >
                                    Sau →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedOrder && (
                <PaymentVerification
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onConfirm={() => {
                        fetchOrders();
                        setSelectedOrder(null);
                    }}
                />
            )}

            {cancellingOrder && (
                <CancelOrderModal
                    order={cancellingOrder}
                    onClose={() => setCancellingOrder(null)}
                    onConfirm={handleConfirmCancel}
                />
            )}
        </div>
    );
}
