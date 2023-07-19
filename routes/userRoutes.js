const express = require("express");
const {
  addUser,
  updateUser,
  getUsers,
  deleteUser,
  getUser,
} = require("../controllers/userControllers");

const { auth } = require("../controllers/authControllers");

const router = express.Router();

router.route("/").post(auth, addUser).get(getUsers);
router.route("/:id").put(updateUser).get(getUser).delete(deleteUser);

module.exports = router;
