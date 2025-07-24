import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const configureHandlebars = (app) => {
  app.engine(
    "hbs",
    exphbs.engine({
      extname: ".hbs",
      defaultLayout: "main",
      layoutsDir: path.join(__dirname, "../views/layouts"),      
      partialsDir: path.join(__dirname, "../views/partials"),
      allowProtoPropertiesByDefault: true,
      helpers: {
        multiply: (a, b) => a * b,
        sumCartTotal: (products) => {
          if (!products) return 0;
          return products.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
        },
        eq: (a, b) => a === b
      }
    })
  );
  app.set("view engine", "hbs");
  app.set("views", path.join(__dirname, "../views"));
};
