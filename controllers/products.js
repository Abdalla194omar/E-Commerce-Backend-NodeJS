const productModel = require("../models/product");
const sellerModel = require("../models/seller");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.getAllProducts = catchAsync(async (req, res, next) => {
  let products = await productModel.find().populate("seller", "name email");

  if (products.length == 0) {
    return next(new AppError(422, "products not exist", "fail"));
  }
  res.status(200).json({ status: "success", data: products });
});

exports.getProductByID = catchAsync(async (req, res, next) => {
  let { productName, sellerName } = req.params;
  let product;
  let products = [];
  if (productName) {
    product = await productModel.findOne({ name: productName });
  } else if (sellerName) {
    const seller = await sellerModel.findOne({ name: sellerName });
    if (seller) {
      products = await productModel
        .find({ seller: seller._id })
        .populate("seller");
    }
  }
  if (!product && products.length == 0) {
    return next(new AppError(404, "No Products Found"));
  }
  if (product) {
    res.status(200).json({ status: "success", data: product });
  } else {
    res.status(200).json({ status: "success", data: products });
  }
});

exports.createProduct = async (req, res, next) => {
  let newProduct = req.body;
  if (!newProduct.name || !newProduct.description) {
    return next(new AppError(400, "Not Complete Info", "fail"));
  }
  let product = await productModel.create({ ...newProduct, seller: req.id });
  return res.status(201).send({ status: "success", data: product });
};

exports.updateProduct = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  let product = await productModel.findOneAndUpdate({ id }, { ...req.body });
  if (!product) {
    return next(new AppError(404, "Product not found", "fail"));
  }
  res.status(200).json({ status: "success", data: product });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  let product = await productModel.findOneAndDelete({ id });
  if (!product) {
    return next(new AppError(404, "Product not found", "fail"));
  }
  res.status(204).json({ status: "success", message: "Product deleted" });
});
