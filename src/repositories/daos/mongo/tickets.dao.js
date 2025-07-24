import Ticket from "./models/tickets.model.js";

class TicketsDAO {
  async create(ticketData) {
    try {
      if (!ticketData.code) {
        ticketData.code = Date.now() + Math.floor(Math.random() * 1000);
      }

      const ticket = new Ticket(ticketData);
      return await ticket.save();
    } catch (error) {
      throw new Error(`Error al crear ticket: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Ticket.findById(id);
    } catch (error) {
      throw new Error(`Error al buscar ticket: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      return await Ticket.findOne({ code });
    } catch (error) {
      throw new Error(`Error al buscar ticket por código: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await Ticket.find({}).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error al obtener tickets: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      return await Ticket.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(`Error al actualizar ticket: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await Ticket.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar ticket: ${error.message}`);
    }
  }

  async findByUser(userEmail) {
    try {
      return await Ticket.find({ purchaser: userEmail }).sort({
        createdAt: -1,
      });
    } catch (error) {
      throw new Error(`Error al buscar tickets del usuario: ${error.message}`);
    }
  }
}

export default TicketsDAO;
