export const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!id || id.length !== 24) {
    return res.status(400).json({ status: "error", message: "ID inválido" });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Email y contraseña son requeridos" });
  }

  next();
};
