import UsersService from "../services/users.service.js";

const usersService = new UsersService();

class UsersViewController {
  async getCurrentView(req, res) {
    try {
      if (!req.user) {
        return res.redirect("/login");
      }
      const user = req.user.toObject
        ? req.user.toObject()
        : JSON.parse(JSON.stringify(req.user));
      res.render("users/current", { user });
    } catch (error) {
      res.status(500).send("Error mostrando el perfil de usuario");
    }
  }
}

export default UsersViewController;
