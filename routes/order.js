const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
} = require("../controllers/order");

router.use(auth);

router.post("/", auth, createOrder);
router.get("/my-orders", auth, getMyOrders);
router.get("/", auth, restrictTo("admin"), getAllOrders);

module.exports = router;
