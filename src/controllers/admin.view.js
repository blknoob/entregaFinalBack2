import UsersService from "../services/users.service.js";

const usersService = new UsersService();

class AdminViewController {
  async getAllUsersView(req, res) {
    try {
      const users = await usersService.getAll();
      const plainUsers = users.map((u) => (u.toObject ? u.toObject() : u));
      res.render("admin/updateUsers", { users: plainUsers });
    } catch (error) {
      res.status(500).send("Error mostrando usuarios");
    }
  }

  async getUserDetailView(req, res) {
    try {
      const { id } = req.params;
      const user = await usersService.getById(id);
      if (!user) return res.status(404).send("Usuario no encontrado");
      res.render("admin/userDetail", {
        user: user.toObject ? user.toObject() : user,
      });
    } catch (error) {
      res.status(500).send("Error mostrando usuario");
    }
  }
}

export default AdminViewController;
