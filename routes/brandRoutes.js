const express = require("express");
const {
  uploadBrandImage,
  updateBrand,
  resizeBrandImage,
  createBrand,
  deleteBrand,
  getBrand,
  getBrands,
} = require("../controllers/brandConrollers");

const { auth, allowTo } = require("../controllers/authControllers");

const router = express.Router();

router
  .route("/")
  .post(auth, uploadBrandImage, resizeBrandImage, createBrand)
  .get(getBrands);

router
  .route("/:id")
  .get(getBrand)
  .put(auth, uploadBrandImage, resizeBrandImage, updateBrand)
  .delete(deleteBrand);

module.exports = router;
