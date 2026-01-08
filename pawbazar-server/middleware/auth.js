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

    // Handle demo/mock tokens for development
    if (token.startsWith("mock-")) {
      const mockUser = {
        uid: token,
        email: "demo@gmail.com",
        displayName: "Demo User",
        emailVerified: true,
      };
      req.user = mockUser;
      return next();
    }

    const result = await verifyFirebaseToken(token);

    if (!result.success) {
      // In development mode, allow demo authentication
      if (process.env.NODE_ENV === "development") {
        const mockUser = {
          uid: "demo-user",
          email: "demo@gmail.com",
          displayName: "Demo User",
          emailVerified: true,
        };
        req.user = mockUser;
        return next();
      }

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

    // In development mode, allow demo authentication as fallback
    if (process.env.NODE_ENV === "development") {
      const mockUser = {
        uid: "demo-user",
        email: "demo@gmail.com",
        displayName: "Demo User",
        emailVerified: true,
      };
      req.user = mockUser;
      return next();
    }

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

    // Handle demo/mock tokens for development
    if (token.startsWith("mock-")) {
      const mockUser = {
        uid: token,
        email: "demo@gmail.com",
        displayName: "Demo User",
        emailVerified: true,
      };
      req.user = mockUser;
      return next();
    }

    const result = await verifyFirebaseToken(token);

    if (result.success) {
      req.user = result.user;
    } else {
      // In development mode, provide demo user
      if (process.env.NODE_ENV === "development") {
        req.user = {
          uid: "demo-user",
          email: "demo@gmail.com",
          displayName: "Demo User",
          emailVerified: true,
        };
      } else {
        req.user = null;
      }
    }

    next();
  } catch (error) {
    console.error("Optional authentication error:", error);
    req.user = null;
    next();
  }
};
