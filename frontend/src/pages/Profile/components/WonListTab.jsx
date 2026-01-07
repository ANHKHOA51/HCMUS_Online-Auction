import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWonOrders, markOrderDelivered } from '../../../services/order';
import CompactProductTable from '../../../components/CompactProductTable';
import { BiStar, BiTrophy, BiCheckDouble, BiCreditCard } from 'react-icons/bi';
import ReviewModal from './ReviewModal';

const ITEMS_PER_PAGE = 5;

const WonListTab = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchWonOrders();
    }, []);

    const fetchWonOrders = async () => {
        try {
            setLoading(true);
            const res = await getWonOrders();
            if (res.ok) {
                setOrders(res.data);
            } else {
                console.error('Error fetching won orders:', res);
            }
        } catch (err) {
            console.error('Error fetching won orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (images) => {
        // Handle both stringified JSON and array
        if (typeof images === 'string') {
             try { return JSON.parse(images)[0]; } catch(e) { return images; }
        }
        if (Array.isArray(images) && images.length > 0) return images[0];
        return 'https://via.placeholder.com/100';
    };

    const statusBadge = (status) => {
        switch(status) {
            case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-bold text-xs uppercase">Chờ thanh toán</span>;
            case 'paid': return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-bold text-xs uppercase">Đã thanh toán</span>;
            case 'shipped': return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded font-bold text-xs uppercase">Đã gửi hàng</span>;
            case 'completed': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-bold text-xs uppercase">Hoàn tất</span>;
            case 'cancelled': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-bold text-xs uppercase">Đã hủy</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-bold text-xs uppercase">{status}</span>;
        }
    };

    // --- XÁC NHẬN ĐÃ NHẬN HÀNG ---
    const handleConfirmReceived = async (orderId) => {
        if (!window.confirm('Xác nhận đã nhận hàng?')) return;
        const res = await markOrderDelivered(orderId);
        if (res.ok) {
            alert('Đã xác nhận nhận hàng!');
            fetchWonOrders();
        } else {
            alert(res.message || 'Có lỗi xảy ra!');
        }
    };

    // --- CẤU HÌNH CỘT (HAPPY HUES STYLE) ---
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
                            Người bán: {item.seller_name}
                        </div>
                    </div>
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
                    <BiTrophy className="text-yellow-600" />
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            header: 'Thao tác',
            render: (item) => (
                <div className="flex gap-2">
                    {item.status === 'pending' && (
                        <button
                            onClick={() => navigate(`/checkout/${item.id}`)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#3da9fc] text-white rounded-[6px] text-xs font-bold border-2 border-[#094067] shadow-[2px_2px_0px_#094067] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#094067] transition-all"
                        >
                            <BiCreditCard /> Thanh toán
                        </button>
                    )}
                    {item.status === 'shipped' && (
                        <button
                            onClick={() => handleConfirmReceived(item.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#38b000] text-white rounded-[6px] text-xs font-bold border-2 border-[#094067] shadow-[2px_2px_0px_#094067] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#094067] transition-all"
                        >
                            <BiCheckDouble /> Xác nhận đã nhận hàng
                        </button>
                    )}
                    {item.status === 'completed' && !item.is_rated && (
                        <button 
                            onClick={() => setSelectedProduct({ ...item, name: item.product_name, id: item.product_id })}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[var(--color-button)] text-[var(--color-button-text)] rounded-[6px] text-xs font-bold border-2 border-[var(--color-dark)] shadow-[2px_2px_0px_var(--color-dark)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--color-dark)] active:translate-y-0 active:shadow-[1px_1px_0px_var(--color-dark)] transition-all"
                        >
                            <BiStar /> Nhận xét
                        </button>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="bg-[var(--color-background)] rounded-xl border-2 border-[var(--color-dark)] shadow-[4px_4px_0px_var(--color-dark)] overflow-hidden">
            <div className="p-4 border-b-2 border-[var(--color-dark)] bg-[#e0f2fe]">
                <h3 className="text-lg font-black text-[var(--color-dark)] flex items-center gap-2 uppercase tracking-wide">
                    <BiCheckDouble className="text-2xl" /> 
                    Danh sách đơn hàng (Orders)
                </h3>
            </div>
            
            <div className="p-4">
                {loading ? (
                    <div className="text-center py-8 font-bold text-[var(--color-paragraph)]">Đang tải...</div>
                ) : (
                    <CompactProductTable 
                        data={orders} 
                        columns={columns}
                        pagination={{
                            currentPage,
                            totalPages: Math.ceil(orders.length / ITEMS_PER_PAGE),
                            onPageChange: setCurrentPage
                        }}
                        emptyMessage="Bạn chưa có đơn hàng nào."
                    />
                )}
            </div>

            {selectedProduct && (
                <ReviewModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                />
            )}
        </div>
    );
};

export default WonListTab;
