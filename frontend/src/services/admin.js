export function getCategories() {
    return fetch("http://localhost:3000/categories/all", {
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
        console.error("Error fetching categories:", error);
        return {
            ok: false,
            message: "Failed to fetch categories"
        };
    });
}

export function getCategoryById(id) {
    return fetch(`http://localhost:3000/categories/${id}`, {
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