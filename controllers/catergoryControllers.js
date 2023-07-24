const fs = require("fs");

const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const prisma = require("../prisma/client");
const sharp = require("sharp");
const { uploadSingleImage } = require("../middleware/uploadImgMiddleware");
const { v4: uuidv4 } = require("uuid");

exports.uploadCategoryImage = uploadSingleImage("icon");

exports.resizeCategoryImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    if (!fs.existsSync("./uploads/categories")) {
      if (!fs.existsSync("./uploads")) {
        fs.mkdirSync("./uploads");
      }
      fs.mkdirSync("./uploads/categories");
    }
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`);

    req.body.icon = fileName;
  }
  next();
});
//@desc create category
//@route create /api/v1/categories\
//@access privte
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await prisma.category.create({
    data: {
      name: req.body.name,
      description: req.body.description,
      create_at: new Date(),
      icon: req.body.icon,
    },
  });
  res.status(200).json({ data: category });
});

//@desc get categories
//@route het /api/v1/categories\
//@access public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const category = await prisma.category.findMany({ skip: skip, take: limit });
  res.status(200).json({ results: category.length, data: category });
});

//@desc get category
//@route get /api/v1/category/:id
//@access protect
exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await prisma.category.findUnique({
    where: {
      id: +id,
    },
  });

  if (!category) {
    res.status(404).json({ msg: `no category for this id ${id}` });
  }
  res.status(200).json({ data: category });
});

//@desc update category
//@route get /api/v1/category/:id
//@access privite
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await prisma.category.update({
    where: {
      id: +id,
    },
    data: {
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
    },
  });
  if (!category) {
    res.status(404).json({ msg: `no category for this id ${id}` });
  }
  res.status(200).json({ data: category });
});

//@desc delete category
//@route get /api/v1/category/:id
//@access private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await prisma.category.delete({
    where: {
      id: +id,
    },
  });
  if (!category) {
    res.status(404).json({ msg: `no category for this id ${id}` });
  }
  res.status(204).send();
});
