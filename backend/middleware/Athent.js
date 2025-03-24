const jwt = require("jsonwebtoken");

const Athent = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "User not logged in" });
    }

    // Extract token from "Bearer <token>"
    const tokenParts = token.split(" ");
    
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // Verify token
    const verified = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = verified; // Attach user info to request
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = Athent;
