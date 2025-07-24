import { Router } from "express";
import CartsController from "../controllers/carts.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();
const cartsController = new CartsController();

router.use(authenticateToken);

router.get("/", cartsController.getCarts);
router.delete("/", cartsController.clearCart);

router.post("/products/:productId", cartsController.addProduct);
router.put("/products/:productId", cartsController.updateProductQuantity);
router.delete("/products/:productId", cartsController.removeProduct);

router.post("/purchase", cartsController.purchaseCart);

export default router;
