import { useState } from "react";
import { Link, Form, useLoaderData } from "react-router";
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';

export default function ListProduct() {
    const data = useLoaderData();
    // Fallback to empty if no loader data yet (dev phase)
    const products = data?.products || [];

    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const handleDeleteClick = function (product) {
        setDeleteConfirm(product);
    };

    const hideDeleteConfirmDialog = () => {
        setDeleteConfirm(null);
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-[#1E293B] tracking-tight">
                            Products
                        </h1>
                        <p className="text-[#64748B] mt-2">
                            Manage your product catalog
                        </p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Link
                            to="/products/add-product"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg rounded-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </Link>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
                                ID
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
                                Product Name
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
                                Price
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
                                Category
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
                                Seller
                            </th>
                            <th className="flex justify-end text-right px-10 py-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="group hover:bg-[#F8FAFC] transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 text-sm text-[#64748B]">
                                        #{product.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.image && (
                                                <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover border border-[#E2E8F0]" />
                                            )}
                                            <span className="text-base font-medium text-[#1E293B]">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#64748B]">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#64748B]">
                                        {product.category}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#64748B]">
                                        {product.seller}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                to={`/admin/products/edit/${product.id}`}
                                                className="p-2 border border-[#E2E8F0] rounded hover:bg-[#3B82F6] hover:border-[#3B82F6] text-[#64748B] hover:text-white transition-all duration-200"
                                                title="Edit"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(product)}
                                                className="p-2 border border-[#E2E8F0] rounded hover:bg-[#EF4444] hover:border-[#EF4444] text-[#64748B] hover:text-white transition-all duration-200"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-12 text-center text-[#94A3B8]"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Search className="w-8 h-8 text-[#CBD5E1]" />
                                        <span>No products found</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Modal */}
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
                                Are you sure you want to delete <span className="font-semibold text-[#1E293B]">"{deleteConfirm.name}"</span>?
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="bg-[#F8FAFC] px-6 py-4 flex justify-end gap-3 border-t border-[#E2E8F0]">
                            <button
                                onClick={hideDeleteConfirmDialog}
                                className="px-4 py-2 border border-[#E2E8F0] bg-white text-[#64748B] font-medium rounded-lg hover:bg-[#F1F5F9] transition-colors"
                            >
                                Cancel
                            </button>
                            <Form method="post" onSubmit={hideDeleteConfirmDialog}>
                                <input type="hidden" name="intent" value="delete" />
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
    );
}
