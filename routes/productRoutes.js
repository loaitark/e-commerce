const express = require("express");
const {
  uploadProductImage,
  resizeProductImage,
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} = require("../controllers/productContellers");

const { auth, allowTo } = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .post(auth, uploadProductImage, resizeProductImage, createProduct)
  .get(getProducts);

router
  .route("/:id")
  .get(getProduct)
  .put(auth, uploadProductImage, resizeProductImage, updateProduct)
  .delete(deleteProduct);

module.exports = router;
