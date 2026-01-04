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
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getCategories();
            console.log("Fetched categories:", response);
            setCategories(response.data.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
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

        navigate('/admin/categories');
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

    const handleDeleteClick = function (cate) {
        setDeleteConfirm(cate);
    };

    const hideDeleteConfirmDialog = () => {
        setDeleteConfirm(null);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const response = await categoryService.deleteCategory(deleteConfirm.id);
            console.log("Category deleted:", response);
            // Optionally, you can refresh the categories list or provide feedback to the user
            navigate('/admin/categories');
        } catch (error) {
            console.error("Failed to delete category", error);
        }

        setDeleteConfirm(null);
        fetchCategories();
    };

    return {
        categories,
        category,
        error,
        handleSubmit,
        handleEdit,
        deleteConfirm,
        handleDeleteClick,
        hideDeleteConfirmDialog,
        handleDelete
    };
}