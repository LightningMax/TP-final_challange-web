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

app.get("/api/categories", async (req, res) => {
  try {
    const category = await new Category(req.body).save();
    res.status(201).json(category);
  } catch (err) {
    res
      .status(401)
      .json({ message: "Erreur dans l'ajout de la categorie", error: err });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const category = await new Category(req.body).save();
    res.status(400).json(category);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur dans l'ajout de categorie", error: err });
  }
});

app.get("/api/products", async (req, res) => {
  const products = await Product.find().populate("category");
  res.json(products);
});

app.post("/api/products", async (req, res) => {
  if (req.body.price <= 0) {
    res.status(400).json({ error: "Erreur: Le prix doit être positif" });
    return;
  }

  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Erreur dans l'ajout du produit", error: err });
  }
});

app.listen(3000, () => console.log("Serveur Garage sur port 3000"));
