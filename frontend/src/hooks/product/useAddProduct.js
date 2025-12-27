
import { useNavigate } from "react-router-dom";
import { parsePriceVN } from "../../utils/formatCurrency";
import { useRef, useState } from "react";
import productService from "../../services/product";

import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'

export default function useAddProduct() {
    const quillRef = useRef();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category_id: null,
        auto_extend: false,
        start_time: '',
        end_time: '',
    })

    const [price, setPrice] = useState({
        starting_price: '',
        step_price: '',
        buy_now_price: '',
    })

    const photosRef = useRef([]);
    const [uppy] = useState(() =>
        new Uppy({
            restrictions: {
                allowedFileTypes: ['image/*'],
            }
        })
            .use(XHRUpload, {
                endpoint: 'http://localhost:3000/products/upload',
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
                },
                formData: true,
                fieldName: 'photos'
            })
            .on('upload-success', (file, response) => {
                const photo = response.body.files[0];
                if (photo) {
                    photosRef.current.push(photo.filename);
                }
            })
    );

    const [errors, setErrors] = useState({});
    const navigate = useNavigate()

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name || formData.name.trim() === '') {
            newErrors.name = 'Vui lòng nhập tên sản phẩm';
        }

        if (!formData.start_time) {
            newErrors.start_time = "Vui lòng chọn ngày bắt đầu";
        }

        if (!formData.end_time) {
            newErrors.end_time = "Vui lòng chọn ngày kết thúc";
        } else if (formData.start_time && new Date(formData.end_time) <= new Date(formData.start_time)) {
            newErrors.end_time = "Ngày kết thúc phải sau ngày bắt đầu";
        }

        if (photos.length < 3) {
            newErrors.photos = "Vui lòng chọn ít nhất 3 ảnh";
        }

        if (!price.starting_price) {
            newErrors.starting_price = "Vui lòng nhập giá khởi điểm";
        }

        if (!price.step_price) {
            newErrors.step_price = "Vui lòng nhập bước giá";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const onTextChange = (e) => {
        setErrors({});
        const { id, value, type, checked } = e.target;

        const val = (type === 'checkbox') ? checked : value;

        setFormData({
            ...formData,
            [id]: val,
        });
    };

    const onPriceChange = (e) => {
        const { id, value } = e.target;
        const rawValue = parsePriceVN(value);

        setPrice({
            ...price,
            [id]: rawValue,
        });
    };

    const onPriceKeyDown = (e) => {
        if (!/[0-9]/.test(e.key)
            && e.key !== "Backspace"
            && e.key !== "Delete"
            && e.key !== "ArrowLeft"
            && e.key !== "ArrowRight") {
            e.preventDefault();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!validateForm()) {
            return;
        }

        let description = quillRef.current?.root.innerHTML || '';

        if (description === '<p><br></p>') {
            description = '';
        }

        const data = {
            ...formData,
            ...price,
            images: photosRef.current,
            description: description,
        }
        console.log(data);
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await productService.addProduct(data, token);
            navigate('/');
        } catch (error) {
            setErrors({
                ...errors,
                general: error.message,
            })
        } finally {
            setLoading(false);
        }
    };

    return {
        uppy,
        quillRef,
        formData,
        price,
        loading,
        errors,
        handleSubmit,
        onTextChange,
        onPriceChange,
        onPriceKeyDown,
    }
}