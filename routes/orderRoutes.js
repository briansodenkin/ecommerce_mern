const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermisson,
} = require("../middleware/authentication");

const {
  createOrder,
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  updateOrder,
} = require("../controllers/orderController");

router
  .route("/")
  .get(authenticateUser, authorizePermisson("admin", "owner"), getAllOrders)
  .post(authenticateUser, createOrder);

router
  .route("/showAllMyOrders")
  .get(
    authenticateUser,
    authorizePermisson("admin", "owner"),
    getCurrentUserOrders
  );

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, authorizePermisson("admin", "owner"), updateOrder);

module.exports = router;
