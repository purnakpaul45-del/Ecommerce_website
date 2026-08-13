import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    // ==========================================
    // GET AUTHORIZATION HEADER
    // ==========================================

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Please login again.",
      });
    }

    // Expected:
    // Authorization: Bearer <token>

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found.",
      });
    }

    // ==========================================
    // VERIFY TOKEN
    // ==========================================

    const tokenDecode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ==========================================
    // GET USER ID
    // ==========================================

    if (!tokenDecode.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. User ID not found.",
      });
    }

    req.userId = tokenDecode.id;

    console.log("Authenticated User ID:", req.userId);

    next();

  } catch (error) {

    console.error(
      "User Auth Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Not Authorized. Please login again.",
    });
  }
};

export default authUser;