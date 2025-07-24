import { Router } from "express";
import usersRouter from "./users.router.js";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import ticketsRouter from "./tickets.router.js";
import adminRouter from "./admin.router.js";
import viewsRouter from "./views.router.js";

const router = Router();

router.use("/api/users", usersRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/api/tickets", ticketsRouter);

router.use("/api/admin", adminRouter);

router.use("/", viewsRouter);

export default router;
