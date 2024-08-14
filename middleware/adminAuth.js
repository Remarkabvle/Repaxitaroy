import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const Auth = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      msg: "Access denied. Token missing.",
      variant: "error",
      payload: null,
    });
  }

  try {
    jwt.verify(token, process.env.ADMIN_SECRET, (err, decoded) => {
      if (err || !decoded.isActive) {
        return res.status(401).json({
          msg: "Invalid or expired token.",
          variant: "error",
          payload: null,
        });
      }

      req.admin = decoded;
      next();
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      msg: "Authentication error.",
      variant: "error",
      payload: null,
    });
  }
};

export const OwnerAuth = (req, res, next) => {
  if (req.admin.role === "owner") {
    next();
  } else {
    res.status(403).json({
      msg: "Access denied. Owner privileges required.",
      variant: "error",
      payload: null,
    });
  }
};
