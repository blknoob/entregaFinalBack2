import { verifyToken } from "../utils/jwt.js";
import UsersRepository from "../repositories/users.repository.js";

const usersRepository = new UsersRepository();

export const authenticateToken = async (req, res, next) => {
  const token =
    req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Token requerido" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ status: "error", message: "Token inválido" });
  }
  const user = await usersRepository.findById(decoded._id);

  if (!user) {
    return res
      .status(401)
      .json({ status: "error", message: "Usuario no válido" });
  }

  req.user = {
    _id: user._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  };

  next();
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ status: "error", message: "No autenticado" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ status: "error", message: "Solo administradores" });
  }

  next();
};
