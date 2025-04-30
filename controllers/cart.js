const express = require("express");
const Cart = require("../models/cart");
const { catchAsync } = require("../utils/catchAsync");
const Product = require("../models/product");
const AppError = require("../utils/AppError");

exports.addToCart = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return next(new AppError(404, "Product not found", "fail"));

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({
      user: userId,
      products: [{ product: productId, quantity }],
      totalQuantity: quantity,
      totalPrice: quantity * product.price,
    });
  } else {
    const existingProduct = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    cart.totalQuantity += quantity;
    cart.totalPrice += quantity * product.price;
  }

  await cart.save();
  res.status(200).json({ status: "success", data: cart });
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) return next(new AppError(404, "Cart not found", "fail"));

  const product = await Product.findById(productId);
  if (!product) return next(new AppError(404, "Product not found", "fail"));

  const item = cart.products.find((p) => p.product.toString() === productId);
  if (!item) return next(new AppError(404, "Product not in cart", "fail"));

  cart.totalQuantity = cart.totalQuantity - item.quantity + quantity;
  cart.totalPrice =
    cart.totalPrice - item.quantity * product.price + quantity * product.price;
  item.quantity = quantity;

  await cart.save();
  res.status(200).json({ status: "success", data: cart });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const cart = await Cart.findOne({ user: userId }).populate(
    "products.product"
  );
  if (!cart) return next(new AppError(404, "Cart not found", "fail"));

  res.status(200).json({ status: "success", data: cart });
});
