import { useState, useEffect, useCallback } from 'react';
import * as orderService from '../../../services/order';
import { useAuth } from '../../../contexts/AuthContext';

export default function useSellerOrders() {
    const { cur_user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async (silent = false) => {
        if (!cur_user?.id) return;
        if (!silent) setLoading(true);
        try {
            const res = await orderService.getSellerOrders(cur_user.id);
            if (res.ok) {
                setOrders(res.data);
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [cur_user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleConfirm = async (orderId, shippingCode) => {
        const res = await orderService.confirmOrder(orderId, shippingCode);
        if (res.ok) {
            await fetchOrders(true);
            return true;
        }
        alert(res.message || "Confirmation failed");
        return false;
    };

    const handleReject = async (orderId, note) => {
        const res = await orderService.rejectOrder(orderId, note);
        if (res.ok) {
            await fetchOrders(true);
            return true;
        }
        alert(res.message || "Rejection failed");
        return false;
    };

    return {
        orders,
        loading,
        error,
        refreshOrders: fetchOrders,
        confirmOrder: handleConfirm,
        rejectOrder: handleReject
    };
}
