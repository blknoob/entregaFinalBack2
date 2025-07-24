import TicketsService from "../services/tickets.service.js";

const ticketsService = new TicketsService();

class TicketsViewController {
  async getAllTicketsView(req, res) {
    try {
      const tickets = await ticketsService.getAll();
      const plainTickets = tickets.map((t) => (t.toObject ? t.toObject() : t));
      res.render("tickets/tickets", { tickets: plainTickets });
    } catch (error) {
      res.status(500).send("Error mostrando tickets");
    }
  }

  async getTicketDetailView(req, res) {
    try {
      const { id } = req.params;
      const ticket = await ticketsService.getById(id);
      if (!ticket) return res.status(404).send("Ticket no encontrado");
      res.render("tickets/ticketDetail", {
        ticket: ticket.toObject ? ticket.toObject() : ticket,
      });
    } catch (error) {
      res.status(500).send("Error mostrando ticket");
    }
  }
}

export default TicketsViewController;
