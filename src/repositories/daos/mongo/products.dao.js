import Product from "./models/products.model.js";

class ProductsDAO {
  async create(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error(`Error al buscar producto: ${error.message}`);
    }
  }

  async findByCode(code) {
    try {
      return await Product.findOne({ code });
    } catch (error) {
      throw new Error(`Error al buscar producto por código: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      return await Product.find({}).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      return await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  async reduceStock(productId, quantity) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      if (product.stock < quantity) {
        throw new Error("Stock insuficiente");
      }

      product.stock -= quantity;
      return await product.save();
    } catch (error) {
      throw new Error(`Error al reducir stock: ${error.message}`);
    }
  }
}

export default ProductsDAO;
