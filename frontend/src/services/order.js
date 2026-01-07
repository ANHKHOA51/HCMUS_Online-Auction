export const markOrderShipped = async (id, shippingInfo) => {
    try {
        const response = await axiosInstance.post(`/orders/confirm/${id}`, { shipping_info: shippingInfo });
        return { ok: true, data: response.data };
    } catch (error) {
        console.error("Error marking order shipped:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
};
import axiosInstance from './axiosInstance';

export const getWonOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders/won');
        // Standardize response format: API returns { success: true, data: [...] }
        return { ok: true, data: response.data.data };
    } catch (error) {
        console.error("Error fetching won orders:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
};

export const getOrderDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/orders/${id}`);
        return { ok: true, data: response.data.data };
    } catch (error) {
        console.error("Error fetching order details:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
};

export const payOrder = async (id, data) => {
    try {
        // data: { shipping_address, payment_method, note }
        const response = await axiosInstance.post(`/orders/pay/${id}`, data);
        return { ok: true, data: response.data };
    } catch (error) {
        console.error("Error paying order:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
};

export const getSellerOrders = async () => {
    try {
        const response = await axiosInstance.get('/orders/seller');
        return { ok: true, data: response.data.data };
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
};

export const confirmOrder = async (id, shippingInfo) => {
    try {
        const response = await axiosInstance.post(`/orders/confirm/${id}`, { shipping_info: shippingInfo });
        return { ok: true, data: response.data };
    } catch (error) {
        console.error("Error confirming order:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
}

export const markOrderDelivered = async (id) => {
    try {
        const response = await axiosInstance.post(`/orders/delivered/${id}`);
        return { ok: true, data: response.data };
    } catch (error) {
        console.error("Error marking order delivered:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
}

export const completeOrder = async (id) => {
    try {
        const response = await axiosInstance.post(`/orders/completed/${id}`);
        return { ok: true, data: response.data };
    } catch (error) {
        console.error("Error completing order:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
}

export const rejectOrder = async (id, note) => {
    try {
        const response = await axiosInstance.post(`/orders/reject/${id}`, { note });
        return { ok: true, data: response.data };
    } catch (error) {
        console.error("Error rejecting order:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
}

export const cancelOrder = async (id, reason) => {
    try {
        const response = await axiosInstance.post(`/orders/cancel/${id}`, { reason });
        return { ok: true, data: response.data };
    } catch (error) {
        console.error("Error cancelling order:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
}
export const uploadPaymentProof = async (id, payment_proof_url) => {
    try {
        const response = await axiosInstance.post(`/orders/${id}/upload-payment-proof`, { payment_proof_url });
        return { ok: true, data: response.data.data };
    } catch (error) {
        console.error("Error uploading payment proof:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
}

export const uploadShippingInvoice = async (id, shipping_invoice_url) => {
    try {
        const response = await axiosInstance.post(`/orders/${id}/upload-shipping-invoice`, { shipping_invoice_url });
        return { ok: true, data: response.data.data };
    } catch (error) {
        console.error("Error uploading shipping invoice:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
}

export const updatePaymentInfo = async (id, bankData) => {
    try {
        // bankData: { bank_name, account_number, account_holder, bank_code }
        const response = await axiosInstance.post(`/orders/${id}/payment-info`, bankData);
        return { ok: true, data: response.data.data };
    } catch (error) {
        console.error("Error updating payment info:", error);
        return { ok: false, message: error.response?.data?.message || error.message };
    }
}
