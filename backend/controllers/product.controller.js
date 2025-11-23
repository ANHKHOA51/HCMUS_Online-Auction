import productModel from '../models/product.model.js';

const getAllProducts = async (req, res) => {
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
};

const getProductDetail = async (req, res) => {
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
};

const getProductBids = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await productModel.getProductBids(id);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const rows = await productModel.getAllCategories();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  getAllProducts,
  getProductDetail,
  getProductBids,
  getAllCategories
};
