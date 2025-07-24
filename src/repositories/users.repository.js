import UsersDAO from "./daos/mongo/users.dao.js";

class UsersRepository {
  constructor() {
    this.dao = new UsersDAO();
  }

  async findById(id) {
    try {
      return await this.dao.findById(id);
    } catch (error) {
      throw new Error(`Error buscando usuario por ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      return await this.dao.findByEmail(email);
    } catch (error) {
      throw new Error(`Error buscando usuario por email: ${error.message}`);
    }
  }

  async findByResetToken(token) {
    try {
      return await this.dao.findByResetToken(token);
    } catch (error) {
      throw new Error(`Error buscando usuario por token: ${error.message}`);
    }
  }

  async create(userData) {
    try {
      return await this.dao.create(userData);
    } catch (error) {
      throw new Error(`Error creando usuario: ${error.message}`);
    }
  }

  async update(id, userData) {
    try {
      return await this.dao.update(id, userData);
    } catch (error) {
      throw new Error(`Error actualizando usuario: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await this.dao.delete(id);
    } catch (error) {
      throw new Error(`Error eliminando usuario: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.dao.findAll();
    } catch (error) {
      throw new Error(`Error buscando usuarios: ${error.message}`);
    }
  }
}

export default UsersRepository;
