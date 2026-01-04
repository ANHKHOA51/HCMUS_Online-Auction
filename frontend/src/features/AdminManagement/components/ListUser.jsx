import { useState } from "react";
import { Link, Form, useLoaderData } from "react-router";
import {
    Users,
    UserCheck,
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
    Search
} from 'lucide-react';
import { useUser } from "../hooks/useUser";
import { displayDate } from '../../../utils/formatDate';

const mappingRole = {
    0: 'Guest',
    1: 'Bidder',
    2: 'Seller',
    3: 'Admin',
};

export default function ListUser() {
    const data = useLoaderData();
    const { users, upgradeRequests, activeTab, setActiveTab, handleAccept, handleReject, deleteConfirm, setDeleteConfirm, handleDelete } = useUser();
    console.log('upgradeRequests', upgradeRequests)
    const [selectedUser, setSelectedUser] = useState(null); // For modals

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-[#1E293B] tracking-tight">
                    User Management
                </h1>
                <p className="text-[#64748B] mt-2">
                    Manage system users and seller upgrade requests
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E2E8F0] mb-6">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'users'
                        ? 'text-[#3B82F6]'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        All Users
                    </div>
                    {activeTab === 'users' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('requests')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'requests'
                        ? 'text-[#3B82F6]'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Upgrade Requests
                        {upgradeRequests.length > 0 && (
                            <span className="bg-[#EF4444] text-white text-xs px-2 py-0.5 rounded-full">
                                {upgradeRequests.length}
                            </span>
                        )}
                    </div>
                    {activeTab === 'requests' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3B82F6]" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm">
                {activeTab === 'users' ? (
                    <UsersTable users={users} setDeleteConfirm={setDeleteConfirm} />
                ) : (
                    <RequestsTable
                        requests={upgradeRequests}
                        onSelect={setSelectedUser}
                        handleAccept={handleAccept}
                        handleReject={handleReject}
                    />
                )}
            </div>

            {/* Simplified Modal Logic (Placeholder for real implementation) */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    {/* Modal content would go here depending on action type */}
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                        <h3 className="text-lg font-bold mb-2">Confirm Action</h3>
                        <p className="text-gray-600 mb-4">Are you sure you want to delete user {deleteConfirm.name}?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border border-[#E2E8F0] bg-white text-[#64748B] font-medium !rounded-lg !hover:bg-[#F1F5F9] transition-colors shadow-sm">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-[#EF4444] text-white font-medium !rounded-lg hover:bg-[#DC2626] transition-colors shadow-sm">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function UsersTable({ users, setDeleteConfirm }) {
    return (
        <table className="w-full">
            <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Role</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                    <th className="flex justify-end text-right px-10 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
                {users.length > 0 ? (
                    users.map((user) => (
                        <tr key={user.id} className="hover:bg-[#F8FAFC]">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#64748B] font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-[#1E293B]">{user.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#64748B]">{user.email}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                    user.role === 'seller' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {mappingRole[user.role]}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <Link to={`/admin/users/edit/${user.id}`} className="p-2 border border-[#E2E8F0] rounded hover:bg-[#3B82F6] hover:border-[#3B82F6] text-[#64748B] hover:text-white transition-all duration-200" title="Edit details">
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <button className="p-2 border border-[#E2E8F0] rounded hover:bg-[#EF4444] hover:border-[#EF4444] text-[#64748B] hover:text-white transition-all duration-200" title="Delete User"
                                        onClick={() => setDeleteConfirm(user)}>
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-[#94A3B8]">
                            No users found
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

function RequestsTable({ requests, onSelect, handleAccept, handleReject }) {

    return (
        <table className="w-full">
            <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">User</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Request Date</th>
                    {/* <th className="text-left px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Reason</th> */}
                    <th className="flex justify-end text-right px-10 py-4 text-sm font-semibold text-[#64748B] uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <tr key={req.id} className="hover:bg-[#F8FAFC]">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#64748B] font-bold">
                                        {req.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-[#1E293B]">{req.name}</div>
                                        <div className="text-xs text-[#64748B]">{req.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#64748B]">{displayDate(req.created_at)}</td>
                            {/* <td className="px-6 py-4 text-sm text-[#64748B] max-w-xs truncate">{req.reason}</td> */}
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Form method="post" className="inline"
                                        onSubmit={(e) => handleAccept(e, req.id)}>
                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-white !rounded-md text-sm transition-colors duration-200 shadow-sm">
                                            <CheckCircle className="w-4 h-4" />
                                            Approve
                                        </button>
                                    </Form>
                                    <Form method="post" className="inline"
                                        onSubmit={(e) => handleReject(e, req.id)}>
                                        <button className="flex items-center gap-1 px-3 py-1.5 border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white !rounded-md text-sm transition-colors duration-200">
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </Form>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-[#94A3B8]">
                            No pending requests
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
