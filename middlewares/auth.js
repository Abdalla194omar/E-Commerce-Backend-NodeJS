const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.auth = catchAsync((req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    return next(new AppError(401, "please login first", "fail"));
  }

  let decoded = jwt.verify(token, process.env.SECRET);
  req.id = decoded.id;
  req.role = decoded.role;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({
        status: "fail",
        message: "No permission to perform this action",
      });
    } else {
      next();
    }
  };
};
