const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/marketplace_db")
  .then(() => console.log("Connecté au Marketplace MongoDB"))
  .catch((err) => console.error(err));

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Category = mongoose.model("category", categorySchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
});
const Product = mongoose.model("product", productSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true },
  role: { type: String, default: "client" },
});
const User = mongoose.model("user", userSchema);

const reviewSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});
const Review = mongoose.model("review", reviewSchema);

app.listen(3000, () => console.log("Serveur Garage sur port 3000"));
