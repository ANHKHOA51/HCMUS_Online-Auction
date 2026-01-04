import { useEffect, useState } from "react";
import * as productService from "@/services/admin.js";
import { useNavigate, useParams } from "react-router-dom";

export default function useProduct() {
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchProducts = () => {
        setLoading(true);
        setError(null);
        productService.getProducts()
            .then(response => {
                console.log(response);
                if (response.ok) {
                    setProducts(response.data.data || []);
                } else {
                    setError(response.message);
                }
            })
            .catch(error => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchProductById = () => {
        if (id) {
            setLoading(true);
            setError(null);
            productService.getProductById(id)
                .then(response => {
                    if (response.ok) {
                        setProduct(response.data.data.product);
                    } else {
                        setError(response.message);
                    }
                })
                .catch(error => {
                    setError(error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchProductById();
    }, [id]);

    const handleEdit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        setLoading(true);
        try {
            const response = await productService.updateProduct(id, data);
            if (response.ok) {
                console.log("Product updated:", response);
                navigate('/admin/products');
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError(error.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError(null);

        if (!deleteConfirm.id) return;

        setLoading(true);
        setError(null);
        try {
            const response = await productService.deleteProduct(deleteConfirm.id);
            if (response.ok) {
                console.log("Product deleted:", response);
                navigate('/admin/products');
            } else {
                setError(response.message);
            }
        } catch (error) {
            setError(error.message || "Failed to delete product");
        } finally {
            setLoading(false);
        }

        setDeleteConfirm(null);
        fetchProducts();
    };

    return {
        products,
        product,
        loading,
        error,
        fetchProducts,
        handleEdit,
        handleDelete,
        deleteConfirm,
        setDeleteConfirm
    };

}