import ProductsRepository from "../repositories/products.repository.js";

class ProductsService {
  constructor() {
    this.repository = new ProductsRepository();
  }

  async getAll(options = {}) {
    try {
      return await this.repository.findAll(options);
    } catch (error) {
      console.error("Error en getAll products:", error);
      throw new Error(`Error obteniendo productos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      return await this.repository.findById(id);
    } catch (error) {
      console.error("Error en getById products:", error);
      throw new Error(`Error obteniendo producto: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      return await this.repository.findByCode(code);
    } catch (error) {
      console.error("Error en findByCode products:", error);
      throw new Error(`Error buscando producto por código: ${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      const existingProduct = await this.repository.findByCode(
        productData.code
      );
      if (existingProduct) {
        return {
          error: true,
          type: 400,
          message: "Ya existe un producto con ese código",
        };
      }

      const product = await this.repository.create(productData);

      if (!product) {
        return {
          error: true,
          type: 500,
          message: "Error creando producto",
        };
      }

      return product;
    } catch (error) {
      console.error("Error en createProduct:", error);
      throw new Error(`Error creando producto: ${error.message}`);
    }
  }

  async updateProduct(id, productData) {
    try {
      const product = await this.repository.findById(id);
      if (!product) {
        return {
          error: true,
          type: 404,
          message: "Producto no encontrado",
        };
      }

      if (productData.code && productData.code !== product.code) {
        const existingProduct = await this.repository.findByCode(
          productData.code
        );
        if (existingProduct) {
          return {
            error: true,
            type: 400,
            message: "Ya existe un producto con ese código",
          };
        }
      }

      const updatedProduct = await this.repository.update(id, productData);

      if (!updatedProduct) {
        return {
          error: true,
          type: 500,
          message: "Error actualizando producto",
        };
      }

      return updatedProduct;
    } catch (error) {
      console.error("Error en updateProduct:", error);
      throw new Error(`Error actualizando producto: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await this.repository.findById(id);
      if (!product) {
        return {
          error: true,
          type: 404,
          message: "Producto no encontrado",
        };
      }

      const deletedProduct = await this.repository.delete(id);

      if (!deletedProduct) {
        return {
          error: true,
          type: 500,
          message: "Error eliminando producto",
        };
      }

      return {
        success: true,
        message: "Producto eliminado correctamente",
      };
    } catch (error) {
      console.error("Error en deleteProduct:", error);
      throw new Error(`Error eliminando producto: ${error.message}`);
    }
  }

  async reduceStock(productId, quantity) {
    try {
      const product = await this.repository.findById(productId);
      if (!product) {
        return {
          error: true,
          type: 404,
          message: "Producto no encontrado",
        };
      }

      if (product.stock < quantity) {
        return {
          error: true,
          type: 400,
          message: "Stock insuficiente",
        };
      }

      const newStock = product.stock - quantity;
      const updatedProduct = await this.repository.update(productId, {
        stock: newStock,
      });

      return updatedProduct;
    } catch (error) {
      console.error("Error en reduceStock:", error);
      throw new Error(`Error reduciendo stock: ${error.message}`);
    }
  }
}

export default ProductsService;
