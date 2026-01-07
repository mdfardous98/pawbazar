import { verifyFirebaseToken } from "../config/firebase.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No authorization header provided",
      });
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No token provided",
      });
    }

    const result = await verifyFirebaseToken(token);

    if (!result.success) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
    }

    // Add user info to request object
    req.user = result.user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "Authentication failed",
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const result = await verifyFirebaseToken(token);

    if (result.success) {
      req.user = result.user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    console.error("Optional authentication error:", error);
    req.user = null;
    next();
  }
};
