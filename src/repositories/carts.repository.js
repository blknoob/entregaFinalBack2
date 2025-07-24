import CartsDAO from "./daos/mongo/carts.dao.js";

class CartsRepository {
  constructor() {
    this.dao = new CartsDAO();
  }

  async findById(id) {
    try {
      return await this.dao.findById(id);
    } catch (error) {
      throw new Error(`Error buscando carrito: ${error.message}`);
    }
  }

  async findByUser(userId) {
    try {
      return await this.dao.findByUser(userId);
    } catch (error) {
      throw new Error(`Error buscando carrito por usuario: ${error.message}`);
    }
  }

  async create(cartData) {
    try {
      return await this.dao.create(cartData);
    } catch (error) {
      throw new Error(`Error creando carrito: ${error.message}`);
    }
  }

  async update(id, cartData) {
    try {
      return await this.dao.update(id, cartData);
    } catch (error) {
      throw new Error(`Error actualizando carrito: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await this.dao.delete(id);
    } catch (error) {
      throw new Error(`Error eliminando carrito: ${error.message}`);
    }
  }

  async addProduct(cartId, productId, quantity = 1) {
    try {
      return await this.dao.addProduct(cartId, productId, quantity);
    } catch (error) {
      throw new Error(`Error añadiendo producto al carrito: ${error.message}`);
    }
  }

  async removeProduct(cartId, productId) {
    try {
      return await this.dao.removeProduct(cartId, productId);
    } catch (error) {
      throw new Error(`Error eliminando producto del carrito: ${error.message}`);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      return await this.dao.updateProductQuantity(cartId, productId, quantity);
    } catch (error) {
      throw new Error(`Error actualizando cantidad: ${error.message}`);
    }
  }

  async clearCart(cartId) {
    try {
      return await this.dao.clearCart(cartId);
    } catch (error) {
      throw new Error(`Error limpiando carrito: ${error.message}`);
    }
  }

  async getCartWithProducts(cartId) {
    try {
      return await this.dao.getCartWithProducts(cartId);
    } catch (error) {
      throw new Error(`Error obteniendo carrito con productos: ${error.message}`);
    }
  }

  async isOwner(cartId, userId) {
    try {
      const cart = await this.dao.findById(cartId);
      if (!cart) return false;
      return cart.user && cart.user.toString() === userId.toString();
    } catch (error) {
      throw new Error(`Error verificando propiedad del carrito: ${error.message}`);
    }
  }

  async findAll() {
    try {
      return await this.dao.findAll();
    } catch (error) {
      throw new Error(`Error obteniendo todos los carritos: ${error.message}`);
    }
  }
}

export default CartsRepository;
