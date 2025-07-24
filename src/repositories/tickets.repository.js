import TicketsDAO from "./daos/mongo/tickets.dao.js";

class TicketsRepository {
  constructor() {
    this.dao = new TicketsDAO();
  }

  async findById(id) {
    try {
      return await this.dao.findById(id);
    } catch (error) {
      throw new Error(`Error buscando ticket: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      return await this.dao.findByCode(code);
    } catch (error) {
      throw new Error(`Error buscando ticket por código: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.dao.findAll();
    } catch (error) {
      throw new Error(`Error buscando tickets: ${error.message}`);
    }
  }

  async create(ticketData) {
    try {
      return await this.dao.create(ticketData);
    } catch (error) {
      throw new Error(`Error creando ticket: ${error.message}`);
    }
  }

  async update(id, ticketData) {
    try {
      return await this.dao.update(id, ticketData);
    } catch (error) {
      throw new Error(`Error actualizando ticket: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await this.dao.delete(id);
    } catch (error) {
      throw new Error(`Error eliminando ticket: ${error.message}`);
    }
  }

  async findByUser(userId) {
    try {
      return await this.dao.findByUser(userId);
    } catch (error) {
      throw new Error(`Error buscando tickets del usuario: ${error.message}`);
    }
  }
}

export default TicketsRepository;
