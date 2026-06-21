const ProfissionalModel = require("../../models/profissionaisModel");

class ProfissionalService {

   static async getAllProfissionais() {
      return await ProfissionalModel.findAll();
   }

   static async getProfissionalById(id) {
      const profissional = await ProfissionalModel.findById(id);
      if (!profissional) {
         throw new Error("Profissional não encontrado.");
      }
      return profissional;
   }

   static async createProfissional(profissional) {
      if (!profissional.profissional_nome || !profissional.especialidade) {
         throw new Error("Nome e especialidade são obrigatórios.");
      }
      return await ProfissionalModel.create(profissional);
   }

   static async updateProfissional(id, profissional) {
      const updatedRows = await ProfissionalModel.update(id, profissional);
      if (updatedRows === 0) {
         throw new Error("Profissional não encontrado.");
      }
      return updatedRows;
   }

   static async deleteProfissional(id) {
      const deletedRows = await ProfissionalModel.delete(id);
      if (deletedRows === 0) {
         throw new Error("Profissional não encontrado.");
      }
      return deletedRows;
   }
}
module.exports = ProfissionalService;
