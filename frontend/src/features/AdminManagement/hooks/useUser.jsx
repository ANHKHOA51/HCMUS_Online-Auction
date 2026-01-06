import { useEffect, useState } from "react";
import * as userService from "@/services/admin.js";
import { useNavigate, useParams } from "react-router-dom";

export function useUser() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('users'); // 'users' | 'requests'
    const [upgradeRequests, setUpgradeRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getUsers();
            if (response.ok) {
                 console.log("Fetched users:", response.data.data);
                 setUsers(response.data.data);
            } else {
                 setError(response.message || "Failed to fetch users");
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
            setError("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const fetchUpgradeRequests = async () => {
        setLoading(true);
        try {
            const response = await userService.getUpgradeRequests();
             if (response.ok) {
                 console.log("Fetched upgrade requests:", response.data);
                 setUpgradeRequests(response.data.data);
            } else {
                 setError(response.message || "Failed to fetch upgrade requests");
            }
        } catch (error) {
            console.error("Failed to fetch upgrade requests", error);
            setError("Failed to fetch upgrade requests");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserById = async () => {
        if (id) {
            setLoading(true);
            setError(null);
            try {
                const response = await userService.getUserById(id);
                if (response.ok) {
                    setUser(response.data.data);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleReject = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await userService.rejectUpgrade(id);
            console.log("Upgrade request rejected:", response.data);
            fetchUpgradeRequests();
        } catch (error) {
            console.error("Failed to reject upgrade request", error);
        }
    }

    const handleAccept = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const response = await userService.acceptUpgrade(id);
            console.log("Upgrade request accepted:", response.data);
            fetchUpgradeRequests();
        } catch (error) {
            console.error("Failed to accept upgrade request", error);
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log(deleteConfirm);
        if (!deleteConfirm?.id) return;

        setLoading(true);
        try {
            const response = await userService.deleteUser(deleteConfirm.id);
            console.log("User deleted:", response.data);

            // If we are on the list page, refresh the list
            if (!id && activeTab === 'users') {
                fetchUsers();
            } else {
                // If we are on detail page, navigate back
                navigate('/admin/users');
            }
        } catch (error) {
            console.error("Failed to delete user", error);
            setError("Failed to delete user");
        } finally {
            setLoading(false);
            setDeleteConfirm(null);
        }
    }

    const handleUpdateRole = async (newRole) => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await userService.updateUserRole(user.id, newRole);
            if (response.ok) {
                console.log("User role updated:", response);
                setUser(prev => ({ ...prev, role: newRole }));
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError(error.message || "Failed to update user role");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await userService.resetUserPassword(user.id);
            if (response.ok) {
                console.log("Password reset:", response);
                alert("Password has been reset successfully. New password sent to email.");
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError(error.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) {
            if (activeTab === 'users') {
                fetchUsers();
            } else if (activeTab === 'requests') {
                fetchUpgradeRequests();
            }
        }
    }, [activeTab, id]);

    useEffect(() => {
        fetchUserById();
    }, [id]);


    return {
        users,
        fetchUsers,
        upgradeRequests,
        fetchUpgradeRequests,
        activeTab,
        setActiveTab,
        handleReject,
        handleAccept,
        handleDelete,
        user,
        loading,
        error,
        deleteConfirm,
        setDeleteConfirm,
        handleUpdateRole,
        handleResetPassword
    };
}