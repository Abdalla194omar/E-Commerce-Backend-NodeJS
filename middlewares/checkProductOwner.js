const productModel = require("../models/product");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.checkProductOwnership = async (req, res, next) => {
  const productId = req.params.id;
  const sellerId = req.id;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError(404, "Product not found", "fail"));
  }
  if (product.seller.toString() !== sellerId) {
    return next(new AppError(403, "You do not own this product", "fail"));
  }
  next();
};
