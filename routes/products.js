const express = require("express");
const {
  getAllProducts,
  createProduct,
  getProductByID,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const { restrictTo, auth } = require("../middlewares/auth");
const { checkProductOwnership } = require("../middlewares/checkProductOwner");
const router = express.Router();

router.get("/", getAllProducts);
router.post("/", auth, restrictTo("seller"), createProduct);
router.get("/:name", getProductByID);
router.patch(
  "/:id",
  auth,
  restrictTo("seller"),
  checkProductOwnership,
  updateProduct
);
router.delete(
  "/:id",
  auth,
  restrictTo("seller"),
  checkProductOwnership,
  deleteProduct
);

module.exports = router;
