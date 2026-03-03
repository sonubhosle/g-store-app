const Review = require("../models/Review.js");
const Product = require("../models/Product.js");
const User = require("../models/User.js");

const createReview = async (data, user) => {
  if (!data) throw new Error("Request body missing");

  const { productId, description, rating } = data;

  if (!productId) throw new Error("productId is required");
  if (!description || description.trim() === "") {
    throw new Error("Review description is required");
  }

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // Prevent duplicate review per product per user
  const alreadyReviewed = await Review.findOne({
    user: user._id,
    product: productId,
  });

  if (alreadyReviewed) {
    throw new Error("You have already reviewed this product");
  }

  // Create review (with optional rating)
  const review = await Review.create({
    user: user._id,
    product: product._id,
    description,
    rating: rating || null,
  });

  // Push review into Product
  product.reviews.push(review._id);
  product.numReviews = product.reviews.length;

  // Update average rating on product if rating was provided
  if (rating) {
    const allReviews = await Review.find({ product: productId, rating: { $ne: null } });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    product.numRatings = Math.round(avg * 10) / 10;
  }

  await product.save();

  // Push review into User
  await User.findByIdAndUpdate(user._id, {
    $push: { reviews: review._id },
  });

  return await review.populate({
    path: "user",
    select: "name surname email photo",
  });
};

const getAllReviews = async (productId) => {
  return Review.find({ product: productId })
    .populate("user", "name surname email photo")
    .sort({ createdAt: -1 });
};

const updateReview = async (reviewId, userId, description, rating) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (review.user.toString() !== userId.toString())
    throw new Error("Unauthorized");

  if (description !== undefined) review.description = description;
  if (rating !== undefined) review.rating = rating;

  await review.save();

  // Recalculate product avg rating
  const allReviews = await Review.find({
    product: review.product,
    rating: { $ne: null }
  });
  if (allReviews.length > 0) {
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(review.product, {
      numRatings: Math.round(avg * 10) / 10,
    });
  }

  return review.populate("user", "name surname email photo");
};

const deleteReview = async (reviewId, userId) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (review.user.toString() !== userId.toString())
    throw new Error("Unauthorized");

  await Product.findByIdAndUpdate(review.product, {
    $pull: { reviews: review._id },
    $inc: { numReviews: -1 },
  });

  await User.findByIdAndUpdate(userId, {
    $pull: { reviews: review._id },
  });

  await Review.findByIdAndDelete(reviewId);

  // Recalculate avg rating after deletion
  const allReviews = await Review.find({
    product: review.product,
    rating: { $ne: null }
  });
  const avg = allReviews.length > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    : 0;
  await Product.findByIdAndUpdate(review.product, {
    numRatings: Math.round(avg * 10) / 10,
  });

  return { message: "Review deleted successfully" };
};

module.exports = {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};
