import { MdPeopleAlt } from "react-icons/md";
import { BsPersonCheck } from "react-icons/bs";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { FaMoneyBill, FaCalendarAlt, FaClock } from "react-icons/fa";
import { BsEye } from "react-icons/bs";
import { RiAuctionLine } from "react-icons/ri";

import { formatPriceVN } from '../utils/formatCurrency';
import { formatDateVN } from '../utils/timeUtil';
//import { timeLeft } from '../utils/calcTimeLeft';
import { shouldShowRelativeTime } from "../utils/timeUtil";
import { getRelativeTime } from "../utils/timeUtil";

import { useNavigate } from 'react-router-dom';

import './style.css'

export default function ItemCard({ item }) {
    const navigate = useNavigate() 

    const handleClick = () => {
        navigate(`/product/${item.id}`);
    };

    return (
        <div className="card card-animation" style={{ width: "23rem" }} onClick ={handleClick}>
            <img className="card-img-top"
                style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                src={item.images && item.images[0] ? item.images[0] : '/default-product.png'} />
                alt={item.name}
            <div className="card-body">
                <h3 className="card-title text-center mb-0">{item.name}</h3>
                <div className='d-flex'>
                    <BsPersonCheck size={23} />
                    <h5 className="card-subtitle ms-2 text-muted fs-5 pt-1">{item.bidder}</h5>
                </div>
                <div className='d-flex mt-2 fs-6 justify-content-between pt-1'>
                    <div className='d-flex'>
                        <MdPeopleAlt size={23} />
                        <p className='ms-1'>{item.num_bid}</p>
                    </div>
                    <div className='ps-3 d-flex'>
                        <FaCalendarAlt size={20} />
                        <p className='ms-1'>{formatDateVN(item.start_time)}</p>
                    </div>
                    <div className='d-flex'>
                        <FaClock size={20} />
                        <p className='ms-1'>{shouldShowRelativeTime(item.end_time) ? getRelativeTime(item.end_time) : formatDateVN(item.end_time)}</p>
                    </div>
                </div>
                <div className='d-flex justify-content-between row'>
                    <div className='d-flex col-md-6 border border-dark border-end-0 pt-2 px-3'>
                        <FaMoneyBillTrendUp size={23} />
                        <h4 className='ps-2 fw-bold card-title text-danger'>{formatPriceVN(item.current_price)}</h4>
                    </div>
                    <div className='d-flex col-md-6 border border-dark pt-2 px-3' >
                        <FaMoneyBill className='pt-1' size={23} />
                        <h4 className='ps-2 fw-bold card-title text-danger'>{formatPriceVN(item.buy_now_price)}</h4>
                    </div>
                </div>
            </div>
            <div className='card-footer d-flex justify-content-end'>
                <button type="button" className="btn btn-outline-info me-2">
                    View Detail
                    <BsEye className='ms-1' />
                </button>
                <button type="button" className="btn btn-outline-success">
                    Bid
                    <RiAuctionLine className='ms-1' />
                </button>
            </div>
        </div>
    )
}
