const express = require("express");
const { logIn, signUp } = require("../controllers/authControllers");
const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(logIn);

module.exports = router;
