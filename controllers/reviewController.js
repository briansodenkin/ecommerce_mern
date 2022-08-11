const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No such product ${productId}`);
  }
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(201).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  console.log(reviewId);
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`Not found with id: ${reviewId}`);
  }
  res.status(201).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`Not found with id: ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(201).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new CustomError.NotFoundError(`Not found with id: ${reviewId}`);
  }
  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(201).json({ msg: "Review removed" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(201).json({ reviews, count: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
