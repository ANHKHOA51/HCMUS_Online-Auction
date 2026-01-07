import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getOrderDetails, 
    payOrder, 
    confirmOrder, 
    markOrderShipped, 
    markOrderDelivered,
    updatePaymentInfo 
} from '../services/order';
import { formatPriceVN } from '../utils/formatCurrency';
import { useAuth } from '../contexts/AuthContext';
import { FaCheckCircle, FaBox, FaTruck, FaMoneyBillWave, FaUpload, FaStore, FaUniversity, FaInfoCircle } from 'react-icons/fa';
import ReviewModal from './Profile/components/ReviewModal';

const CheckoutPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { cur_user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    // Form states cho Buyer
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('bank');
    const [paymentProofFile, setPaymentProofFile] = useState(null);
    const [paymentProofURL, setPaymentProofURL] = useState('');
    const [transactionId, setTransactionId] = useState('');
    
    // Form states cho Seller (Thông tin ngân hàng)
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    
    // Form states cho Seller (Giao hàng)
    const [shippingInvoiceFile, setShippingInvoiceFile] = useState(null);
    const [shippingInvoiceURL, setShippingInvoiceURL] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        try {
            const res = await getOrderDetails(orderId);
            if (res.ok) {
                const data = res.data;
                setOrder(data);
                if (data.status === 'pending') setStep(1);
                else if (data.status === 'paid') setStep(2);
                else if (data.status === 'shipped') setStep(3);
                else if (data.status === 'completed') setStep(4);
                
                if (data.shipping_address) setShippingAddress(data.shipping_address);
            }
        } catch (error) {
            console.error('Error loading order:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- XỬ LÝ FILE ---
    const handleFileChange = (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (type === 'payment') {
            setPaymentProofFile(file);
            setPaymentProofURL(URL.createObjectURL(file));
        } else {
            setShippingInvoiceFile(file);
            setShippingInvoiceURL(URL.createObjectURL(file));
        }
    };

    // --- ACTIONS NGƯỜI BÁN ---
    const handleSaveBankInfo = async () => {
        if (!bankName || !accountNumber || !accountHolder) return alert('Vui lòng nhập đủ STK!');
        setSubmitting(true);
        try {
            const res = await updatePaymentInfo(orderId, { bank_name: bankName, account_number: accountNumber, account_holder: accountHolder });
            if (res.ok) { alert('Đã gửi STK cho người mua!'); await loadOrder(); }
        } catch (err) { alert(err.message); } finally { setSubmitting(false); }
    };

    const handleSellerConfirmShipped = async () => {
        if (!trackingNumber) return alert('Vui lòng nhập mã vận đơn!');
        const formData = new FormData();
        formData.append('tracking_number', trackingNumber);
        if (shippingInvoiceFile) formData.append('shipping_proof', shippingInvoiceFile);

        setSubmitting(true);
        try {
            const res = await markOrderShipped(orderId, formData);
            if (res.ok) { alert('Đã xác nhận gửi hàng!'); await loadOrder(); }
        } catch (err) { alert(err.message); } finally { setSubmitting(false); }
    };

    // --- ACTIONS NGƯỜI MUA ---
    const handleBuyerSubmitPayment = async () => {
        if (!shippingAddress || !paymentProofFile || !transactionId) return alert('Vui lòng điền đủ thông tin & ảnh hóa đơn!');
        const formData = new FormData();
        formData.append('shipping_address', shippingAddress);
        formData.append('payment_proof', paymentProofFile);
        formData.append('transaction_id', transactionId);
        formData.append('payment_method', paymentMethod);

        setSubmitting(true);
        try {
            const res = await payOrder(orderId, formData);
            if (res.ok) { alert('Đã gửi bằng chứng thanh toán!'); await loadOrder(); }
        } catch (err) { alert(err.message); } finally { setSubmitting(false); }
    };

    const handleConfirmReceived = async () => {
        if (!window.confirm('Xác nhận đã nhận hàng?')) return;
        setSubmitting(true);
        try {
            const res = await markOrderDelivered(orderId);
            if (res.ok) { await loadOrder(); }
        } catch (err) { alert(err.message); } finally { setSubmitting(false); }
    };

    if (loading) return <div className="text-center p-20 font-black">LOADING...</div>;

    const isBuyer = cur_user?.id === order.buyer_id;
    const isSeller = cur_user?.id === order.seller_id;
    const bankInfo = order.payment_info ? JSON.parse(order.payment_info) : null;

    return (
        <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-10 font-sans text-[#2d3436]">
            {/* Progress Bar */}
            <div className="max-w-4xl mx-auto mb-10 flex justify-between relative bg-white p-6 rounded-2xl border-2 border-black shadow-[4px_4px_0px_black]">
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex flex-col items-center z-10 flex-1">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black transition-all ${s <= step ? 'bg-blue-500 text-white border-black' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                            {s < step ? '✓' : s}
                        </div>
                        <span className={`text-[10px] font-black mt-2 uppercase ${s <= step ? 'text-blue-600' : 'text-gray-400'}`}>
                            {s === 1 ? 'Thanh toán' : s === 2 ? 'Chuẩn bị' : s === 3 ? 'Giao hàng' : 'Hoàn tất'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Product Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-white p-5 border-2 border-black shadow-[4px_4px_0px_black] rounded-2xl sticky top-10">
                        <img src={order.product_images?.[0]} className="w-full aspect-square object-cover rounded-xl border-2 border-black mb-4" alt="product" />
                        <h2 className="font-black text-lg uppercase">{order.product_name}</h2>
                        <p className="text-2xl font-black text-blue-600 mt-2">{formatPriceVN(order.amount)}</p>
                        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 text-sm font-bold">
                            <p>Mã đơn: #{order.id}</p>
                            <p>Người bán: {order.seller_name}</p>
                        </div>
                    </div>
                </div>

                {/* Main Action Area */}
                <div className="md:col-span-2">
                    <div className="bg-white border-2 border-black shadow-[8px_8px_0px_black] rounded-2xl p-6 md:p-8 min-h-[500px]">
                        
                        {/* STEP 1: CUNG CẤP & THỰC HIỆN THANH TOÁN */}
                        {step === 1 && (
                            <div className="space-y-6">
                                {isSeller && !bankInfo && (
                                    <div className="space-y-4 animate-in fade-in duration-500">
                                        <h3 className="font-black text-xl uppercase flex items-center gap-2"><FaUniversity/> Nhập thông tin nhận tiền</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <input placeholder="Tên ngân hàng (Vd: VCB)" className="p-3 border-2 border-black rounded-lg font-bold outline-none focus:bg-yellow-50" value={bankName} onChange={e => setBankName(e.target.value)} />
                                            <input placeholder="Số tài khoản" className="p-3 border-2 border-black rounded-lg font-bold outline-none focus:bg-yellow-50" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
                                            <input placeholder="Tên chủ tài khoản" className="p-3 border-2 border-black rounded-lg font-bold outline-none focus:bg-yellow-50" value={accountHolder} onChange={e => setAccountHolder(e.target.value)} />
                                        </div>
                                        <button onClick={handleSaveBankInfo} disabled={submitting} className="w-full py-4 bg-black text-white font-black rounded-xl hover:bg-blue-600 transition-colors">GỬI CHO NGƯỜI MUA</button>
                                    </div>
                                )}

                                {isBuyer && (
                                    <div className="space-y-6">
                                        <h3 className="font-black text-xl uppercase flex items-center gap-2"><FaMoneyBillWave/> Thanh toán đơn hàng</h3>
                                        {!bankInfo ? (
                                            <div className="p-10 text-center border-2 border-dashed border-gray-300 rounded-2xl">
                                                <p className="font-bold text-gray-400 uppercase animate-pulse">Đang chờ người bán gửi thông tin chuyển khoản...</p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="p-5 bg-blue-50 border-2 border-blue-500 rounded-2xl shadow-[4px_4px_0px_#3b82f6]">
                                                    <p className="text-xs font-black text-blue-600 uppercase mb-2">Thông tin chuyển khoản:</p>
                                                    <p className="font-black text-lg">{bankInfo.bank_name}</p>
                                                    <p className="font-mono text-xl tracking-wider">{bankInfo.account_number}</p>
                                                    <p className="font-bold uppercase text-gray-600">{bankInfo.account_holder}</p>
                                                </div>
                                                <input placeholder="Địa chỉ giao hàng đầy đủ..." className="w-full p-3 border-2 border-black rounded-lg font-bold" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} />
                                                <input placeholder="Mã giao dịch (Transaction ID)" className="w-full p-3 border-2 border-black rounded-lg font-bold" value={transactionId} onChange={e => setTransactionId(e.target.value)} />
                                                <div className="border-2 border-dashed border-black p-6 rounded-2xl text-center">
                                                    {paymentProofURL ? <img src={paymentProofURL} className="max-h-48 mx-auto mb-2 border-2 border-black rounded-lg" /> : <FaUpload className="mx-auto text-3xl mb-2 text-gray-400" />}
                                                    <label className="font-black text-blue-600 cursor-pointer underline">
                                                        Tải ảnh hóa đơn <input type="file" hidden onChange={e => handleFileChange(e, 'payment')} />
                                                    </label>
                                                </div>
                                                <button onClick={handleBuyerSubmitPayment} disabled={submitting} className="w-full py-4 bg-blue-500 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_black] active:shadow-none transition-all">XÁC NHẬN ĐÃ CHUYỂN TIỀN</button>
                                            </>
                                        )}
                                    </div>
                                )}
                                {isSeller && bankInfo && <div className="text-center py-20 font-black text-gray-400 uppercase animate-pulse">Chờ người mua chuyển khoản & gửi hóa đơn...</div>}
                            </div>
                        )}

                        {/* STEP 2: CHUẨN BỊ HÀNG */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <h3 className="font-black text-xl uppercase flex items-center gap-2"><FaBox/> Chuẩn bị giao hàng</h3>
                                <div className="p-4 bg-gray-50 border-2 border-black rounded-xl font-bold text-sm">
                                    <p>📍 Địa chỉ: {order.shipping_address}</p>
                                    <p>🆔 Transaction ID: {order.transaction_id || 'N/A'}</p>
                                </div>
                                {isSeller ? (
                                    <>
                                        <div className="border-2 border-black p-2 rounded-xl bg-yellow-50">
                                            <p className="text-[10px] font-black p-2">HÓA ĐƠN NGƯỜI MUA GỬI:</p>
                                            <img src={order.payment_proof} className="w-full rounded-lg" alt="proof" />
                                        </div>
                                        <input placeholder="Nhập Mã Vận Đơn (Tracking Number)" className="w-full p-3 border-2 border-black rounded-lg font-bold" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} />
                                        <div className="border-2 border-dashed border-black p-4 rounded-xl text-center">
                                            {shippingInvoiceURL ? <img src={shippingInvoiceURL} className="max-h-32 mx-auto" /> : <p className="text-xs font-bold text-gray-400">Ảnh bưu kiện/vận đơn (nếu có)</p>}
                                            <label className="text-blue-600 font-black cursor-pointer text-xs underline block mt-2">
                                                Tải ảnh vận đơn <input type="file" hidden onChange={e => handleFileChange(e, 'ship')} />
                                            </label>
                                        </div>
                                        <button onClick={handleSellerConfirmShipped} disabled={submitting} className="w-full py-4 bg-black text-white font-black rounded-xl">XÁC NHẬN ĐÃ GỬI HÀNG</button>
                                    </>
                                ) : (
                                    <div className="text-center py-20 font-black text-blue-600 uppercase animate-bounce">Người bán đang đóng gói hàng...</div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: ĐANG GIAO HÀNG */}
                        {step === 3 && (
                            <div className="text-center py-10">
                                <FaTruck size={60} className="mx-auto text-blue-500 mb-6 animate-bounce" />
                                <h2 className="font-black text-2xl uppercase">Đang trên đường giao</h2>
                                <div className="mt-6 p-4 border-2 border-black inline-block rounded-xl bg-gray-50">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Mã vận đơn của bạn:</p>
                                    <p className="text-xl font-black tracking-widest">{order.tracking_number || 'Chưa có'}</p>
                                </div>
                                {isBuyer && (
                                    <button onClick={handleConfirmReceived} disabled={submitting} className="w-full mt-10 py-4 bg-green-500 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_black]">TÔI ĐÃ NHẬN ĐƯỢC HÀNG</button>
                                )}
                                {!isBuyer && (
                                    <div className="mt-10 p-4 bg-yellow-50 border-2 border-yellow-500 rounded-xl">
                                        <p className="font-black text-yellow-700">⚠️ Bạn không phải người mua của đơn hàng này</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 4: HOÀN TẤT & ĐÁNH GIÁ */}
                        {step === 4 && (
                            <div className="text-center space-y-8">
                                <FaCheckCircle size={80} className="mx-auto text-green-500" />
                                <h2 className="font-black text-3xl uppercase">Giao dịch thành công!</h2>
                                <div className="p-6 bg-yellow-50 border-2 border-black rounded-2xl">
                                    <p className="font-black mb-4 uppercase">⭐ Đánh giá đối phương</p>
                                    <button onClick={() => setShowReviewModal(true)} className="px-10 py-3 bg-white border-2 border-black font-black rounded-xl shadow-[4px_4px_0px_black] hover:shadow-none transition-all">VIẾT ĐÁNH GIÁ</button>
                                </div>
                                <button onClick={() => navigate('/')} className="font-black text-gray-400 underline uppercase">Quay về trang chủ</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showReviewModal && (
                <ReviewModal 
                    product={order}
                    onClose={() => setShowReviewModal(false)}
                    onSuccess={() => { setShowReviewModal(false); loadOrder(); }}
                />
            )}
        </div>
    );
};

export default CheckoutPage;
