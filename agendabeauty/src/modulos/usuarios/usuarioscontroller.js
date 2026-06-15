const UserService = require('../usuarios/usuariosservice');

class UserController {

   static async getAll(req, res) {
      try {
         const usuarios = await UserService.getAllUsuarios();
         res.json(usuarios); // 
      } catch (error) {
         res.status(500).json({ error: error.message });
      }
   }

   static async create(req, res) {
      try {
         const id = await UserService.createUsuario(req.body);
         res.status(201).json({ message: 'Usuário criado com sucesso.', id });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }

   static async update(req, res) {
      try {
         const id = req.params.id;
         await UserService.updateUsuario(id, req.body);
         res.json({ message: 'Usuário atualizado com sucesso.' });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }

   static async delete(req, res) {
      try {
         const id = req.params.id;
         await UserService.deleteUsuario(id);
         res.json({ message: 'Usuário deletado com sucesso.' });
      } catch (error) {
         res.status(400).json({ error: error.message });
      }
   }
}
module.exports = UserController;

