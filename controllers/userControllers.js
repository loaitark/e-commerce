const asyncHandler = require("express-async-handler");
const prisma = require("../prisma/client");

//@desc Create user
//@route post /api/v1/users
//@access privte
exports.addUser = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
  });

  res.status(200).json({ data: user });
});

//@desc get users
//@route get /api/v1/users
//@access protect
exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  const user = await prisma.user.findMany({ skip: skip, take: limit });
  res.status(200).json({ results: user.length, data: user });
});

//@desc get user
//@route get /api/v1/users/:id
//@access protect
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: {
      id: +id,
    },
  });

  if (!user) {
    res.status(404).json({ msg: `no user for this id ${id}` });
  }
  res.status(200).json({ data: user });
});

//@desc update user
//@route get /api/v1/users/:id
//@access privite
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: {
      id: +id,
    },
    data: {
      name: req.body.name,
      email: req.body.email,
    },
  });
  if (!user) {
    res.status(404).json({ msg: `no user for this id ${id}` });
  }
  res.status(200).json({ data: user });
});

//@desc delete user
//@route get /api/v1/users/:id
//@access private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id: +id,
    },
  });
  if (!user) {
    res.status(404).json({ msg: `no user for this id ${id}` });
  }
  res.status(204).send();
});
