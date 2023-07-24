const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  deleteSubCategory,
  resizeSubCategoryImage,
  uploadSubCategoryImage,
  updateSubCategory,
} = require("../controllers/subCategoryControllers");

const { auth, allowTo } = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .post(auth, uploadSubCategoryImage, resizeSubCategoryImage, createSubCategory)
  .get(getSubCategories);

router
  .route("/:id")
  .get(getSubCategory)
  .put(auth, uploadSubCategoryImage, resizeSubCategoryImage, updateSubCategory)
  .delete(deleteSubCategory);

module.exports = router;
