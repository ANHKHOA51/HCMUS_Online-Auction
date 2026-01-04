import { Link } from 'react-router';
import { ArrowLeft, Trash2, Clock, DollarSign, Tag, User, Hash } from 'lucide-react';
import useProduct from '../hooks/useProduct.jsx';
import { Form } from 'react-router-dom';
import { displayDate, getImageSrc } from '../../../utils/formatDate';

export default function ProductDetail() {
    const { product, handleDelete, error, loading, deleteConfirm, setDeleteConfirm } = useProduct();

    if (loading || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading product...</p>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12">
            {/* Header */}
            <div className="w-full max-w-6xl mb-8 px-4">
                <div className="flex items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-[#1E293B] tracking-tight">
                            Product Details
                        </h1>
                        <p className="text-[#64748B] mt-2">
                            View product information
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="w-full max-w-6xl bg-white border border-[#E2E8F0] shadow-lg rounded-xl overflow-hidden">
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Images & Key Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Images Gallery */}
                            <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                                <h3 className="text-sm font-bold text-[#64748B] uppercase tracking-wider mb-4">Product Images</h3>
                                {product.images && product.images.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {product.images.map((img, index) => (
                                            <div key={index} className="relative aspect-square bg-white rounded-md border border-[#E2E8F0] overflow-hidden group">
                                                <img
                                                    src={getImageSrc(img, product.id)}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-slate-400">No images available</div>
                                )}
                            </div>

                            {/* Main Text Fields */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider">Product Name</label>
                                    <div className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] font-medium text-lg">
                                        {product.name}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider">Description (HTML)</label>
                                    <div className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] font-mono text-sm min-h-[120px] whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: details, price, time */}
                        <div className="space-y-6">

                            {/* ID & Status Card */}
                            <div className="bg-[#F1F5F9] p-6 rounded-xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#64748B]">
                                        <Hash className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase">ID</span>
                                    </div>
                                    <span className="font-mono text-[#1E293B] font-bold">{product.id}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#64748B]">
                                        <Tag className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase">Status</span>
                                    </div>
                                    <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-sm font-medium text-[#1E293B] capitalize">
                                        {product.status || 'Active'}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#64748B]">
                                        <Tag className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase">Category</span>
                                    </div>
                                    <span className="font-medium text-[#1E293B]">{product.category_name}</span>
                                </div>
                            </div>

                            {/* Pricing Card */}
                            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4 shadow-sm">
                                <h3 className="flex items-center gap-2 text-[#1E293B] font-semibold border-b border-[#E2E8F0] pb-2">
                                    <DollarSign className="w-5 h-5 text-[#3B82F6]" />
                                    Pricing & Bids
                                </h3>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#64748B] font-semibold uppercase">Starting Price</label>
                                        <div className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md bg-[#F8FAFC]">
                                            {Number(product.starting_price).toLocaleString()} <span className="text-xs text-gray-500">VND</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#64748B] font-semibold uppercase">Buy Now Price</label>
                                        <div className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md bg-[#F8FAFC]">
                                            {product.buy_now_price ? Number(product.buy_now_price).toLocaleString() : 'N/A'} <span className="text-xs text-gray-500">VND</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed border-[#E2E8F0]">
                                        <div>
                                            <label className="text-xs text-[#64748B]">Current Highest</label>
                                            <p className="text-lg font-bold text-[#10B981]">{Number(product.current_price ?? 0).toLocaleString()} <span className="text-xs font-normal text-gray-500">VND</span></p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-[#64748B]">Total Bids</label>
                                            <p className="text-lg font-bold text-[#3B82F6]">{product.bid_count ?? 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timing Card */}
                            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4 shadow-sm">
                                <h3 className="flex items-center gap-2 text-[#1E293B] font-semibold border-b border-[#E2E8F0] pb-2">
                                    <Clock className="w-5 h-5 text-[#F59E0B]" />
                                    Timing
                                </h3>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#64748B] font-semibold uppercase">Start Time</label>
                                        <div className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md bg-[#F8FAFC] text-sm">
                                            {displayDate(product.start_time)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#64748B] font-semibold uppercase">End Time</label>
                                        <div className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md bg-[#F8FAFC] text-sm">
                                            {displayDate(product.end_time)}
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <label className="text-xs text-[#64748B]">Created At</label>
                                        <p className="text-sm text-[#1E293B]">{displayDate(product.created_at)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* People Card */}
                            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4 shadow-sm">
                                <h3 className="flex items-center gap-2 text-[#1E293B] font-semibold border-b border-[#E2E8F0] pb-2">
                                    <User className="w-5 h-5 text-[#8B5CF6]" />
                                    Participants
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-[#64748B] uppercase font-bold">Seller</label>
                                        <div className="flex justify-between items-center bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                                            <span className="text-sm font-medium">{product.seller_name}</span>
                                            <span className="text-xs text-slate-400">ID: {product.seller_id}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#64748B] uppercase font-bold">Winner</label>
                                        <div className="flex justify-between items-center bg-[#F8FAFC] p-2 rounded border border-[#E2E8F0]">
                                            <span className="text-sm font-medium">{product.winner_name || 'No winner yet'}</span>
                                            {product.winner_id && <span className="text-xs text-slate-400">ID: {product.winner_id}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {error && (
                        <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 flex items-center gap-2">
                            <span className="font-bold">Error:</span> {error}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-8 flex items-center justify-between border-t border-[#E2E8F0] pt-6">
                        <Link
                            to="/admin/products"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] font-medium transition-all duration-200 cursor-pointer rounded-lg shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </Link>

                        <button
                            onClick={() => setDeleteConfirm(product)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium transition-all duration-200 cursor-pointer !rounded-lg shadow-md hover:shadow-lg"
                        >
                            <Trash2 className="w-5 h-5" />
                            Delete Product
                        </button>
                    </div>
                </div>

                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                            <div className="bg-[#EF4444] px-6 py-4 flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <Trash2 className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-white">
                                    Delete Product
                                </h2>
                            </div>

                            <div className="px-6 py-6">
                                <p className="text-[#475569]">
                                    Are you sure you want to delete <span className="font-semibold text-[#1E293B]">"{deleteConfirm.name}"</span>and its related information?
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="bg-[#F8FAFC] px-6 py-4 flex justify-end gap-3 border-t border-[#E2E8F0]">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 border border-[#E2E8F0] bg-white text-[#64748B] font-medium rounded-lg hover:bg-[#F1F5F9] transition-colors"
                                >
                                    Cancel
                                </button>
                                <Form method="post" onSubmit={handleDelete}>
                                    <input type="hidden" name="id" value={deleteConfirm.id} />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#EF4444] text-white font-medium rounded-lg hover:bg-[#DC2626] transition-colors shadow-sm"
                                    >
                                        Delete Product
                                    </button>
                                </Form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
