import CartsService from "../services/carts.service.js";

const cartsService = new CartsService();

class CartsViewController {
  async getCartView(req, res) {
    try {
      const userId = req.user._id;
      const cart = await cartsService.getUserCart(userId);
      let plainCart = cart && cart.toObject ? cart.toObject() : cart;
      if (plainCart && Array.isArray(plainCart.products)) {
        plainCart.products = plainCart.products.map((item) => {
          const prod =
            item.product && item.product.toObject
              ? item.product.toObject()
              : item.product;
          return { ...item, product: prod };
        });
      }

      res.render("users/cart", { cart: plainCart });
    } catch (error) {
      res.status(500).send("Error mostrando el carrito");
    }
  }
}

export default CartsViewController;
