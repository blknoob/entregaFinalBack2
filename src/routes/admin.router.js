import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";
import ProductsController from "../controllers/products.controller.js";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
const adminController = new AdminController();
const productsController = new ProductsController();

router.use(authenticateToken, isAdmin);

router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.put("/users/:id/role", adminController.changeUserRole);

router.post("/products", productsController.createProduct);
router.put("/products/:id", productsController.updateProduct);
router.delete("/products/:id", productsController.deleteProduct);

export default router;
