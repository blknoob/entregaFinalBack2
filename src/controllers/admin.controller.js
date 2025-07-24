import UserDTO from "../dtos/user.dto.js";
import UsersService from "../services/users.service.js";

const usersService = new UsersService();

class AdminController {
  async getAllUsers(req, res) {
    try {
      const users = await usersService.getAll();
      res.json({
        status: "success",
        users: users.map((user) => new UserDTO(user)),
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await usersService.getById(id);

      if (user.error) {
        return res.status(user.type || 500).json({
          status: "error",
          message: user.message,
        });
      }

      res.json({
        status: "success",
        user: new UserDTO(user),
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async createUser(req, res) {
    try {
      const { first_name, last_name, email, password, role, age } = req.body;

      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({
          status: "error",
          message: "Faltan campos obligatorios",
        });
      }

      const response = await usersService.createUser({
        first_name,
        last_name,
        email,
        password,
        age,
        role,
      });

      if (response.error) {
        return res.status(response.type || 500).json({
          status: "error",
          message: response.message,
        });
      }

      res.status(201).json({
        status: "created",
        message: "Usuario creado correctamente",
        user: new UserDTO(response),
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "ID de usuario requerido",
        });
      }

      const response = await usersService.updateUser(id, updateData);

      if (response.error) {
        return res.status(response.type || 500).json({
          status: "error",
          message: response.message,
        });
      }

      res.json({
        status: "success",
        message: response.message,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "ID de usuario requerido",
        });
      }

      const response = await usersService.deleteUser(id);

      if (response.error) {
        return res.status(response.type || 500).json({
          status: "error",
          message: response.message,
        });
      }

      res.json({
        status: "success",
        message: response.message,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async changeUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!id || !role) {
        return res.status(400).json({
          status: "error",
          message: "ID de usuario y nuevo role son requeridos",
        });
      }

      const response = await usersService.changeUserRole(id, role);

      if (response.error) {
        return res.status(response.type || 500).json({
          status: "error",
          message: response.message,
        });
      }

      res.json({
        status: "success",
        message: "Role actualizado correctamente",
        user: new UserDTO(response),
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }
}

export default AdminController;
