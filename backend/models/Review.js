const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  productSku: {
    type: String,
    required: false,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Review = mongoose.model("reviews", reviewSchema);
module.exports = Review;