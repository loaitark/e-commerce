const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

//@desc signUp
//@route create /api/v1/auth\signUp
//@access public
exports.signUp = asyncHandler(async (req, res, next) => {
  //create user
  const user = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 8),
    },
  });

  //genertate token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.status(200).json({ data: user, token: token });
});

//@desc login
//@route create /api/v1/auth\login
//@access public
exports.logIn = asyncHandler(async (req, res, next) => {
  //email already exsit
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  console.log(user);
  if (!user) {
    return next(new apiError(`no user for this ${email}`), 404);
  }

  //valid password
  const checkPass = bcrypt.compare(req.body.password, user.password);

  if (!checkPass) {
    return next(new apiError("wrong password"), 404);
  }

  //create token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.status(200).json({ data: user, token: token });
});

// exports.auth = asyncHandler(async (req, res, next) => {
//   //check validate token
//   const verifyToken =
// });
