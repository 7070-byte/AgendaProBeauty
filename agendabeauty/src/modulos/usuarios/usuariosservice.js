const UserModel = require("../../models/usuariosModel");

const validarEmail = require("../../utils/validarEmail");

class UserService {

   static async getAllUsuarios() {
      return await UserModel.findAll();
   }

   static async createUsuario(usuario) {
      if (!validarEmail(usuario.email)) {
         throw new Error("Formato de email inválido.");
      }
      const existingUser = await UserModel.findByEmail(usuario.email);
      if (existingUser) {
         throw new Error("Email já cadastrado.");
      }
      return await UserModel.create(usuario);
   }

   static async updateUsuario(id, usuario) {
      const updatedRows = await UserModel.update(id, usuario);
      if (updatedRows === 0) {
         throw new Error("Usuário não encontrado.");
      }
      return updatedRows;
   }

   static async deleteUsuario(id) {
      const deletedRows = await UserModel.delete(id);
      if (deletedRows === 0) {
         throw new Error("Usuário não encontrado.");
      }
      return deletedRows;
   }
}
module.exports = UserService;
