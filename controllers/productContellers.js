const fs = require("fs");

const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const prisma = require("../prisma/client");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middleware/uploadImgMiddleware");
const { v4: uuidv4 } = require("uuid");

exports.uploadProductImage = uploadSingleImage("image");

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    if (!fs.existsSync("./uploads/products")) {
      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }
      fs.mkdirSync("./uploads/products");
    }
    const fileName = `sub-product-${uuidv4()}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${fileName}`);

    req.body.image = fileName;
  }
  next();
});
//@desc create product
//@route create /api/v1/products/subCategories
//@access privte
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await prisma.product.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      create_at: new Date(),
      image: req.body.image,
      categoryId: +req.body.categoryId,
      subCategoryId: +req.body.subCategoryId,
      brandId: +req.body.brandId,
      quantity: +req.body.quantity,
      sold: +req.body.sold,
      price: +req.body.price,
    },
  });
  res.status(200).json({ data: product });
});

//@desc get products
//@route het /api/v1/products\
//@access public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const product = await prisma.product.findMany({
    skip: skip,
    take: limit,
  });
  res.status(200).json({ results: product.length, data: product });
});

//@desc get product
//@route get /api/v1/product/:id
//@access protect
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: {
      id: +id,
    },
  });

  if (!product) {
    res.status(404).json({ msg: `no product for this id ${id}` });
  }
  res.status(200).json({ data: product });
});

//@desc update product
//@route get /api/v1/category/:id
//@access privite
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await prisma.product.update({
    where: {
      id: +id,
    },
    data: {
      title: req.body.title,
      description: req.body.description,
      create_at: new Date(),
      image: req.body.image,
      // categoryId: +req.body.categoryId,
      //subCategoryId: +req.body.subCategoryId,
      quantity: +req.body.quantity,
      sold: +req.body.sold,
      price: +req.body.price,
      brand: req.body.brand,
    },
  });
  if (!product) {
    res.status(404).json({ msg: `no product for this id ${id}` });
  }
  res.status(200).json({ data: product });
});

//@desc delete product
//@route get /api/v1/subCategory/:id
//@access private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await prisma.product.delete({
    where: {
      id: +id,
    },
  });
  if (!product) {
    res.status(404).json({ msg: `no product for this id ${id}` });
  }
  res.status(204).send();
});
