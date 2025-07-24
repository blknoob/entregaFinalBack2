import UsersRepository from "../repositories/users.repository.js";
import { createHash, isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import MailingService from "./mailing.service.js";

class UsersService {
  constructor() {
    this.repository = new UsersRepository();
    this.mailingService = new MailingService();
  }

  async createUser(userData) {
    try {
      const { first_name, last_name, age, email, password, role } = userData;

      if (!email || !password || !first_name || !last_name) {
        return {
          error: true,
          type: 400,
          message: "Faltan campos obligatorios",
        };
      }

      const existingUser = await this.repository.findByEmail(email);
      if (existingUser) {
        return {
          error: true,
          type: 400,
          message: "El usuario ya existe con ese email",
        };
      }

      const hashedPassword = createHash(password);

      const allowedRoles = ["user", "admin"];
      const assignedRole = allowedRoles.includes(role) ? role : "user";

      const newUserData = {
        first_name,
        last_name,
        age: age || null,
        email,
        password: hashedPassword,
        role: assignedRole,
      };

      const createdUser = await this.repository.create(newUserData);

      if (!createdUser) {
        return { error: true, type: 500, message: "Error creando usuario" };
      }

      return createdUser;
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        return {
          error: true,
          type: 400,
          message: "El usuario ya existe con ese email (detected al guardar)",
        };
      }
      throw new Error(`Error creando usuario: ${error.message}`);
    }
  }

  async register(userData) {
    return await this.createUser(userData);
  }

  async login(email, password) {
    try {
      if (!email || !password) {
        return {
          error: true,
          type: 400,
          message: "Email y contraseña son requeridos",
        };
      }

      const user = await this.repository.findByEmail(email);
      if (!user) {
        return { error: true, type: 404, message: "Usuario no encontrado" };
      }

      if (!isValidPassword(password, user.password)) {
        return { error: true, type: 401, message: "Contraseña incorrecta" };
      }

      const token = generateToken({
        _id: user._id,
        email: user.email,
        role: user.role,
      });

      return {
        user: user,
        token,
      };
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const users = await this.repository.findAll();
      return users;
    } catch (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (!id) {
        return { error: true, type: 400, message: "ID de usuario inválido" };
      }

      const user = await this.repository.findById(id);
      if (!user) {
        return { error: true, type: 404, message: "Usuario no encontrado" };
      }

      return user;
    } catch (error) {
      throw new Error(`Error obteniendo usuario: ${error.message}`);
    }
  }

  async getByEmail(email) {
    try {
      if (!email || typeof email !== "string") {
        return { error: true, type: 400, message: "Email inválido" };
      }

      const user = await this.repository.findByEmail(email);
      if (!user) {
        return { error: true, type: 404, message: "Usuario no encontrado" };
      }

      return user;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por email: ${error.message}`);
    }
  }

  async getByResetToken(token) {
    try {
      if (!token || typeof token !== "string") {
        return { error: true, type: 400, message: "Token inválido" };
      }

      const user = await this.repository.findByResetToken(token);
      if (!user) {
        return { error: true, type: 404, message: "Token inválido o expirado" };
      }

      return user;
    } catch (error) {
      throw new Error(`Error obteniendo usuario por token: ${error.message}`);
    }
  }

  async tryEmail(email) {
    try {
      if (!email || typeof email !== "string") {
        return false;
      }

      const user = await this.repository.findByEmail(email);
      return !!user;
    } catch (error) {
      return false;
    }
  }

  async updateUser(id, updateData) {
    try {
      if (!id || typeof updateData !== "object") {
        return {
          error: true,
          type: 400,
          message: "Parámetros inválidos para actualizar el usuario",
        };
      }

      const user = await this.repository.findById(id);
      if (!user) {
        return { error: true, type: 404, message: "Usuario no encontrado" };
      }

      const result = await this.repository.update(id, updateData);

      if (!result) {
        return {
          error: true,
          type: 500,
          message: "No se pudo actualizar el usuario",
        };
      }

      return {
        status: "success",
        message: "Usuario actualizado correctamente",
      };
    } catch (error) {
      throw new Error(`Error actualizando usuario: ${error.message}`);
    }
  }

  async deleteUser(id) {
    try {
      if (!id) {
        return { error: true, type: 400, message: "ID de usuario inválido" };
      }

      const user = await this.repository.findById(id);
      if (!user) {
        return { error: true, type: 404, message: "Usuario no encontrado" };
      }

      const result = await this.repository.delete(id);

      if (!result) {
        return {
          error: true,
          type: 500,
          message: "No se pudo eliminar el usuario",
        };
      }

      return { status: "success", message: "Usuario eliminado correctamente" };
    } catch (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`);
    }
  }

  async changePassword(userId, newPlainPassword) {
    try {
      if (!userId || typeof newPlainPassword !== "string") {
        return { error: true, type: 400, message: "Parámetros inválidos" };
      }

      const user = await this.repository.findById(userId);
      if (!user) {
        return { error: true, type: 404, message: "Usuario no encontrado" };
      }

      const hashedPassword = createHash(newPlainPassword);
      const result = await this.repository.update(userId, {
        password: hashedPassword,
      });

      if (!result) {
        return {
          error: true,
          type: 500,
          message: "No se pudo cambiar la contraseña",
        };
      }

      return {
        status: "success",
        message: "Contraseña actualizada correctamente",
      };
    } catch (error) {
      throw new Error(`Error cambiando contraseña: ${error.message}`);
    }
  }

  async changeUserRole(userId, newRole) {
    try {
      if (!userId || !newRole) {
        return {
          error: true,
          type: 400,
          message: "ID de usuario y nuevo role son requeridos",
        };
      }

      const allowedRoles = ["user", "admin"];
      if (!allowedRoles.includes(newRole)) {
        return {
          error: true,
          type: 400,
          message: "Role inválido. Solo se permite: user, admin",
        };
      }

      const user = await this.repository.findById(userId);
      if (!user) {
        return { error: true, type: 404, message: "Usuario no encontrado" };
      }

      if (user.role === "admin" && newRole !== "admin") {
        const allUsers = await this.repository.findAll();
        const adminCount = allUsers.filter((u) => u.role === "admin").length;

        if (adminCount <= 1) {
          return {
            error: true,
            type: 400,
            message:
              "No se puede quitar el rol de admin al último administrador",
          };
        }
      }

      const result = await this.repository.update(userId, { role: newRole });

      if (!result) {
        return {
          error: true,
          type: 500,
          message: "No se pudo cambiar el role del usuario",
        };
      }

      return result;
    } catch (error) {
      throw new Error(`Error cambiando role de usuario: ${error.message}`);
    }
  }

  async forgotPassword(email) {
    try {
      if (!email || typeof email !== "string") {
        return { error: true, type: 400, message: "Email es requerido" };
      }

      const user = await this.repository.findByEmail(email);

      if (!user) {
        return { error: false, message: "Email procesado" };
      }

      const resetToken = generateToken({ userId: user._id });
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

      await this.repository.update(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expiresAt,
      });

      await this.mailingService.sendEmail(user.email, resetToken);

      return { error: false, message: "Email de recuperación enviado" };
    } catch (error) {
      throw new Error(`Error en forgot password: ${error.message}`);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      if (!token || !newPassword) {
        return {
          error: true,
          type: 400,
          message: "Token y nueva contraseña son requeridos",
        };
      }

      const user = await this.repository.findByResetToken(token);
      if (!user) {
        return {
          error: true,
          type: 400,
          message: "Token inválido o expirado",
        };
      }

      if (isValidPassword(newPassword, user.password)) {
        return {
          error: true,
          type: 400,
          message: "La nueva contraseña debe ser diferente a la anterior",
        };
      }

      const hashedPassword = createHash(newPassword);

      await this.repository.update(user._id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      return {
        error: false,
        message: "Contraseña restablecida exitosamente",
      };
    } catch (error) {
      throw new Error(`Error en reset password: ${error.message}`);
    }
  }

  async update(id, userData) {
    return await this.updateUser(id, userData);
  }

  async delete(id) {
    return await this.deleteUser(id);
  }
}

export default UsersService;
