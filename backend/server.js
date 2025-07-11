// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const User = require('./models/User'); // For admin creation

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/ecommerce')
  .then(() => {
    console.log("✅ MongoDB connected");
    createAdminUser(); // Automatically create admin on first run
  })
  .catch(err => console.log("❌ MongoDB connection error:", err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // if you have orders

// ✅ Auto-create admin user
const createAdminUser = async () => {
  try {
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('⚠️ Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('123', 10);
    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin created: admin@example.com | password: 123');
  } catch (err) {
    console.error('❌ Error creating admin:', err);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
