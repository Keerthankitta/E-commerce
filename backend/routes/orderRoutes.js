const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// ✅ POST /api/orders - Place Order
router.post('/', async (req, res) => {
  const { items, userEmail } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0 || !userEmail) {
    return res.status(400).json({ message: 'Invalid order data' });
  }

  try {
    const newOrder = new Order({
      items,
      userEmail,
      createdAt: new Date()
    });

    await newOrder.save();
    res.status(201).json({ message: '✅ Order placed successfully' });
  } catch (err) {
    console.error('❌ Failed to place order:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// ✅ GET: All orders (admin only)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error('❌ Failed to fetch orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// ✅ GET /api/orders/user/:email - Get orders by user email
router.get('/user/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const orders = await Order.find({ userEmail: email });
    res.json(orders);
  } catch (error) {
    console.error('❌ Failed to fetch user orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
