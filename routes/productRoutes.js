const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermisson,
} = require("../middleware/authentication");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controllers/productController");

const { getSingleProductReviews } = require("../controllers/reviewController");

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizePermisson("admin", "owner"), createProduct);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermisson("admin", "owner"), updateProduct)
  .delete(
    authenticateUser,
    authorizePermisson("admin", "owner"),
    deleteProduct
  );

router
  .route("/uploadImage")
  .post(authenticateUser, authorizePermisson("admin", "owner"), uploadImage);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
