const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const path = require("path");
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require("../utils");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(201).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate('reviews');
  if (!product) {
    throw new CustomError.NotFoundError(`Not found with id: ${productId}`);
  }
  res.status(201).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findByIdAndUpdate(
    { _id: productId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) {
    throw new CustomError.NotFoundError(`Not found with id: ${productId}`);
  }

  res.status(201).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`Not found with id: ${productId}`);
  }
  await product.remove();
  res.status(201).json({ msg: "Product removed" });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No file");
  }
  const productImage = req.files.image;
  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError("Please upload image");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads" + `${productImage.name}`
  );
  await productImage.mv(imagePath)
  res.status(201).json({images:`uploads/${productImage.name}`})
  res.send("upload Image");
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
