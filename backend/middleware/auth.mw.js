import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = decoded;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.userType !== "Admin") {
    return res
      .status(403)
      .json({ message: "Access denied, only admins can perform this action" });
  }
  next();
};
