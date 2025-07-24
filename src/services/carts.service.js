import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";
import UsersRepository from "../repositories/users.repository.js";

class CartsService {
  constructor() {
    this.repository = new CartsRepository();
    this.productsRepository = new ProductsRepository();
    this.usersRepository = new UsersRepository();
  }

  async getUserCart(userId) {
    try {
      let cart = await this.repository.findByUser(userId);
      if (!cart) {
        cart = await this.createUserCart(userId);
      }
      return cart;
    } catch (error) {
      throw new Error(`Error obteniendo carrito: ${error.message}`);
    }
  }

  async createUserCart(userId) {
    try {
      const cart = await this.repository.create({
        user: userId,
        products: [],
      });
      return cart;
    } catch (error) {
      throw new Error(`Error creando carrito: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const updatedCart = await this.repository.addProduct(
        cartId,
        productId,
        quantity
      );
      return updatedCart;
    } catch (error) {
      throw new Error(`Error agregando producto: ${error.message}`);
    }
  }

  async removeProductToCart(cartId, productId) {
    try {
      const updatedCart = await this.repository.removeProduct(
        cartId,
        productId
      );
      return updatedCart;
    } catch (error) {
      throw new Error(`Error quitando producto: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      if (quantity === 0) {
        return await this.removeProductToCart(cartId, productId);
      }

      const cart = await this.repository.findById(cartId);
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
        const updatedCart = await this.repository.update(cartId, cart);
        return updatedCart;
      }

      return cart;
    } catch (error) {
      throw new Error(`Error actualizando cantidad: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      const clearedCart = await this.repository.update(cartId, {
        products: [],
      });
      return clearedCart;
    } catch (error) {
      throw new Error(`Error vaciando carrito: ${error.message}`);
    }
  }

  async processCartPurchase(cartId, user) {
    try {
      const TicketsService = (await import("./tickets.service.js")).default;
      const ticketsService = new TicketsService();
      return await ticketsService.processPurchase(user._id, cartId);
    } catch (error) {
      throw new Error(`Error procesando compra: ${error.message}`);
    }
  }
}

export default CartsService;
