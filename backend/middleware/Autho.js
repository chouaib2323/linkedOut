const Autho = (allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user data found" });
      }
  
      if (!req.user.role || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }
  
      next();
    };
  };
  
  module.exports = Autho;
  