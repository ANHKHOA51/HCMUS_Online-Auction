import { useState, useEffect } from 'react';
import * as categoryService from '@/services/admin.js';
import { useNavigate, useParams } from "react-router-dom";

export default function useCategory() {
    // Your hook implementation here
    const [categories, setCategories] = useState([]);
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories from API or service
        async function fetchCategories() {
            try {
                const response = await categoryService.getCategories();
                console.log("Fetched categories:", response);
                setCategories(response.data.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        }

        fetchCategories();
    }, []);

    useEffect(() => {
        // Fetch category by ID from API or service
        async function fetchCategoryById() {
            if (id) {
                try {
                    const response = await categoryService.getCategoryById(id);
                    console.log("Fetched category by ID:", response);
                    setCategory(response.data.data);
                } catch (error) {
                    console.error("Failed to fetch category by ID", error);
                }
            }
        }

        fetchCategoryById();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();        
        e.stopPropagation();

        setError(null);

        // lấy dữ liệu từ Form
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name")?.trim() || "",
            parent_category_id: formData.get("parent_category_id") || "",
            description: formData.get("description")?.trim() || "",
        };

        // TODO: validate đơn giản
        if (!data.name) {
            setError("Category name is required");
            return;
        }

        try {
            const response = await categoryService.createCategory(data);
            console.log("Category created:", response);
        } catch (error) {
            console.error("Failed to create category", error);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();        // chặn submit mặc định (reload trang)
        e.stopPropagation();

        setError(null);

        // lấy dữ liệu từ Form
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name")?.trim() || "",
            parent_category_id: formData.get("parent_category_id") || "",
            description: formData.get("description")?.trim() || "",
        };
        if (!data.name) {
            setError("Category name is required");
            return;
        }

        try {
            const response = await categoryService.updateCategory(id, data);
            console.log("Category updated:", response);
            // Optionally, you can refresh the categories list or provide feedback to the user
            navigate('/admin/categories');
        } catch (error) {
            console.error("Failed to update category", error);
        }
    };

    return {
        categories,
        category,
        handleSubmit,
        handleEdit
    };
}