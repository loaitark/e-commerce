const fs = require("fs");

const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const prisma = require("../prisma/client");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middleware/uploadImgMiddleware");
const { v4: uuidv4 } = require("uuid");

exports.uploadSubCategoryImage = uploadSingleImage("icon");

exports.resizeSubCategoryImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    if (!fs.existsSync("./uploads/subCategories")) {
      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }
      fs.mkdirSync("./uploads/subCategories");
    }
    const fileName = `sub-category-${uuidv4()}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/subCategories/${fileName}`);

    req.body.icon = fileName;
  }
  next();
});
//@desc create subCategories
//@route create /api/v1/categories/subCategories
//@access privte
exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await prisma.subCategory.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      create_at: new Date(),
      icon: req.body.icon,
      categoryId: +req.body.categoryId,
    },
  });
  res.status(200).json({ data: subCategory });
});

//@desc get subCategory
//@route het /api/v1/subCategories\
//@access public
exports.getSubCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const subCategory = await prisma.subCategory.findMany({
    skip: skip,
    take: limit,
  });
  res.status(200).json({ results: subCategory.length, data: subCategory });
});

//@desc get subCategory
//@route get /api/v1/subCategory/:id
//@access protect
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await prisma.subCategory.findUnique({
    where: {
      id: +id,
    },
  });

  if (!subCategory) {
    res.status(404).json({ msg: `no subCategory for this id ${id}` });
  }
  res.status(200).json({ data: subCategory });
});

//@desc update category
//@route get /api/v1/category/:id
//@access privite
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await prisma.subCategory.update({
    where: {
      id: +id,
    },
    data: {
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
      categoryId: +req.body.categoryId,
    },
  });
  if (!subCategory) {
    res.status(404).json({ msg: `no subCategory for this id ${id}` });
  }
  res.status(200).json({ data: subCategory });
});

//@desc delete subCategory
//@route get /api/v1/subCategory/:id
//@access private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await prisma.subCategory.delete({
    where: {
      id: +id,
    },
  });
  if (!subCategory) {
    res.status(404).json({ msg: `no subCategory for this id ${id}` });
  }
  res.status(204).send();
});
