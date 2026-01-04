import { Link } from 'react-router';
import { ArrowLeft, Trash2, Clock, Shield, User, Mail, Star, KeyRound } from 'lucide-react';
import { useUser } from '../hooks/useUser.jsx';
import { Form } from 'react-router-dom';
import { displayDate } from '../../../utils/formatDate';
import { useState } from 'react';

export default function UserDetail() {
    const { user, loading, error, handleUpdateRole, handleResetPassword, handleDelete, deleteConfirm, setDeleteConfirm } = useUser();
    const [isResetting, setIsResetting] = useState(false);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading user...</p>
            </div>
        );
    }

    const onResetPassword = async () => {
        if (confirm("Are you sure you want to reset this user's password? A new password will be sent to their email.")) {
            setIsResetting(true);
            await handleResetPassword();
            setIsResetting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12">
            {/* Header */}
            <div className="w-full max-w-6xl mb-8 px-4">
                <div className="flex items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-semibold text-[#1E293B] tracking-tight">
                            User Details
                        </h1>
                        <p className="text-[#64748B] mt-2">
                            View and manage user information
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="w-full max-w-6xl bg-white border border-[#E2E8F0] shadow-lg rounded-xl overflow-hidden">
                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Basic Info */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* User Profile Card */}
                            <div className="bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0] flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#64748B] text-3xl font-bold">
                                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-[#1E293B]">{user.full_name || 'N/A'}</h2>
                                    <p className="text-[#64748B] font-medium">@{user.username}</p>
                                    <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                        <Mail className="w-4 h-4" />
                                        {user.email}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Info */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider">Address</label>
                                    <div className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] font-medium">
                                        {user.address || 'No address provided'}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
                                            <Star className="w-4 h-4 text-green-500" /> Positive Ratings
                                        </label>
                                        <div className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] font-bold text-lg">
                                            {user.rating_positive || 0}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-2">
                                            <Star className="w-4 h-4 text-red-500" /> Negative Ratings
                                        </label>
                                        <div className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC] text-[#1E293B] font-bold text-lg">
                                            {user.rating_negative || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Role & Actions */}
                        <div className="space-y-6">

                            {/* ID & Role Card */}
                            <div className="bg-[#F1F5F9] p-6 rounded-xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#64748B]">
                                        <span className="text-sm font-bold uppercase">ID</span>
                                    </div>
                                    <span className="font-mono text-[#1E293B] font-bold">{user.id}</span>
                                </div>

                                <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
                                    <label className="text-xs text-[#64748B] font-semibold uppercase flex items-center gap-2">
                                        <Shield className="w-4 h-4" /> Role
                                    </label>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleUpdateRole(Number(e.target.value))}
                                        className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                                    >
                                        <option value={0}>Guest</option>
                                        <option value={1}>Bidder</option>
                                        <option value={2}>Seller</option>
                                        <option value={3}>Admin</option>
                                    </select>
                                    <p className="text-xs text-[#64748B]">Change user role immediately.</p>
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
                                        <label className="text-xs text-[#64748B] font-semibold uppercase">Joined At</label>
                                        <div className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md bg-[#F8FAFC] text-sm">
                                            {displayDate(user.created_at)}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-[#64748B] font-semibold uppercase">Last Update</label>
                                        <div className="w-full px-3 py-2 border border-[#E2E8F0] rounded-md bg-[#F8FAFC] text-sm">
                                            {displayDate(user.updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Actions */}
                            <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl space-y-4 shadow-sm">
                                <h3 className="flex items-center gap-2 text-[#1E293B] font-semibold border-b border-[#E2E8F0] pb-2">
                                    <KeyRound className="w-5 h-5 text-[#8B5CF6]" />
                                    Security
                                </h3>
                                <button
                                    onClick={onResetPassword}
                                    disabled={isResetting}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#3B82F6] text-[#3B82F6] font-medium rounded-lg hover:bg-[#EFF6FF] transition-colors disabled:opacity-50"
                                >
                                    {isResetting ? 'Resetting...' : 'Reset Password'}
                                </button>
                                <p className="text-xs text-[#64748B] text-center">Sends a new random password to user's email.</p>
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
                            to="/admin/users"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] font-medium transition-all duration-200 cursor-pointer rounded-lg shadow-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </Link>

                        <button
                            onClick={() => setDeleteConfirm(user)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium transition-all duration-200 cursor-pointer !rounded-lg shadow-md hover:shadow-lg"
                        >
                            <Trash2 className="w-5 h-5" />
                            Delete User
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
                                    Delete User
                                </h2>
                            </div>

                            <div className="px-6 py-6">
                                <p className="text-[#475569]">
                                    Are you sure you want to delete <span className="font-semibold text-[#1E293B]">"{deleteConfirm.full_name || deleteConfirm.username}"</span>?
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="bg-[#F8FAFC] px-6 py-4 flex justify-end gap-3 border-t border-[#E2E8F0]">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 border border-[#E2E8F0] bg-white text-[#64748B] font-medium !rounded-lg hover:bg-[#F1F5F9] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-[#EF4444] text-white font-medium !rounded-lg hover:bg-[#DC2626] transition-colors shadow-sm"
                                >
                                    Delete User
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
