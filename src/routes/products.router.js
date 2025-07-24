import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
const productsController = new ProductsController();

router.get("/", productsController.getAllProducts);

router.post("/", authenticateToken, isAdmin, productsController.createProduct);
router.put(
  "/:id",
  authenticateToken,
  isAdmin,
  productsController.updateProduct
);
router.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  productsController.deleteProduct
);

export default router;
