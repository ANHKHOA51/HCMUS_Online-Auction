import { useState } from "react";
import { Link, Form } from "react-router";
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import useCategory from "../hooks/useCategory.jsx";

export default function ListCategories() {
    // Mock data for UI preview
    const { categories, deleteConfirm, handleDeleteClick, hideDeleteConfirmDialog, handleDelete } = useCategory();

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-[#1E293B] tracking-tight">
                            Categories
                        </h1>
                        <p className="text-[#64748B] mt-2">
                            Manage your category list
                        </p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Link
                            to="/admin/categories/add"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg !rounded-lg"
                            aria-label="Add new category"
                        >
                            <Plus className="w-5 h-5" />
                            Add Category
                        </Link>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-[#E2E8F0] !rounded-lg overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
                                ID
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
                                Name
                            </th>
                            <th className="flex justify-end text-right px-10 py-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                        {categories.length > 0 ? (
                            categories.map(category => (
                                <tr
                                    key={category.id}
                                    className="group hover:bg-[#F8FAFC] transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 text-sm text-[#64748B] text-left">
                                        {category.id}
                                    </td>
                                    <td className="px-6 py-4 text-base text-[#1E293B] font-medium text-left">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {/* Edit Button */}
                                            <Link
                                                to={`/admin/categories/edit/${category.id}`}
                                                className="p-2 border border-[#E2E8F0] ! hover:bg-[#3B82F6] hover:border-[#3B82F6] text-[#64748B] hover:text-white transition-all duration-200"
                                                aria-label={`Edit ${category.name}`}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDeleteClick(category)}
                                                className="p-2 border border-[#E2E8F0] !rounded hover:bg-[#EF4444] hover:border-[#EF4444] text-[#64748B] hover:text-white transition-all duration-200"
                                                aria-label={`Delete ${category.name}`}
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
                                    colSpan="3"
                                    className="px-6 py-12 text-center text-[#94A3B8]"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Search className="w-8 h-8 text-[#CBD5E1]" />
                                        <span>No categories found</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white !rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                        {/* Modal Header */}
                        <div className="bg-[#EF4444] px-6 py-4 flex items-center gap-3">
                            <div className="p-2 bg-white/`20 !rounded-full">
                                <Trash2 className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">
                                Confirm Delete
                            </h2>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-6">
                            <p className="text-[#475569] text-base">
                                Are you sure you want to delete the category{' '}
                                <span className="font-semibold text-[#1E293B]">
                                    "{deleteConfirm.name}"
                                </span>
                                ?
                            </p>
                            <p className="text-[#94A3B8] text-sm mt-2">
                                This action cannot be undone.
                            </p>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-[#F8FAFC] px-6 py-4 flex items-center justify-end gap-3 border-t border-[#E2E8F0]">
                            <button
                                onClick={hideDeleteConfirmDialog}
                                className="px-4 py-2 border border-[#E2E8F0] bg-white text-[#64748B] font-medium !rounded-lg hover:bg-[#F1F5F9] transition-colors"
                            >
                                Cancel
                            </button>
                            <Form method="post" onSubmit={handleDelete}>
                                <input
                                    type="hidden"
                                    name="catid"
                                    value={deleteConfirm.id}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#EF4444] text-white font-medium !rounded-lg hover:bg-[#DC2626] transition-colors shadow-sm"
                                >
                                    Delete
                                </button>
                            </Form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}