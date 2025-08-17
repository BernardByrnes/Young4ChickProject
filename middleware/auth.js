const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).render("error", {
      title: "Error",
      message: "Please login to access this page",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res
      .status(401)
      .render("error", { title: "Error", message: "Invalid token" });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .render("error", { title: "Error", message: "Access denied" });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
