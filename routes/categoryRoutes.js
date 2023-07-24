const express = require("express");
const {
  createCategory,
  resizeCategoryImage,
  uploadCategoryImage,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} = require("../controllers/catergoryControllers");

const { auth } = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .post(auth, uploadCategoryImage, resizeCategoryImage, createCategory)
  .get(getCategories);

router
  .route("/:id")
  .get(getCategory)
  .put(auth, uploadCategoryImage, updateCategory)
  .delete(deleteCategory);

module.exports = router;
