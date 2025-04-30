const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.createOrder = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const { paymentType } = req.body;

  const cart = await Cart.findOne({ user: userId }).populate(
    "products.product"
  );
  if (!cart || cart.products.length === 0) {
    return next(new AppError(400, "Cart is empty", "fail"));
  }

  const orderProducts = cart.products.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
  }));

  const order = await Order.create({
    user: userId,
    products: orderProducts,
    paymentType,
    totalPrice: cart.totalPrice,
  });

  cart.products = [];
  cart.totalPrice = 0;
  cart.totalQuantity = 0;
  await cart.save();

  res.status(201).json({ status: "success", data: order });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.id }).populate(
    "products.product"
  );
  res.status(200).json({ status: "success", data: orders });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user")
    .populate("products.product");
  res.status(200).json({ status: "success", data: orders });
});
