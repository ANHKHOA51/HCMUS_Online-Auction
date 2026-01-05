import React from 'react';
import { BiShoppingBag } from 'react-icons/bi';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom';

const CompactProductTable = ({ 
    data = [], 
    loading = false, 
    columns = [], 
    emptyMessage = "Chưa có sản phẩm nào",
    pagination = null 
}) => {
    const navigate = useNavigate();

    // --- HAPPY HUES STYLES ---
    const hhStyles = {
        // Đã bỏ border, shadow, rounded để tránh bị lồng 2 lớp với component cha
        container: "w-full bg-[var(--color-white)]", 
        
        // Header giữ nguyên style
        tableHeader: "text-xs font-black text-[var(--color-dark)] uppercase bg-gray-100 border-b-2 border-[var(--color-dark)] tracking-wide",
        
        // Row giữ nguyên style
        row: "border-b-2 border-[var(--color-dark)] last:border-b-0 hover:bg-blue-50 transition-colors group bg-[var(--color-white)]",
        
        // Empty state giữ nguyên
        emptyState: "text-center py-10 flex flex-col items-center justify-center text-[var(--color-gray)] border-2 border-dashed border-[var(--color-dark)] rounded-xl bg-gray-50 m-4"
    };

    return (
        <div className={hhStyles.container}>
            {/* Nội dung bảng */}
            <div>
                {loading ? (
                    <div className="text-center py-12 text-[var(--color-gray)] font-bold animate-pulse text-sm">
                        ⏳ Đang tải dữ liệu...
                    </div>
                ) : data.length === 0 ? (
                    <div className={hhStyles.emptyState}>
                        <BiShoppingBag size={40} className="mb-2 opacity-50 text-[var(--color-dark)]" />
                        <p className="text-sm font-bold text-[var(--color-dark)]">{emptyMessage}</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className={hhStyles.tableHeader}>
                                    <tr>
                                        {columns.map((col, index) => (
                                            <th key={index} className={`px-4 py-3 ${col.className || ''}`}>
                                                {col.header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, rowIndex) => (
                                        <tr key={item.id || rowIndex} className={hhStyles.row}>
                                            {columns.map((col, colIndex) => (
                                                <td key={colIndex} className={`px-4 py-3 ${col.className || ''}`}>
                                                    {col.render(item)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination Section */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="p-4 bg-gray-50 border-t-2 border-[var(--color-dark)] flex justify-center">
                                <Pagination 
                                    currentPage={pagination.currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={pagination.onPageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CompactProductTable;
