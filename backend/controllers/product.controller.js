import productModel from '../models/product.model.js';

export const ProductController = {

    // Lấy tất cả sản phẩm với các tham số lọc và sắp xếp
    getAllProducts: async (req, res) => {
        try {
            console.log('getAllProducts called with query:', req.query);
            // truyền nguyên req.query vào service để giữ nguyên behavior
            const rows = await productModel.getAllProducts(req.query);
            console.log('Found', rows.length, 'products');
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Error fetching products:', error.message);
            console.error('Stack:', error.stack);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Chi tiết sản phẩm
    getProductDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await productModel.getProductDetail(id);

            if (!data.product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
            }

            res.json({
            success: true,
            data: {
                product: data.product,
                highestBidder: data.highestBidder,
                faqs: data.faqs,
                relatedProducts: data.relatedProducts
            }
            });
        } catch (error) {
            console.error('Error fetching product details:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Lịch sử đấu giá của sản phẩm
    getProductBids: async (req, res) => {
        try {
            const { id } = req.params;
            const rows = await productModel.getProductBids(id);
            res.json({ success: true, data: rows });
        } catch (error) {
            console.error('Error fetching bids:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Top sắp kết thúc
    topClosing: async (req, res) => {
        try {
        const rows = await productModel.findTopClosing();
        res.json({ success: true, data: rows });;
        } catch (err) {
        res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Top nhiều người đấu giá
    topBidding: async (req, res) => {
        try {
        const rows = await productModel.findTopBidding();
        res.json({ success: true, data: rows });
        } catch (err) {
        res.status(500).json({ error: 'Lỗi server' });
        }
    },

    // Top giá cao
    topPricing: async (req, res) => {
        try {
        const rows = await productModel.findTopPricing();
        res.json({ success: true, data: rows });
        } catch (err) {
        res.status(500).json({ error: 'Lỗi server' });
        }
    },

};

export default ProductController;
