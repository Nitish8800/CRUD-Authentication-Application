const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth/index.js");

const {
  getUserDetails,
  createUser,
  loginUser,
  updateUser,
  logOutUser,
  updatePassword,
  getAllUsers,
  deleteUser,
} = require("../controllers/user/index.js");

const {
  userSignUP,
} = require("../middleware/validator/user/userSignUp.validator.js");

const {
  validateUserLogin,
} = require("../middleware/validator/user/login.validator.js");

const {
  userUpdateValidator,
} = require("../middleware/validator/user/userUpdate.validator.js");

const bodyParser = require("body-parser");

const {
  updatePasswordValidator,
} = require("../middleware/validator/user/update.password.validator.js");
const objectIdValidator = require("../middleware/objectIdValidator");

router.use(bodyParser.json());

// get All User Details
router.get("/", auth, getAllUsers);

// get Current User Details
router.get("/me", auth, getUserDetails);

// Register New User
router.post("/signup", userSignUP, createUser);

// Login User
router.post("/login", validateUserLogin, loginUser);

// Update User Password
router.patch("/update_password", updatePasswordValidator, auth, updatePassword);

// Update User profile
router.put("/me/update", userUpdateValidator, auth, updateUser);

// Log out User
router.delete("/logout", logOutUser);

// delete single User
router.delete("/:id", objectIdValidator, auth, deleteUser);

module.exports = router;
