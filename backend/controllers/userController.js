import asyncHandler from "../middleware/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { sendEmailsHandler } from "../utils/sendEmails.js";
import User from "../models/userModel.js";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      image: user.image,
      isActive: user.isActive,
      canBeScheduled: user.canBeScheduled,
      canSendConstraints: user.canSendConstraints,
    });
  } else {
    res.status(401);
    throw new Error(`דוא"ל או סיסמא לא נכונים`);
  }
});

// @desc    Register user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("משתמש עם דואר אלקטרוני זה כבר קיים במערכת");
  }

  const user = await User.create({ name, email, password });

  if (user) {
    const allAdminsEmails = await User.find({ isAdmin: true }).select("email");
    allAdminsEmails.forEach((admin) => {
      sendEmailsHandler(res, admin.email, user.name, user.email, true);
    });

    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      image: user.image,
      isActive: user.isActive,
      canBeScheduled: user.canBeScheduled,
      canSendConstraints: user.canSendConstraints,
    });
  } else {
    res.status(400);
    throw new Error("מידע משתמש לא תקין");
  }
});

// @desc    Logout user / Clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "משתמש התנתק בהצלחה" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      image: user.image,
    });
  } else {
    res.status(404);
    throw new Error("משתמש לא נמצא");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    if (
      req.body.image &&
      req.body.image !== User.schema.path("image").defaultValue
    ) {
      user.image = req.body.image;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      image: updatedUser.image,
    });
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("משתמש לא נמצא");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("לא ניתן למחוק מנהל מערכת");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "המשתמש נמחק בהצלחה" });
  } else {
    res.status(404);
    throw new Error("משתמש לא נמצא");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin || user.isAdmin);
    user.image = req.body.image || user.image;
    user.isActive = Boolean(req.body.isActive || user.isActive);

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    if (req.body.isActive) {
      sendEmailsHandler(res, updatedUser.email, updatedUser.name, "", false);
    }

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      image: updatedUser.image,
    });
  } else {
    res.status(404);
    throw new Error("משתמש לא נמצא");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserByID,
  updateUser,
};
