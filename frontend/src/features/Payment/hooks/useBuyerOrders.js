import { useState, useEffect, useCallback } from 'react';
import * as orderService from '../../../services/order';
import { useAuth } from '../../../contexts/AuthContext';

export default function useBuyerOrders() {
    const { cur_user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        if (!cur_user?.id) return;
        setLoading(true);
        try {
            const res = await orderService.getBuyerOrders(cur_user.id);
            if (res.ok) {
                setOrders(res.data);
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [cur_user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        loading,
        error,
        refreshOrders: fetchOrders
    };
}
