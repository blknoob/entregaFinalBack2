import ProductsService from "../services/products.service.js";

const productsService = new ProductsService();

class ProductsController {
  async getAllProducts(req, res) {
    try {
      const products = await productsService.getAll();

      res.json({
        status: "success",
        products,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productsService.getById(id);

      if (!product) {
        return res.status(404).json({
          status: "error",
          message: "Producto no encontrado",
        });
      }

      res.json({
        status: "success",
        product,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async createProduct(req, res) {
    try {
      const { title, description, price, stock, category, code, thumbnails } =
        req.body;

      if (!title || !description || !price || !stock || !category || !code) {
        return res.status(400).json({
          status: "error",
          message:
            "Faltan campos obligatorios: title, description, price, stock, category, code",
        });
      }

      const productData = {
        title,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        code,
        thumbnails: thumbnails || [],
        status: true,
      };

      const response = await productsService.createProduct(productData);

      if (response.error) {
        return res.status(response.type || 500).json({
          status: "error",
          message: response.message,
        });
      }

      res.status(201).json({
        status: "success",
        message: "Producto creado correctamente",
        product: response,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "ID de producto requerido",
        });
      }

      const response = await productsService.updateProduct(id, updateData);

      if (response.error) {
        return res.status(response.type || 500).json({
          status: "error",
          message: response.message,
        });
      }

      res.json({
        status: "success",
        message: "Producto actualizado correctamente",
        product: response,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: "error",
          message: "ID de producto requerido",
        });
      }

      const response = await productsService.deleteProduct(id);

      if (response.error) {
        return res.status(response.type || 500).json({
          status: "error",
          message: response.message,
        });
      }

      res.json({
        status: "success",
        message: response.message || "Producto eliminado correctamente",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }
}

export default ProductsController;
