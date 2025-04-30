const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const userModel = require("../models/user");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.register = catchAsync(async (req, res, next) => {
  let user = await userModel.create(req.body);
  if (!user) {
    return next(new AppError("Failed to create user", 400));
  }

  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(400, "you must provide email and password for login", "fail")
    );
  }
  let user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError(401, "invalid email or password", "fail"));
  }
  let isValid = await bcryptjs.compare(password, user.password);
  if (!isValid) {
    return next(new AppError(401, "invalid email or password", "fail"));
  }
  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET
  );
  res.status(200).json({ status: "success", data: token });
});
