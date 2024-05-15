import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read the JWT from the cookie
  token = req.cookies.jwt;

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (req.user && req.user.isActive) {
      next();
    } else if (!req.user) {
      res.status(401);
      throw new Error("לא רשאי, טוקן לא תקין");
    } else {
      // !req.user.isActive
      res.status(401);
      throw new Error("לא רשאי, המשתמש לא פעיל");
    }
  } else {
    res.status(401);
    throw new Error("לא רשאי, אין טוקן");
  }
});

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("לא מאושר כמנהל");
  }
};

export { protect, admin };
