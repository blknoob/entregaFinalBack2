import ProductsService from "../services/products.service.js";

const productsService = new ProductsService();

class ProductsViewController {
  async getProductsView(req, res, next) {
    try {
      const products = await productsService.getAll();
      req.products = products.map((p) => (p.toObject ? p.toObject() : p));
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default ProductsViewController;
