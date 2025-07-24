import passport from "passport";

export const authenticatePassport = passport.authenticate("jwt", {
  session: false,
  failureRedirect: "/login",
});

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.render("permissions", {
      title: "Sin Permisos",
      message: "Solo administradores",
    });
  }
  next();
};

export const redirectPassport = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) return res.redirect("/");
    next();
  })(req, res, next);
};

export function userInSesion(req, res, next) {
  if (req.user) {
    res.locals.user = req.user.toObject
      ? req.user.toObject()
      : JSON.parse(JSON.stringify(req.user));
  } else {
    res.locals.user = null;
  }
  next();
}
