import { useState } from 'react';
import { formatPriceVN } from '../utils/formatCurrency';
import { productService } from '../services/product';
import { bidService } from '../services/bid';
import { useAuth } from '../contexts/AuthContext';

export const useBidding = (product) => {
  const { cur_user } = useAuth();
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  // Helper: Format number with dots (1.000.000)
  const formatNumber = (value) => {
    if (!value) return '';
    // Remove non-digits
    const rawValue = value.toString().replace(/\D/g, '');
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Helper: Parse formatted string back to number
  const parseNumber = (value) => {
    if (!value) return 0;
    return parseInt(value.toString().replace(/\./g, ''), 10);
  };

  const handleBidAmountChange = (e) => {
    const rawValue = e.target.value;
    // Prevent user from entering non-digits (except for dots which we handle)
    // Actually, input type="text" allows anything, so we strip non-digits in formatNumber
    setBidAmount(formatNumber(rawValue));
    setBidError(null); // Clear error on typing
  };

  // Validate bid amount
  const validateBidAmount = () => {
    if (!cur_user) {
      setBidError('Bạn cần đăng nhập để đấu giá');
      return false;
    }

    // 1. Check Rating > 80%
    const totalRatings = (cur_user.rating_positive || 0) + (cur_user.rating_negative || 0);
    if (totalRatings > 0) {
        const ratingScore = (cur_user.rating_positive || 0) / totalRatings;
        if (ratingScore < 0.8) {
            setBidError(`Điểm đánh giá của bạn thấp (${(ratingScore * 100).toFixed(1)}%). Cần tối thiểu 80% để đấu giá.`);
            return false;
        }
    }

    const amount = parseNumber(bidAmount);

    // 2. Check Valid Amount
    if (!amount || amount <= 0) {
      setBidError('Vui lòng nhập số tiền hợp lệ');
      return false;
    }

    const stepPrice = Number(product.step_price) || 100000; // Default step if missing
    const minBid = (Number(product.current_price) || Number(product.starting_price)) + stepPrice;

    if (amount < minBid) {
      setBidError(`Giá đặt phải tối thiểu là ${formatPriceVN(minBid)} (Giá hiện tại + Bước giá)`);
      return false;
    }

    setBidError(null);
    return true;
  };

  // Place bid
  const handlePlaceBid = async () => {
    if (!validateBidAmount()) return;

    const amount = parseNumber(bidAmount);

    // 3. Confirmation
    const confirmMsg = `Bạn có chắc chắn muốn đặt giá ${formatPriceVN(amount)} cho sản phẩm này?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      setIsPlacingBid(true);
      // Lấy token NGAY LÚC GỌI (không phải khi mount)
      const token = sessionStorage.getItem('accessToken');
      const result = await bidService.placeBid(product.id, amount, token);
      console.log('Placing bid:', amount);
      
      setBidSuccess(true);
      setBidAmount('');
      setTimeout(() => setBidSuccess(false), 3000);
      // Reload page to update data
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setBidError(err.response?.data?.error || 'Lỗi khi đặt giá. Vui lòng thử lại.');
      console.error('Error placing bid:', err);
    } finally {
      setIsPlacingBid(false);
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    if (!cur_user) {
        setBidError('Bạn cần đăng nhập để mua ngay');
        return;
    }
    
    if (!window.confirm(`Bạn có chắc chắn muốn MUA NGAY với giá ${formatPriceVN(product.buy_now_price)}?`)) return;

    try {
      setIsPlacingBid(true);
      const token = sessionStorage.getItem('accessToken');
      const result = await bidService.buyNow(product.id, token);
      console.log('Buying now product:', product.id);
      
      setBidSuccess(true);
      setTimeout(() => setBidSuccess(false), 3000);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setBidError(err.response?.data?.error || 'Lỗi khi mua ngay. Vui lòng thử lại.');
      console.error('Error buying now:', err);
    } finally {
      setIsPlacingBid(false);
    }
  };


  // Clear messages
  const clearMessages = () => {
    setBidError(null);
    setBidSuccess(false);
  };

  return {
    bidAmount,
    setBidAmount: handleBidAmountChange,
    isPlacingBid,
    bidError,
    bidSuccess,
    handlePlaceBid,
    handleBuyNow,
    clearMessages,
    formatNumber // Expose helper
  };
};
