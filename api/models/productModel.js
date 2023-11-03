const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
    },
    price: {
      type: Number,
      min: [1, "price cant be 0"],
    },
    onhand: {
      type: Number,
      min: [1, "onhand cant be 0"],
    },
    seller: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    id: {
      type: String,
    },
    type: {
      type: String,
    },
    date: {
      type: String,
    },
    img: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
