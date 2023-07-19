const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

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
      role: req.body.role,
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

exports.auth = asyncHandler(async (req, res, next) => {
  //check validate token
  const autherzationHeader = req.headers.authorization;
  if (!autherzationHeader || !autherzationHeader.startsWith("Bearer")) {
    return next(
      new apiError("you are not loggeed to access this route 1 ", 404)
    );
  }

  const token = autherzationHeader.replace("Bearer ", "");

  if (!token) {
    return next(new apiError("you are not loggeed to access this route", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    return next(new apiError(`no user for this id ${id}`, 401));
  }

  req.user = user;

  next();
});

exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new apiError(`this user not allow to access this route`, 401)
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return next(new apiError(`no user for this ${email}`), 404);
  }
  const restCode = Math.floor(Math.random() * 1000000 + 1).toString();

  const hashedCode = crypto.createHash("sha256").update(restCode).digest("hex");
  const passwordRestExp = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      passwordRestCode: hashedCode,
      passwordRestExp: passwordRestExp,
      passwordRestVerified: false,
    },
  });
  const message = `hi ${user.name} \n , your rest code for e-comm site email. \n ${restCode}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your password rest code",
      message,
    });
  } catch (err) {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordRestCode: undefined,
        passwordRestExp: undefined,
        passwordRestVerified: undefined,
      },
    });

    return next(new apiError("there an error in sending email", 500));
  }
  res.status(200).json({ status: "success" });
});

exports.verifyRestCode = asyncHandler(async (req, res, next) => {
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.restCode)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      passwordRestCode: hashedCode,
      passwordRestExp: {
        gt: new Date(),
      },
    },
  });
  if (!user) {
    return next(new apiError(`wrong rest code try again`));
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: { passwordRestVerified: true },
  });

  res.status(200).json({ status: "success" });
});

exports.restPassword = asyncHandler(async (req, res, next) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!user) {
    return next(new apiError(`no user for this email${req.body.email}`));
  }
  if (!user.passwordRestVerified) {
    return next(new apiError("your rest code not verified"));
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await bcrypt.hash(req.body.password, 8),
      passwordRestCode: null,
      passwordRestVerified: null,
      passwordRestExp: null,
    },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.status(200).json({ token });
});
