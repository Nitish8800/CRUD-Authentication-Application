const bcrypt = require("bcryptjs");
const User = require("../../models/User.Model");
const getJwtToken = require("../../utils/getJwtToken");
const controller = require("../../config/controller/controller");

// Get All Users
const getAllUsers = controller(async (req, res) => {
  const loggedInUserId = req.user.id;
  const users = await User.find({ _id: { $ne: loggedInUserId } });

  res
    .status(200)
    .send({ success: true, message: "Get All Users", data: users });
});

// Get User Details
const getUserDetails = controller(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).send({ success: false, message: "User Not Found" });
  }
  res
    .status(200)
    .send({ success: true, message: "Get Single User Details", data: user });
});

// Register New User
const createUser = controller(async (req, res) => {
  let { name, email, password, phoneNumber } = req.body;
  let user = await User.create({
    name,
    email,
    password,
    phoneNumber,
  });

  let token = await user.getJwtToken;

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 10923 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.cookie();

  await user.save();

  res.status(201).send({
    success: true,
    message: "User Created Successfully",
    data: user,
  });
});

// Login User
const loginUser = controller(async (req, res) => {
  let { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({
      success: false,
      message: "Not Found",
    });
  }

  const match = await bcrypt.compare(password, user?.password);

  if (!match) {
    return res.status(400).send({
      success: false,
      message: "Password is wrong",
    });
  }

  const token = await getJwtToken(user);

  res.cookie("jwt", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 10923 * 24 * 60 * 60 * 1000),
  });

  res.status(200).send({
    success: true,
    message: "Login Successfully",
    user,
    token: { accessToken: token, expiresIn: process.env.JWT_EXPIRES },
  });
});

// Update User
const updateUser = controller(async (req, res) => {
  const { name, email, phoneNumber } = req.body;

  let user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      email,
      phoneNumber,
    },
    { new: true }
  );
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User Not Found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User Updated successfully",
    data: user,
  });
});

// Log Out User
const logOutUser = controller(async (req, res) => {
  res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({ success: true, message: " Log Out Successfully" });
});

// Update Password
const updatePassword = controller(async (req, res) => {
  let { oldPassword } = req.body;

  if (req.body.newPassword !== req.body.confirmPassword) {
    return res.status(400).send({
      success: false,
      message: "Confirm Password not matched",
    });
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(400).send({
      success: false,
      message: "Not Found",
    });
  }

  const match = await bcrypt.compare(oldPassword, user?.password);

  if (!match) {
    return res.status(400).send({
      success: false,
      message: "Old Password is incorrect",
    });
  }

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).send({
    success: true,
    message: "Password Updated Successfully",
    data: user,
  });
});

// Delete User
const deleteUser = controller(async (req, res) => {
  // Find the user by ID and delete it
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).send({ success: false, message: "User Not Found" });
  }

  res
    .status(200)
    .send({ success: true, message: `${user.email} Deleted Successfully` });
});

module.exports = {
  getUserDetails,
  createUser,
  loginUser,
  updateUser,
  logOutUser,
  updatePassword,
  getAllUsers,
  deleteUser,
};
