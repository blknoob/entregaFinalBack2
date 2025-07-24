import User from "./models/users.model.js";

class UsersDAO {
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  }

  async findByResetToken(token) {
    try {
      return await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
    } catch (error) {
      throw new Error(`Error al buscar usuario por token: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await User.find({});
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      return await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  }
}

export default UsersDAO;
