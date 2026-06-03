const requireRole = (role) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role_name === role) {
      next();
      return;
    }

    req.flash("error", "You do not have permission to access that page.");
    res.redirect("/");
  };
};

export default requireRole;