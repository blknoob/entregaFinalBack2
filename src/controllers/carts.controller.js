import CartsService from "../services/carts.service.js";

const cartsService = new CartsService();

class CartsController {
  async getCarts(req, res) {
    try {
      const userId = req.user._id;
      const cart = await cartsService.getUserCart(userId);
      res.json({ status: "success", cart });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Ver consola" });
    }
  }

  async addProduct(req, res) {
    try {
      const userId = req.user._id;
      const { productId } = req.params;
      const { quantity } = req.body;

      console.log("🛒 Agregando producto al carrito:", {
        userId,
        productId,
        quantity,
      });

      const cart = await cartsService.getUserCart(userId);
      const result = await cartsService.addProductToCart(
        cart._id,
        productId,
        quantity
      );
      res.json({ status: "success", result });
    } catch (error) {
      console.error("❌ Error en addProduct:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const userId = req.user._id;
      const { productId } = req.params;
      const { quantity } = req.body;

      const cart = await cartsService.getUserCart(userId);
      const result = await cartsService.updateProductQuantity(
        cart._id,
        productId,
        quantity
      );
      res.json({ status: "success", result });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Ver consola" });
    }
  }

  async removeProduct(req, res) {
    try {
      const userId = req.user._id;
      const { productId } = req.params;

      const cart = await cartsService.getUserCart(userId);
      const result = await cartsService.removeProductToCart(
        cart._id,
        productId
      );
      res.json({ status: "success", result });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Ver consola" });
    }
  }

  async clearCart(req, res) {
    try {
      const userId = req.user._id;

      const cart = await cartsService.getUserCart(userId);
      const result = await cartsService.clearCart(cart._id);
      res.json({ status: "success", result });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Ver consola" });
    }
  }

  async purchaseCart(req, res) {
    try {
      const userId = req.user._id;

      const cart = await cartsService.getUserCart(userId);
      const result = await cartsService.processCartPurchase(cart._id, req.user);
      res.json({ status: "success", result });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Ver consola" });
    }
  }
}

export default CartsController;
