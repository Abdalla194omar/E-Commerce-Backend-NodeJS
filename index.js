const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = 3000;
const app = express();
const productsRoutes = require("./routes/products");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const AppError = require("./utils/AppError");

//load env variables
dotenv.config();

// connect with mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// convert any request to json
app.use(express.json());

// routes
app.use("/products", productsRoutes);
app.use("/user", userRoutes);
app.use("/cart", cartRoutes);

// not found page
app.use((req, res, next) => {
  next(new AppError(404, "route not found"));
});

//error handling
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid ID format" });
  } else if (err.name === "ValidationError") {
    return res
      .status(400)
      .json({ status: "fail", message: "Validation failed" });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ status: "fail", message: "Invalid token" });
  } else if (err.name === "TokenExpiredError") {
    return res.status(401).json({ status: "fail", message: "Token expired" });
  }
  res
    .status(err.statusCode || 500)
    .json({ status: "failed", message: err.message || "try again later" });
});

// connect to the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
