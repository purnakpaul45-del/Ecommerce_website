import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    console.log("=================================");
    console.log("ADMIN AUTH MIDDLEWARE");
    console.log("=================================");

    // ---------------------------------------------
    // GET AUTHORIZATION HEADER
    // ---------------------------------------------

    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
      console.log("❌ No Authorization Header");

      return res.status(401).json({
        success: false,
        message: "Admin token missing.",
      });
    }

    // ---------------------------------------------
    // CHECK BEARER FORMAT
    // ---------------------------------------------

    const parts = authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      console.log(
        "❌ Invalid Authorization Format"
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid authorization format.",
      });
    }

    const token = parts[1];

    if (!token) {
      console.log("❌ Token is empty");

      return res.status(401).json({
        success: false,
        message: "Admin token missing.",
      });
    }

    // ---------------------------------------------
    // JWT SECRET
    // ---------------------------------------------

    const secret =
      process.env.JWT_SECRET ||
      "my_admin_secret_key";

    console.log(
      "JWT Secret exists:",
      Boolean(secret)
    );

    // ---------------------------------------------
    // VERIFY TOKEN
    // ---------------------------------------------

    const decoded = jwt.verify(
      token,
      secret
    );

    console.log(
      "Decoded Token:",
      decoded
    );

    // ---------------------------------------------
    // CHECK ADMIN ROLE
    // ---------------------------------------------

    if (decoded.role !== "admin") {
      console.log(
        "❌ Invalid role:",
        decoded.role
      );

      return res.status(403).json({
        success: false,
        message:
          "Access denied. Admin only.",
      });
    }

    // ---------------------------------------------
    // STORE ADMIN DATA
    // ---------------------------------------------

    req.adminId = decoded.id;
    req.adminEmail = decoded.email;
    req.adminRole = decoded.role;

    console.log(
      "✅ ADMIN AUTHENTICATION SUCCESSFUL"
    );

    next();
  } catch (error) {
    console.error(
      "❌ ADMIN AUTH ERROR:",
      error.message
    );

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message:
          "Admin token has expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin token. Please login again.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Authentication server error.",
    });
  }
};

export default adminAuth;