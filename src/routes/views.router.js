


// RUTAS VISTAS
import CartsService from "../services/carts.service.js";
import { Router } from "express";
import {
  authenticatePassport,
  requireAdmin,
  redirectPassport,
  userInSesion,
} from "../middlewares/passport.middleware.js";
import ProductsViewController from "../controllers/products.view.js";
import UsersViewController from "../controllers/users.view.js";
import CartsViewController from "../controllers/carts.view.js";

const router = Router();
const cartsService = new CartsService();
const cartsViewController = new CartsViewController();
const productsViewController = new ProductsViewController();
const usersViewController = new UsersViewController();

// Finalizar compra y generar ticket desde la vista
router.post(
  "/cart/checkout",
  authenticatePassport,
  userInSesion,
  async (req, res) => {
    const userId = req.user._id;
    try {
      const cart = await cartsService.getUserCart(userId);
      const ticket = await cartsService.processCartPurchase(cart._id, req.user);
      // Redirigir a la página de tickets o mostrar confirmación
      res.redirect("/tickets");
    } catch (error) {
      console.error("[ERROR /cart/checkout]", error);
      res.status(500).send("Error al finalizar la compra");
    }
  }
);

// Quitar producto del carrito desde la vista
router.post(
  "/cart/remove",
  authenticatePassport,
  userInSesion,
  async (req, res) => {
    const productId = req.body.productId;
    const userId = req.user._id;
    try {
      const cart = await cartsService.getUserCart(userId);
      await cartsService.removeProductToCart(cart._id, productId);
      res.redirect("/cart");
    } catch (error) {
      console.error("[ERROR /cart/remove]", error);
      res.status(500).send("Error quitando producto del carrito");
    }
  }
);

// Rutas públicas
router.get("/login", redirectPassport, (req, res) => {
  res.render("auth/login");
});

router.get("/register", redirectPassport, (req, res) => {
  res.render("auth/register");
});

router.get("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
});

router.get("/reset-password", (req, res) => {
  const { token } = req.query;
  res.render("auth/resetPassword", {
    token: token,
  });
});

// Página principal pública - Catálogo de productos
router.get(
  "/",
  userInSesion,
  productsViewController.getProductsView,
  (req, res) => {
    res.render("index", {
      products: req.products,
      user: res.locals.user || null,
      isPublic: true,
    });
  }
);

router.get(
  "/current",
  authenticatePassport,
  userInSesion,
  usersViewController.getCurrentView
);

router.get("/cart", authenticatePassport, userInSesion, (req, res, next) => {
  cartsViewController.getCartView(req, res, next);
});

router.post(
  "/cart/add",
  authenticatePassport,
  userInSesion,
  async (req, res) => {
    const productId = req.body.productId;
    const userId = req.user._id;
    try {
      // Obtener el carrito del usuario (o crearlo)
      const cart = await cartsService.getUserCart(userId);
      await cartsService.addProductToCart(cart._id, productId, 1);
      res.redirect("/");
    } catch (error) {
      console.error("[ERROR /cart/add]", error);
      res.status(500).send("Error agregando producto al carrito");
    }
  }
);

import TicketsService from "../services/tickets.service.js";
const ticketsService = new TicketsService();

router.get("/tickets", authenticatePassport, userInSesion, async (req, res) => {
  try {
    const userEmail = req.user.email;
    let tickets = await ticketsService.repository.findByUser(userEmail);
    // Convertir a objetos planos y poblar títulos de productos si es posible
    tickets = await Promise.all(
      tickets.map(async (t) => {
        let ticket = t.toObject ? t.toObject() : t;
        if (ticket.products && ticket.products.length) {
          ticket.products = await Promise.all(
            ticket.products.map(async (item) => {
              if (item.product && typeof item.product === "string") {
                // Buscar el producto por ID para obtener el título
                try {
                  const ProductsService = (
                    await import("../services/products.service.js")
                  ).default;
                  const productsService = new ProductsService();
                  const prod = await productsService.getById(item.product);
                  return {
                    ...item,
                    product: {
                      _id: item.product,
                      title: prod?.title || item.product,
                    },
                  };
                } catch {
                  return item;
                }
              }
              return item;
            })
          );
        }
        return ticket;
      })
    );
    res.render("users/tickets", { tickets });
  } catch (error) {
    console.error("[ERROR /tickets]", error);
    res.status(500).send("Error mostrando los tickets");
  }
});

// Vista para solicitar recuperación de contraseña
router.get("/forgot-password", (req, res) => {
  res.render("auth/forgotPassword");
});

// Vista para restablecer contraseña (ya existe, pero aseguro que esté bien)
router.get("/reset-password", (req, res) => {
  const { token } = req.query;
  res.render("auth/resetPassword", { token });
});

// Rutas admin
router.get(
  "/admin/panel",
  authenticatePassport,
  requireAdmin,
  userInSesion,
  (req, res) => {
    res.render("admin/adminPanel");
  }
);

import ProductsService from "../services/products.service.js";
const productsService = new ProductsService();

router.get(
  "/admin/products",
  authenticatePassport,
  requireAdmin,
  userInSesion,
  async (req, res) => {
    try {
      const products = await productsService.getAll();
      const plainProducts = products.map((p) =>
        p.toObject ? p.toObject() : p
      );
      res.render("admin/updateProducts", { products: plainProducts });
    } catch (error) {
      res.status(500).send("Error mostrando productos");
    }
  }
);

router.get(
  "/admin/users",
  authenticatePassport,
  requireAdmin,
  userInSesion,
  async (req, res) => {
    try {
      const UsersService = (await import("../services/users.service.js")).default;
      const usersService = new UsersService();
      const users = await usersService.getAll();
      const plainUsers = users.map(u => u.toObject ? u.toObject() : u);
      res.render("admin/updateUsers", { users: plainUsers });
    } catch (error) {
      res.status(500).send("Error mostrando usuarios");
    }
  }
);

router.post(
  "/admin/products/new",
  authenticatePassport,
  requireAdmin,
  userInSesion,
  async (req, res) => {
    try {
      const { title, description, category, code, price, stock } = req.body;
      const ProductsService = (await import("../services/products.service.js"))
        .default;
      const productsService = new ProductsService();
      await productsService.createProduct({
        title,
        description,
        category,
        code,
        price,
        stock,
      });
      res.redirect("/admin/products");
    } catch (error) {
      res.status(500).send("Error agregando producto");
    }
  }
);

router.post(
  "/admin/products/delete/:id",
  authenticatePassport,
  requireAdmin,
  userInSesion,
  async (req, res) => {
    try {
      const { id } = req.params;
      const ProductsService = (await import("../services/products.service.js"))
        .default;
      const productsService = new ProductsService();
      await productsService.deleteProduct(id);
      res.redirect("/admin/products");
    } catch (error) {
      res.status(500).send("Error eliminando producto");
    }
  }
);

// Ruta para mostrar el formulario de edición de producto
router.get(
  "/admin/products/edit/:id",
  authenticatePassport,
  requireAdmin,
  userInSesion,
  async (req, res) => {
    try {
      const { id } = req.params;
      const ProductsService = (await import("../services/products.service.js"))
        .default;
      const productsService = new ProductsService();
      const product = await productsService.getById(id);
      if (!product) return res.status(404).send("Producto no encontrado");
      res.render("admin/editProduct", {
        product: product.toObject ? product.toObject() : product,
      });
    } catch (error) {
      res.status(500).send("Error mostrando producto para editar");
    }
  }
);

// Ruta para procesar la edición de producto (POST)
router.post(
  "/admin/products/edit/:id",
  authenticatePassport,
  requireAdmin,
  userInSesion,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, category, code, price, stock } = req.body;
      const ProductsService = (await import("../services/products.service.js")).default;
      const productsService = new ProductsService();
      await productsService.updateProduct(id, {
        title,
        description,
        category,
        code,
        price,
        stock,
      });
      res.redirect("/admin/products");
    } catch (error) {
      res.status(500).send("Error actualizando producto");
    }
  }
);

// Ruta para actualizar el rol de un usuario desde el panel admin
router.post(
  "/admin/users/edit/:id",
  authenticatePassport,
  requireAdmin,
  userInSesion,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const UsersService = (await import("../services/users.service.js")).default;
      const usersService = new UsersService();
      await usersService.updateUser(id, { role });
      res.redirect("/admin/users");
    } catch (error) {
      res.status(500).send("Error actualizando rol de usuario");
    }
  }
);

export default router;
