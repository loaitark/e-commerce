const fs = require("fs");

const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const prisma = require("../prisma/client");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middleware/uploadImgMiddleware");
const { v4: uuidv4 } = require("uuid");

exports.uploadBrandImage = uploadSingleImage("image");

exports.resizeBrandImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    if (!fs.existsSync("./uploads/brands")) {
      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }
      fs.mkdirSync("./uploads/brands");
    }
    const fileName = `sub-brand-${uuidv4()}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${fileName}`);

    req.body.image = fileName;
  }
  next();
});
//@desc create brand
//@route create /api/v1/brands/
//@access privte
exports.createBrand = asyncHandler(async (req, res, next) => {
  const brand = await prisma.brand.create({
    data: {
      name: req.body.name,
      image: req.body.image,
      create_at: new Date(),
      categoryId: +req.body.categoryId,
      subCategoryId: +req.body.subCategoryId,
    },
  });
  res.status(200).json({ data: brand });
});

//@desc get brand
//@route het /api/v1/brands\
//@access public
exports.getBrands = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const brand = await prisma.brand.findMany({
    skip: skip,
    take: limit,
  });
  res.status(200).json({ results: brand.length, data: brand });
});

//@desc get brand
//@route get /api/v1/brand/:id
//@access protect
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await prisma.brand.findUnique({
    where: {
      id: +id,
    },
  });

  if (!brand) {
    res.status(404).json({ msg: `no brand for this id ${id}` });
  }
  res.status(200).json({ data: brand });
});

//@desc update brand
//@route get /api/v1/brand/:id
//@access privite
exports.updateBrand= asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await prisma.brand.update({
    where: {
      id: +id,
    },
    data: {
      name: req.body.name,
      image: req.body.image,
      create_at: new Date(),
      categoryId: +req.body.categoryId,
      subCategoryId: +req.body.subCategoryId,
    },
  });
  if (!brand) {
    res.status(404).json({ msg: `no brand for this id ${id}` });
  }
  res.status(200).json({ data: brand });
});

//@desc delete brand
//@route get /api/v1/brand/:id
//@access private
exports.deleteBrand= asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await prisma.brand.delete({
    where: {
      id: +id,
    },
  });
  if (!brand) {
    res.status(404).json({ msg: `no brand for this id ${id}` });
  }
  res.status(204).send();
});
