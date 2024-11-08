const validator = require("validator");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ message: "all fields must be filled" });
  const isEmail = validator.isEmail(email);
  if (!isEmail) return res.status(400).json({ message: "invalid Email" });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(409).json({ message: "email already in use" });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    createToken(res, newUser._id);
    res.status(201).json({
      userID: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin
    });
  } catch (error) {
    res.status(500);
    res.json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Please input both email and password" });

  const existingUser = await User.findOne({ email });
  if (!existingUser)
    return res.status(400).json({ message: "Check email or password" });

  const validPassword = await bcrypt.compare(password, existingUser.password);

  if (!validPassword)
    return res.status(400).json({ message: "Check email or password" });

  try {
    const token = createToken(res, existingUser._id);

    res.status(202).json({
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
      username: existingUser.username,
      userID: existingUser._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const logoutCurrentUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(204).json({message: "user logged out successfully"})
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User not found" });
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found" });

    if (user) {
      if (user.isAdmin) {
        return res.status(400).json({ message: "Cannot delete Admin" });
      }

      await User.deleteOne({ _id: user._id });
      res.json({ message: `${user.username} deleted successfully` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "user not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "user not found" });

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUser,
  getSingleUser,
  updateUserById,
};
