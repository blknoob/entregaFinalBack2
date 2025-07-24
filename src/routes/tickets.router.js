// Router de tickets - Sencillo y directo
// Solo para administradores - los usuarios compran desde carts

import { Router } from "express";
import TicketsController from "../controllers/tickets.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
const ticketsController = new TicketsController();

router.use(authenticateToken, isAdmin);

router.get("/", ticketsController.getAllTickets);
router.get("/:id", ticketsController.getTicketById);
router.post("/", ticketsController.createTicket);

export default router;
