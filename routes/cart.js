const express = require("express");
const { restrictTo, auth } = require("../middlewares/auth");
const { updateCart, getCart, addToCart } = require("../controllers/cart");
const router = express.Router();

router.post("/", auth, restrictTo("user"), addToCart);
router.put("/update", auth, restrictTo("user", "admin"), updateCart);
router.get("/", auth, restrictTo("user", "admin"), getCart);

module.exports = router;
