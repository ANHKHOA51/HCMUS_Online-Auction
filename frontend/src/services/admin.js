import axiosInstance from './axiosInstance';

export function getCategories() {
    return axiosInstance.get("/categories/all")
        .then(response => {
            return {
                ok: true,
                data: response.data
            };
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
            return {
                ok: false,
                message: "Failed to fetch categories"
            };
        });
}

export function getCategoryById(id) {
    return axiosInstance.get(`/categories/${id}`)
        .then(response => {
            return {
                ok: true,
                data: response.data
            };
        })
        .catch(error => {
            console.error("Error fetching category by ID:", error);
            return {
                ok: false,
                message: "Failed to fetch category"
            };
        });
}

export function createCategory(categoryData) {
    return fetch("http://localhost:3000/categories/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(categoryData)
    })
        .then(response => response.json())
        .then(data => {
            return {
                ok: true,
                data: data
            };
        })
        .catch(error => {
            console.error("Error creating category:", error);
            return {
                ok: false,
                message: "Failed to create category"
            };
        });
}

export function updateCategory(id, categoryData) {
    return fetch(`http://localhost:3000/categories/edit/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(categoryData)
    })
        .then(response => response.json())
        .then(data => {
            return {
                ok: true,
                data: data
            };
        })
        .catch(error => {
            console.error("Error updating category:", error);
            return {
                ok: false,
                message: "Failed to update category"
            };
        });
}

export function deleteCategory(id) {
    return fetch(`http://localhost:3000/categories/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            return {
                ok: data.success,
                message: data.message,
                data: data
            };
        })
        .catch(error => {
            console.error("Error deleting category:", error);
            return {
                ok: false,
                message: "Failed to delete category"
            };
        });
}

// ... existing code ...
export function getProducts() {
    return fetch("http://localhost:3000/products", {
        method: "GET",
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            return {
                ok: true,
                data: data
            };
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            return {
                ok: false,
                message: "Failed to fetch products"
            };
        });
}

export function getProductById(id) {
    return fetch(`http://localhost:3000/products/${id}`, {
        method: "GET",
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            return {
                ok: true,
                data: data
            };
        })
        .catch(error => {
            console.error("Error fetching product by ID:", error);
            return {
                ok: false,
                message: "Failed to fetch product"
            };
        });
}

export function updateProduct(id, productData) {
    return fetch(`http://localhost:3000/products/edit/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(productData)
    })
        .then(response => response.json())
        .then(data => {
            return {
                ok: true,
                data: data
            };
        })
        .catch(error => {
            console.error("Error updating product:", error);
            return {
                ok: false,
                message: "Failed to update product"
            };
        });
}

export function deleteProduct(id) {
    return fetch(`http://localhost:3000/products/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            return {
                ok: true,
                data: data
            };
        })
        .catch(error => {
            console.error("Error deleting product:", error);
            return {
                ok: false,
                message: "Failed to delete product"
            };
        });
}

export function getUsers() {
    return axiosInstance.get("/users")
        .then(response => {
            return {
                ok: true,
                data: response.data
            };
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            return {
                ok: false,
                message: "Failed to fetch users"
            };
        });
}

export function getUpgradeRequests() {
    return axiosInstance.get("/users/bidder-requests")
        .then(response => {
            return {
                ok: true,
                data: response.data
            };
        })
        .catch(error => {
            console.error("Error fetching upgrade requests:", error);
            return {
                ok: false,
                message: "Failed to fetch upgrade requests"
            };
        });
}

export function acceptUpgrade(id) {
    return axiosInstance.post(`/users/accept-upgrade`, { id })
        .then(response => {
            return {
                ok: true,
                data: response.data
            };
        })
        .catch(error => {
            console.error("Error accepting upgrade:", error);
            return {
                ok: false,
                message: "Failed to accept upgrade"
            };
        });
}

export function rejectUpgrade(id) {
    return axiosInstance.post(`/users/reject-upgrade`, { id })
        .then(response => {
            return {
                ok: true,
                data: response.data
            };
        })
        .catch(error => {
            console.error("Error rejecting upgrade:", error);
            return {
                ok: false,
                message: "Failed to reject upgrade"
            };
        });
}

export function resetUserPassword(id) {
    return axiosInstance.post(`/users/reset-password`, { id })
        .then(response => {
            return {
                ok: true,
                data: response.data
            };
        })
        .catch(error => {
            console.error("Error resetting user password:", error);
            return {
                ok: false,
                message: "Failed to reset user password"
            };
        });
}

export function getUserById(id) {
    return axiosInstance.get(`/users/${id}`)
        .then(response => {
            return {
                ok: true,
                data: response.data
            };
        })
        .catch(error => {
            console.error("Error fetching user by ID:", error);
            return {
                ok: false,
                message: "Failed to fetch user"
            };
        });
}

export function updateUserRole(id, role) {
    return axiosInstance.post(`/users/update-role`, { id, role })
        .then(response => {
            return {
                ok: true,
                data: response.data
            };
        })
        .catch(error => {
            console.error("Error updating user role:", error);
            return {
                ok: false,
                message: "Failed to update user role"
            };
        });
}

export function deleteUser(id) {
    return axiosInstance.delete(`/users/delete/${id}`)
        .then(response => {
            return {
                ok: true,
                data: response.data
            };
        })
        .catch(error => {
            console.error("Error deleting user:", error);
            return {
                ok: false,
                message: "Failed to delete user"
            };
        });
}
