import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Đảm bảo bạn đã cài react-icons
import { useNavigate } from 'react-router-dom';
import useWatchlist from '../hooks/useWatchlist';
// Đã xóa import './HeartButton.css';

function HeartButton({ productId, initialState = false, onToggle }) {
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
      const newState = !isWatched;
      setIsWatched(newState);
      
      if (onToggle) {
        onToggle(newState);
      }

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
      className={`appearance-none outline-none w-[36px] h-[36px] rounded-[50%] flex items-center justify-center border-[2px] border-solid border-[var(--ph-headline,#094067)] shadow-[2px_2px_0px_rgba(9,64,103,0.2)] text-[1.1rem] cursor-pointer transition-all duration-[200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] group disabled:opacity-[0.7] disabled:cursor-wait disabled:!transform-none hover:enabled:-translate-x-[2px] hover:enabled:-translate-y-[2px] hover:enabled:shadow-[4px_4px_0px_var(--ph-headline,#094067)] active:enabled:translate-x-0 active:enabled:translate-y-0 active:enabled:shadow-[1px_1px_0px_var(--ph-headline,#094067)] ${
        isWatched 
          ? 'bg-[var(--ph-tertiary,#ef4565)] text-[#fffffe] hover:enabled:bg-[#d63d5a]' 
          : 'bg-[var(--ph-bg,#fffffe)] text-[var(--ph-tertiary,#ef4565)] hover:enabled:bg-[#ffe3e3]'
      }`}
      disabled={loading}
      title={isWatched ? "Bỏ lưu" : "Lưu sản phẩm"}
      type="button" // Quan trọng để không submit form nếu nằm trong form
    >
      {/* Thêm hiệu ứng scale nhẹ cho icon */}
      <span className="flex transition-transform duration-[200ms] group-active:scale-[0.9]">
        {isWatched ? <FaHeart /> : <FaRegHeart />}
      </span>
    </button>
  );
}

export default HeartButton;
