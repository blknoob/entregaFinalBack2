import TicketsService from "../services/tickets.service.js";

const ticketsService = new TicketsService();

class TicketsController {
  async getAllTickets(req, res) {
    try {
      const tickets = await ticketsService.getAll();
      res.json({ status: "success", tickets });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Ver consola" });
    }
  }

  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const ticket = await ticketsService.getById(id);

      if (!ticket) {
        return res
          .status(404)
          .json({ status: "error", message: "Ticket no encontrado" });
      }

      res.json({ status: "success", ticket });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Ver consola" });
    }
  }

  async createTicket(req, res) {
    try {
      const ticket = await ticketsService.createTicket(req.body);
      res.status(201).json({ status: "success", ticket });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Ver consola" });
    }
  }
}

export default TicketsController;
