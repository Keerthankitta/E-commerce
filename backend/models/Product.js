// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,  // ✅ Make sure this is present and correct
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
