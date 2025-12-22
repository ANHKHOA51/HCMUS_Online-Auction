import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Đảm bảo bạn đã cài react-icons
import { useNavigate } from 'react-router-dom';
import useWatchlist from '../hooks/useWatchlist';
import './HeartButton.css'; // Nhớ import file CSS bên dưới

function HeartButton({ productId, initialState = false }) {
  const [isWatched, setIsWatched] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toggleWatch } = useWatchlist();

  const handleClick = async (e) => {
    e.preventDefault();
    // Ngăn sự kiện click lan ra ngoài (để không bị chuyển trang khi bấm tim)
    e.stopPropagation(); 

    const token = sessionStorage.getItem('accessToken');
    
    if (!token) {
      // Gợi ý: Thay alert bằng Toast message/Modal sẽ đẹp hơn
      if(window.confirm("Vui lòng đăng nhập để lưu sản phẩm!")) {
          navigate('/login');
      }
      return;
    }

    try {
      setLoading(true);
      
      const result = await toggleWatch(productId);
      // Nếu API trả về kết quả thực tế (trong trường hợp lỗi hoặc logic khác)
      setIsWatched(!isWatched);

    } catch (err) {
      console.error('Lỗi toggle watchlist:', err);
      // Revert lại nếu lỗi
      setIsWatched((prev) => !prev); 
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className={`heart-btn ${isWatched ? 'active' : ''}`}
      disabled={loading}
      title={isWatched ? "Bỏ lưu" : "Lưu sản phẩm"}
      type="button" // Quan trọng để không submit form nếu nằm trong form
    >
      {/* Thêm hiệu ứng scale nhẹ cho icon */}
      <span className="icon-wrapper">
        {isWatched ? <FaHeart /> : <FaRegHeart />}
      </span>
    </button>
  );
}

export default HeartButton;
