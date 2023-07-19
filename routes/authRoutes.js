const express = require("express");
const {
  logIn,
  signUp,
  auth,
  forgetPassword,
  verifyRestCode,
  restPassword,
} = require("../controllers/authControllers");
const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(logIn);
router.route("/forgetPassword").post(auth, forgetPassword);
router.route("/verifyRestCode").put(auth, verifyRestCode);
router.route("/restPassword").put(auth, restPassword);

module.exports = router;
