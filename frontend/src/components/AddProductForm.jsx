import { formatPrice } from '../utils/formatCurrency'
import Editor from './Editor'
import { useState } from 'react';
import useAddProduct from '../hooks/product/useAddProduct';
import { useProducts } from '../hooks/useProduct';
import Dashboard from '@uppy/react/dashboard';
import '@uppy/core/css/style.min.css'
import '@uppy/dashboard/css/style.min.css'
import { NavLink } from 'react-router-dom'
import { FaCheck, FaArrowLeft } from 'react-icons/fa';

export default function AddProductForm() {
    const {
        uppy,
        quillRef,
        formData,
        price,
        errors,
        handleSubmit,
        onTextChange,
        onPriceChange,
        onPriceKeyDown,
    } = useAddProduct();

    const { categories } = useProducts()

    // Helper classes
    const inputClass = (error) => `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`;
    const labelClass = "block text-sm font-bold text-gray-700 mb-1";
    const errorClass = "text-red-500 text-xs mt-1 font-medium";

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-50 py-8'>
            <form className='w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200' id='addProductForm' onSubmit={handleSubmit}>
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">Thêm sản phẩm</h2>
                </div>
                
                <div className="p-8 space-y-6">
                    {/* Name */}
                    <div>
                        <label className={labelClass}>Tên sản phẩm</label>
                        <input type="text" className={inputClass(errors.name)} id="name" name="name"
                            onChange={onTextChange}
                            value={formData.name}
                            placeholder="Nhập tên sản phẩm..."
                        />
                        {errors.name && <div className={errorClass}>{errors.name}</div>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className={labelClass}>Loại sản phẩm</label>
                        <select
                            id="category_id"
                            name="category_id"
                            className={inputClass(errors.category_id)}
                            value={formData.category_id}
                            onChange={onTextChange}
                        >
                            <option value="">---Chọn loại sản phẩm---</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelClass}>Giá khởi điểm</label>
                            <div className="relative">
                                <input type="text"
                                    id="starting_price"
                                    name="starting_price"
                                    className={`${inputClass(errors.starting_price)} pr-8`}
                                    value={formatPrice(price.starting_price)}
                                    onChange={onPriceChange}
                                    onKeyDown={onPriceKeyDown}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500 font-bold">₫</span>
                            </div>
                            {errors.starting_price && <div className={errorClass}>{errors.starting_price}</div>}
                        </div>
                        <div>
                            <label className={labelClass}>Bước giá</label>
                            <div className="relative">
                                <input type="text" id="step_price" name="step_price"
                                    className={`${inputClass(errors.step_price)} pr-8`}
                                    value={formatPrice(price.step_price)}
                                    onChange={onPriceChange}
                                    onKeyDown={onPriceKeyDown}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500 font-bold">₫</span>
                            </div>
                            {errors.step_price && <div className={errorClass}>{errors.step_price}</div>}
                        </div>
                        <div>
                            <label className={labelClass}>Giá mua ngay</label>
                            <div className="relative">
                                <input type="text" id="buy_now_price" name="buy_now_price"
                                    className={`${inputClass(null)} pr-8`}
                                    value={formatPrice(price.buy_now_price)}
                                    onChange={onPriceChange}
                                    onKeyDown={onPriceKeyDown}
                                />
                                <span className="absolute right-3 top-2.5 text-gray-500 font-bold">₫</span>
                            </div>
                        </div>
                    </div>

                    {/* Times */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Thời gian bắt đầu</label>
                            <input type="datetime-local"
                                id="start_time"
                                name="start_time"
                                className={inputClass(errors.start_time)}
                                value={formData.start_time}
                                onChange={onTextChange}
                            />
                            {errors.start_time && <div className={errorClass}>{errors.start_time}</div>}
                        </div>
                        <div>
                            <label className={labelClass}>Thời gian kết thúc</label>
                            <input type="datetime-local" id="end_time" name="end_time"
                                className={inputClass(errors.end_time)}
                                value={formData.end_time}
                                onChange={onTextChange}
                            />
                            {errors.end_time && <div className={errorClass}>{errors.end_time}</div>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className={labelClass}>Mô tả</label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                             <Editor ref={quillRef} />
                        </div>
                    </div>

                    {/* Photos */}
                    <div>
                        <label className={labelClass}>Ảnh sản phẩm</label>
                        <input type="hidden" id="photos" name="photos" />
                        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                            <Dashboard uppy={uppy} width="100%" height="300px" />
                        </div>
                        {errors.photos && <div className={errorClass}>{errors.photos}</div>}
                    </div>

                    {/* Auto Extend */}
                    <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <input type="checkbox" id="auto_extend" name="auto_extend"
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                            checked={formData.auto_extend}
                            onChange={onTextChange} />
                        <label htmlFor="auto_extend" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer select-none">
                            Tự động gia hạn (Nếu có bid mới trong 5 phút cuối)
                        </label>
                    </div>

                    {/* General Error */}
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2" role="alert">
                            <span className="font-bold">Lỗi:</span> {errors.general}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <NavLink to="/admin/products" className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-all font-bold">
                        <FaArrowLeft /> Quay lại
                    </NavLink>
                    
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all font-bold">
                        <FaCheck /> Lưu sản phẩm
                    </button>
                </div>
            </form>
        </div>
    )
}

