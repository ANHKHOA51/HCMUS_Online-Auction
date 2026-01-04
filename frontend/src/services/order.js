export function getSellerOrders(sellerId) {
    return fetch(`http://localhost:3000/orders/seller?seller_id=${sellerId}`, {
        method: "GET",
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            return {
                ok: true,
                data: data.data || [] // Ensure it returns an array
            };
        })
        .catch(error => {
            console.error("Error fetching seller orders:", error);
            return {
                ok: false,
                message: "Failed to fetch orders"
            };
        });
}

export function getBuyerOrders(buyerId) {
    return fetch(`http://localhost:3000/orders/buyer?buyer_id=${buyerId}`, {
        method: "GET",
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            return {
                ok: true,
                data: data.data || []
            };
        })
        .catch(error => {
            console.error("Error fetching buyer orders:", error);
            return {
                ok: false,
                message: "Failed to fetch orders"
            };
        });
}

export function confirmOrder(orderId, shippingCode) {
    return fetch(`http://localhost:3000/orders/confirm/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ shipping_info: shippingCode })
    })
        .then(response => response.json())
        .then(data => ({ ok: data.success, message: data.message }))
        .catch(error => {
            console.error("Error confirming order:", error);
            return { ok: false, message: error.message };
        });
}

export function rejectOrder(orderId, note) {
    return fetch(`http://localhost:3000/orders/reject/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ note })
    })
        .then(response => response.json())
        .then(data => ({ ok: data.success, message: data.message }))
        .catch(error => {
            console.error("Error rejecting order:", error);
            return { ok: false, message: error.message };
        });
}

export function rateBuyer(orderId, note) {
    return fetch(`http://localhost:3000/users/rate/${orderId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ note })
    })
        .then(response => response.json())
        .then(data => ({ ok: data.success, message: data.message }))
        .catch(error => {
            console.error("Error rating buyer:", error);
            return { ok: false, message: error.message };
        });
}
