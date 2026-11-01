
export default function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "Please log in first",
    });
  }

  next();
}
