const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const sellerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z]{3,10}(@)(gmail|yahoo)(.com)$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

sellerSchema.pre("save", async function (next) {
  let salt = await bcryptjs.genSalt(10);
  let hashedPasswd = await bcryptjs.hash(this.password, salt);
  this.password = hashedPasswd;
  next();
});

const sellerModel = mongoose.model("Seller", sellerSchema);
module.exports = sellerModel;
