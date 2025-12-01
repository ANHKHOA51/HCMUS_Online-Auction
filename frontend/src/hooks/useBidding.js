import { useState } from 'react';
import { formatPriceVN } from '../utils/formatCurrency';
import { productService } from '../services/product';

export const useBidding = (product) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  // Validate bid amount
  const validateBidAmount = () => {
    if (!bidAmount || parseFloat(bidAmount) <= 0) {
      setBidError('Vui lòng nhập số tiền hợp lệ');
      return false;
    }

    if (parseFloat(bidAmount) <= product.current_price) {
      setBidError(`Giá đặt phải cao hơn giá hiện tại: ${formatPriceVN(product.current_price)}`);
      return false;
    }

    setBidError(null);
    return true;
  };

  // Place bid
  const handlePlaceBid = async () => {
    if (!validateBidAmount()) return;

    try {
      setIsPlacingBid(true);
      // TODO: Replace with actual API call
      // const result = await productService.placeBid(product.id, bidAmount, token);
      console.log('Placing bid:', bidAmount);
      
      setBidSuccess(true);
      setBidAmount('');
      setTimeout(() => setBidSuccess(false), 3000);
    } catch (err) {
      setBidError('Lỗi khi đặt giá. Vui lòng thử lại.');
      console.error('Error placing bid:', err);
    } finally {
      setIsPlacingBid(false);
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    try {
      setIsPlacingBid(true);
      // TODO: Replace with actual API call
      // const result = await productService.buyNow(product.id, token);
      console.log('Buying now product:', product.id);
      
      setBidSuccess(true);
      setTimeout(() => setBidSuccess(false), 3000);
    } catch (err) {
      setBidError('Lỗi khi mua ngay. Vui lòng thử lại.');
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
    setBidAmount,
    isPlacingBid,
    bidError,
    bidSuccess,
    handlePlaceBid,
    handleBuyNow,
    clearMessages,
  };
};
