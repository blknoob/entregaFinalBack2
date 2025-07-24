import TicketsRepository from "../repositories/tickets.repository.js";
import UsersRepository from "../repositories/users.repository.js";
import CartsRepository from "../repositories/carts.repository.js";
import ProductsRepository from "../repositories/products.repository.js";

class TicketsService {
  constructor() {
    this.repository = new TicketsRepository();
    this.usersRepository = new UsersRepository();
    this.cartsRepository = new CartsRepository();
    this.productsRepository = new ProductsRepository();
  }

  async getAll() {
    try {
      return await this.repository.findAll();
    } catch (error) {
      throw new Error(`Error obteniendo tickets: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      throw new Error(`Error obteniendo ticket: ${error.message}`);
    }
  }

  async createTicket(ticketData) {
    try {
      const ticketCode = `TICKET-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      const newTicketData = {
        code: ticketCode,
        ...ticketData,
      };

      return await this.repository.create(newTicketData);
    } catch (error) {
      throw new Error(`Error creando ticket: ${error.message}`);
    }
  }

  async processPurchase(userId, cartId) {
    try {
      const user = await this.usersRepository.findById(userId);
      const cart = await this.cartsRepository.findById(cartId);

      if (!cart || cart.products.length === 0) {
        throw new Error("Carrito vacío");
      }

      const validProducts = [];
      let totalAmount = 0;

      for (const cartItem of cart.products) {
        const product = await this.productsRepository.findById(
          cartItem.product
        );

        if (product && product.stock >= cartItem.quantity) {
          validProducts.push({
            product: product._id,
            quantity: cartItem.quantity,
            price: product.price,
          });
          totalAmount += product.price * cartItem.quantity;
        }
      }

      if (validProducts.length === 0) {
        throw new Error("No hay productos disponibles");
      }

      const ticketCode = `TICKET-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;

      const ticket = await this.repository.create({
        code: ticketCode,
        amount: totalAmount,
        purchaser: user.email,
        products: validProducts,
      });

      for (const item of validProducts) {
        await this.productsRepository.reduceStock(item.product, item.quantity);
      }

      await this.cartsRepository.update(cartId, { products: [] });

      return {
        success: true,
        ticket,
        message: "Compra procesada exitosamente",
      };
    } catch (error) {
      throw new Error(`Error procesando compra: ${error.message}`);
    }
  }
}

export default TicketsService;
