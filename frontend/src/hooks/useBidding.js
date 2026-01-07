// src/hooks/useBidding.js
import { useState } from 'react';
import { formatPriceVN } from '../utils/formatCurrency';
import { bidService } from '../services/bid';
import { useAuth } from '../contexts/AuthContext';

export const useBidding = (product, onBidSuccess = null) => {
  const { cur_user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  // State quản lý Modal xác nhận
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    isDanger: false
  });

  // ... (Giữ nguyên các hàm formatNumber, parseNumber, handleBidAmountChange) ...
  const formatNumber = (value) => {
    if (!value) return '';
    const rawValue = value.toString().replace(/\D/g, '');
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseNumber = (value) => {
    if (!value) return 0;
    return parseInt(value.toString().replace(/\./g, ''), 10);
  };

  const handleBidAmountChange = (e) => {
    const rawValue = e.target.value;
    setBidAmount(formatNumber(rawValue));
    setBidError(null);
  };
  // ... (Kết thúc giữ nguyên) ...

  const validateBidAmount = () => {
    if (!cur_user) {
      setBidError('Bạn cần đăng nhập để đấu giá');
      return false;
    }
    // ... (Giữ nguyên logic validate Rating như cũ) ...
    const totalRatings = (cur_user.rating_positive || 0) + (cur_user.rating_negative || 0);
    if (totalRatings > 0) {
        const ratingScore = (cur_user.rating_positive || 0) / totalRatings;
        if (ratingScore < 0.8) {
            setBidError(`Điểm đánh giá thấp (${(ratingScore * 100).toFixed(1)}%). Cần tối thiểu 80%.`);
            return false;
        }
    }

    const amount = parseNumber(bidAmount);
    if (!amount || amount <= 0) {
      setBidError('Vui lòng nhập số tiền hợp lệ');
      return false;
    }

    const stepPrice = Number(product.step_price) || 100000;
    const minBid = (Number(product.current_price) || Number(product.starting_price)) + stepPrice;

    if (amount < minBid) {
      setBidError(`Giá đặt phải tối thiểu là ${formatPriceVN(minBid)}`);
      return false;
    }
    return true;
  };

  // Hàm thực sự gọi API (sẽ được truyền vào onConfirm của Modal)
  const executePlaceBid = async (amount, isAutoBid) => {
    try {
      setIsPlacingBid(true);
      setConfirmModal(prev => ({ ...prev, isOpen: false })); // Đóng modal

      const result = await bidService.placeBid(product.id, amount, isAutoBid);
      console.log('Bid success:', result);
      
      setBidSuccess(true);
      setBidAmount('');
      
      if (onBidSuccess) setTimeout(() => onBidSuccess(), 800);
      setTimeout(() => setBidSuccess(false), 4500);
    } catch (err) {
      setBidError(err.response?.data?.error || 'Lỗi khi đặt giá. Vui lòng thử lại.');
    } finally {
      setIsPlacingBid(false);
    }
  };

  const executeBuyNow = async () => {
     try {
      setIsPlacingBid(true);
      setConfirmModal(prev => ({ ...prev, isOpen: false })); // Đóng modal

      const token = sessionStorage.getItem('accessToken');
      await bidService.buyNow(product.id, token);
      
      setBidSuccess(true);
      setTimeout(() => setBidSuccess(false), 3000);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setBidError(err.response?.data?.error || 'Lỗi khi mua ngay.');
    } finally {
      setIsPlacingBid(false);
    }
  };

  // Hàm kích hoạt Modal Đặt Giá
  const handlePlaceBid = (isAutoBid = true) => {
    if (!validateBidAmount()) return;
    const amount = parseNumber(bidAmount);

    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận đặt giá',
      message: `Bạn đang chọn chế độ: ${isAutoBid ? "TỰ ĐỘNG (Max Bid)" : "TRUYỀN THỐNG"}\n\nBạn có chắc chắn muốn đặt mức giá:\n${formatPriceVN(amount)}?`,
      onConfirm: () => executePlaceBid(amount, isAutoBid),
      isDanger: false
    });
  };

  // Hàm kích hoạt Modal Mua Ngay
  const handleBuyNow = () => {
    if (!cur_user) {
        setBidError('Bạn cần đăng nhập để mua ngay');
        return;
    }
    setConfirmModal({
      isOpen: true,
      title: 'Xác nhận Mua Ngay',
      message: `Bạn có chắc chắn muốn mua ngay sản phẩm này với giá:\n${formatPriceVN(product.buy_now_price)}?`,
      onConfirm: () => executeBuyNow(),
      isDanger: true // Màu đỏ để cảnh báo tiền lớn
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  return {
    bidAmount,
    setBidAmount: handleBidAmountChange,
    isPlacingBid,
    bidError,
    bidSuccess,
    handlePlaceBid,
    handleBuyNow,
    confirmModal,      // State modal để truyền xuống UI
    closeConfirmModal, // Hàm đóng modal
    formatNumber
  };
};
