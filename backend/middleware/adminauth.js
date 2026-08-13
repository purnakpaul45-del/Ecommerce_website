import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    console.log("========== ADMIN AUTH ==========");

    // Get Authorization header
    const authHeader = req.headers.authorization;

    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Admin token missing.",
      });
    }

    // Expected:
    // Bearer eyJhbGciOiJIUzI1Ni...
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin token missing.",
      });
    }

    // IMPORTANT:
    // Must be exactly the same secret used during admin login
    const secret =
      process.env.JWT_SECRET ||
      "my_admin_secret_key";

    const tokenDecode = jwt.verify(
      token,
      secret
    );

    console.log(
      "Decoded Admin Token:",
      tokenDecode
    );

    // Check admin role
    if (tokenDecode.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Store admin information in request
    req.adminId = tokenDecode.id;
    req.adminEmail = tokenDecode.email;
    req.adminRole = tokenDecode.role;

    console.log("Admin authentication successful.");

    next();
  } catch (error) {
    console.error(
      "Admin Auth Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token.",
    });
  }
};

export default adminAuth;