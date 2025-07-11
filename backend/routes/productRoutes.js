const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// ✅ @route   POST /api/products
// ✅ @desc    Add new product (Admin only)
// ✅ @access  Private
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name, description, price, image, stock } = req.body;

  // Basic validation
  if (!name || !description || !price || !image || stock == null) {
    return res.status(400).json({ message: 'All fields are required (name, description, price, image, stock)' });
  }

  try {
    const newProduct = new Product({ name, description, price, image, stock });
    await newProduct.save();
    res.status(201).json({ message: '✅ Product added successfully', product: newProduct });
  } catch (error) {
    console.error('❌ Error saving product:', error);
    res.status(500).json({ message: 'Server error while adding product' });
  }
});

// ✅ @route   GET /api/products
// ✅ @desc    Get all products
// ✅ @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// ✅ @route   DELETE /api/products/:id
// ✅ @desc    Delete product by ID (Admin only)
// ✅ @access  Private
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: '❌ Product not found' });
    }
    res.json({ message: '✅ Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
});

module.exports = router;
